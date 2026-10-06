export const dynamic = "force-dynamic";

type Catalogue = { updatedAt: string | null; courses: unknown[] };

export async function GET(request: Request) {
  const owner = process.env.GITHUB_OWNER;
  const repository = process.env.GITHUB_REPO ?? "EU.Learn.UpcomingCourses";
  const token = process.env.GITHUB_TOKEN;
  const branch = process.env.GITHUB_BRANCH ?? "main";

  if (owner && token) {
    const response = await fetch(
      `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repository)}/contents/data/courses.json?ref=${encodeURIComponent(branch)}`,
      {
        headers: {
          Accept: "application/vnd.github.raw+json",
          Authorization: `Bearer ${token}`,
          "X-GitHub-Api-Version": "2022-11-28",
          "User-Agent": "EU-Learn-UpcomingCourses",
        },
        cache: "no-store",
      },
    );

    if (response.ok) {
      const catalogue = (await response.json()) as Catalogue;
      return Response.json(catalogue, { headers: { "Cache-Control": "no-store" } });
    }
  }

  const fallback = await fetch(new URL("/data/courses.json", request.url), { cache: "no-store" });
  return new Response(await fallback.text(), {
    status: fallback.status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}
