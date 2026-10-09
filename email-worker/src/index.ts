import PostalMime from "postal-mime";

const REQUIRED_COLUMNS = [
  "NAME",
  "USERDEFINED_ID",
  "STARTDATE",
  "LASTUPDATER_LASTNAME",
  "LASTUPDATER_FIRSTNAME",
  "LASTUPDATER_TITLE",
  "CREATOR_LASTNAME",
  "CREATOR_FIRSTNAME",
] as const;

const PUBLIC_COLUMNS = [
  "NAME",
  "USERDEFINED_ID",
  "STARTDATE",
  "LASTUPDATER_FIRSTNAME",
  "CREATOR_FIRSTNAME",
] as const;

type PublicColumn = (typeof PUBLIC_COLUMNS)[number];
type Course = Record<PublicColumn, string>;

interface Env {
  GITHUB_TOKEN: string;
  FLUX_TODAY_GITHUB_TOKEN?: string;
  GITHUB_OWNER: string;
  GITHUB_REPO: string;
  GITHUB_BRANCH: string;
  GITHUB_DATA_PATH: string;
  ALLOWED_RECIPIENT: string;
  ALLOWED_SENDER?: string;
}

type IncomingEmail = {
  from: string;
  to: string;
  raw: ReadableStream;
  setReject(reason: string): void;
};

export default {
  async fetch(request: Request): Promise<Response> {
    const incoming = new URL(request.url);
    const basePath = "/EU.Learn.UpcomingCourses";
    if (!incoming.pathname.startsWith(basePath)) {
      return new Response("Not found", { status: 404 });
    }

    const upstream = new URL(request.url);
    upstream.protocol = "https:";
    upstream.hostname = "eu-learn-upcoming-courses.pages.dev";
    upstream.port = "";
    const publicAsset = incoming.pathname.slice(`${basePath}/`.length);
    if (
      publicAsset.startsWith("data/") ||
      ["kiwi-mark.webp", "kiwi-blob.webp", "kiwi-large.webp", "footer-community.webp", "og.png", "favicon.svg"].includes(publicAsset)
    ) {
      upstream.pathname = `/${publicAsset}`;
    }
    return fetch(new Request(upstream, request));
  },

  async email(message: IncomingEmail, env: Env): Promise<void> {
    if (message.to.toLowerCase() !== env.ALLOWED_RECIPIENT.toLowerCase()) {
      message.setReject("This address does not accept catalogue imports.");
      return;
    }

    if (env.ALLOWED_SENDER && message.from.toLowerCase() !== env.ALLOWED_SENDER.toLowerCase()) {
      message.setReject("This sender is not authorised to replace the catalogue.");
      return;
    }

    const parsed = await PostalMime.parse(message.raw);
    if (parsed.subject?.trim().toUpperCase() === "FLUX TODAY ALP JSON") {
      const jsonAttachment = parsed.attachments.find((item) =>
        item.filename?.toLowerCase().endsWith(".json") || item.mimeType === "application/json",
      );
      const rawJson = jsonAttachment
        ? new TextDecoder("utf-8").decode(jsonAttachment.content)
        : parsed.text?.trim();

      if (!rawJson) {
        message.setReject("A JSON body or attachment is required.");
        return;
      }

      let rows: unknown;
      try {
        rows = JSON.parse(rawJson);
      } catch {
        message.setReject("The message does not contain valid JSON.");
        return;
      }

      const records = Array.isArray(rows)
        ? rows
        : (rows && typeof rows === "object" && Array.isArray((rows as { value?: unknown }).value)
          ? (rows as { value: unknown[] }).value
          : null);
      if (!records) {
        message.setReject("The ALP JSON must be an array or contain a value array.");
        return;
      }

      await publishFluxToday(env, records);
      return;
    }

    const attachment = parsed.attachments.find((item) =>
      item.filename?.toLowerCase().endsWith(".csv") || item.mimeType === "text/csv",
    );

    if (!attachment) {
      message.setReject("A CSV attachment is required.");
      return;
    }

    const csv = new TextDecoder("utf-8").decode(attachment.content);
    const courses = selectColumns(parseCsv(csv));

    if (courses.length === 0) {
      message.setReject("The CSV contains no data rows.");
      return;
    }

    const catalogue = {
      updatedAt: new Date().toISOString(),
      sourceFile: attachment.filename ?? "catalogue.csv",
      rowCount: courses.length,
      courses,
    };

    await replaceGitHubFile(env, JSON.stringify(catalogue, null, 2) + "\n");
  },
};

function selectColumns(rows: Record<string, string>[]): Course[] {
  if (rows.length === 0) return [];
  const present = new Set(Object.keys(rows[0]));
  const missing = REQUIRED_COLUMNS.filter((column) => !present.has(column));
  if (missing.length) throw new Error(`Missing required CSV columns: ${missing.join(", ")}`);

  return rows.map((row) => Object.fromEntries(
    PUBLIC_COLUMNS.map((column) => [column, row[column]?.trim() ?? ""]),
  ) as Course);
}

async function publishFluxToday(env: Env, records: unknown[]): Promise<void> {
  if (!env.FLUX_TODAY_GITHUB_TOKEN) throw new Error("Flux Today GitHub token is not configured.");
  const now = new Date();
  const payload = JSON.stringify({
    updatedAt: now.toISOString(),
    rowCount: records.length,
    records,
  }, null, 2) + "\n";
  const config = {
    owner: "modulow",
    repo: "Flux-Today",
    branch: "main",
    token: env.FLUX_TODAY_GITHUB_TOKEN,
  };
  await putGitHubFile(config, "public/data/latest.json", payload, `Update ALP data (${now.toISOString().slice(0, 10)})`);
  const archivePath = `data/${now.getUTCFullYear()}/alp-${now.toISOString().replace(/[:.]/g, "-")}.json`;
  await putGitHubFile(config, archivePath, payload, `Archive ALP data (${now.toISOString()})`);
}

async function putGitHubFile(
  config: { owner: string; repo: string; branch: string; token: string },
  path: string,
  content: string,
  message: string,
): Promise<void> {
  const endpoint = `https://api.github.com/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repo)}/contents/${path.split("/").map(encodeURIComponent).join("/")}`;
  const headers = {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${config.token}`,
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "Flux-Today-ALP-Bridge",
  };
  const current = await fetch(`${endpoint}?ref=${encodeURIComponent(config.branch)}`, { headers });
  let sha: string | undefined;
  if (current.ok) sha = ((await current.json()) as { sha: string }).sha;
  else if (current.status !== 404) throw new Error(`GitHub read failed (${current.status}): ${await current.text()}`);

  const bytes = new TextEncoder().encode(content);
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  }
  const response = await fetch(endpoint, {
    method: "PUT",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ message, content: btoa(binary), branch: config.branch, ...(sha ? { sha } : {}) }),
  });
  if (!response.ok) throw new Error(`GitHub update failed (${response.status}): ${await response.text()}`);
}

function parseCsv(input: string): Record<string, string>[] {
  const clean = input.replace(/^\uFEFF/, "");
  const delimiter = detectDelimiter(clean);
  const matrix: string[][] = [];
  let row: string[] = [];
  let value = "";
  let quoted = false;

  for (let index = 0; index < clean.length; index += 1) {
    const character = clean[index];
    if (character === '"') {
      if (quoted && clean[index + 1] === '"') {
        value += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === delimiter && !quoted) {
      row.push(value);
      value = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && clean[index + 1] === "\n") index += 1;
      row.push(value);
      if (row.some((cell) => cell.trim() !== "")) matrix.push(row);
      row = [];
      value = "";
    } else {
      value += character;
    }
  }

  row.push(value);
  if (row.some((cell) => cell.trim() !== "")) matrix.push(row);
  if (matrix.length < 2) return [];

  const headers = matrix[0].map(normalizeHeader);
  return matrix.slice(1).map((cells) => Object.fromEntries(
    headers.map((header, index) => [header, cells[index] ?? ""]),
  ));
}

function normalizeHeader(value: string) {
  return value.trim().replace(/^\uFEFF/, "").replace(/[\s-]+/g, "_").toUpperCase();
}

function detectDelimiter(csv: string): string {
  const header = csv.split(/\r?\n/, 1)[0];
  const candidates = [";", ",", "\t"];
  return candidates.sort((a, b) => header.split(b).length - header.split(a).length)[0];
}

async function replaceGitHubFile(env: Env, content: string): Promise<void> {
  if (!env.GITHUB_OWNER || !env.GITHUB_TOKEN) throw new Error("GitHub credentials are not configured.");

  const path = env.GITHUB_DATA_PATH || "data/courses.json";
  const endpoint = `https://api.github.com/repos/${encodeURIComponent(env.GITHUB_OWNER)}/${encodeURIComponent(env.GITHUB_REPO)}/contents/${path.split("/").map(encodeURIComponent).join("/")}`;
  const headers = {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${env.GITHUB_TOKEN}`,
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "EU-Learn-UpcomingCourses",
  };

  const current = await fetch(`${endpoint}?ref=${encodeURIComponent(env.GITHUB_BRANCH)}`, { headers });
  let sha: string | undefined;
  if (current.ok) sha = ((await current.json()) as { sha: string }).sha;
  else if (current.status !== 404) throw new Error(`GitHub read failed (${current.status}): ${await current.text()}`);

  const bytes = new TextEncoder().encode(content);
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  }

  const response = await fetch(endpoint, {
    method: "PUT",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({
      message: `Replace course catalogue (${new Date().toISOString().slice(0, 10)})`,
      content: btoa(binary),
      branch: env.GITHUB_BRANCH,
      ...(sha ? { sha } : {}),
    }),
  });

  if (!response.ok) throw new Error(`GitHub update failed (${response.status}): ${await response.text()}`);
}
