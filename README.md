# EU.Learn.UpcomingCourses

Daily pipeline for the course catalogue sent to `learn.it@europas.kiwi`.

## Flow

1. Cloudflare Email Routing sends incoming messages for `learn.it@europas.kiwi` to the Email Worker in `email-worker/`.
2. The Worker accepts the CSV attachment, detects comma/semicolon/tab separators and validates the eight required columns.
3. It replaces `data/courses.json` through the GitHub Contents API. No historical rows are merged.
4. The website reads the current private GitHub file through its server-side API and renders a searchable, sortable table.

## Required CSV columns

`NAME`, `USERDEFINED_ID`, `STARTDATE`, `LASTUPDATER_LASTNAME`, `LASTUPDATER_FIRSTNAME`, `LASTUPDATER_TITLE`, `CREATOR_LASTNAME`, `CREATOR_FIRSTNAME`.

Header matching is case-insensitive and converts spaces or hyphens to underscores.

## GitHub token

Create one fine-grained token restricted to this repository with **Contents: Read and write**. Save it as a Cloudflare Worker secret named `GITHUB_TOKEN`; never commit it.

The website uses a separate read-only copy of the same secret, together with `GITHUB_OWNER`, `GITHUB_REPO` and `GITHUB_BRANCH`.

## Cloudflare Email Routing

- Add and verify `europas.kiwi` in Cloudflare Email Routing.
- Create a route for `learn.it@europas.kiwi` whose action is the deployed Email Worker.
- Set `GITHUB_OWNER` in `email-worker/wrangler.jsonc` or as an environment variable.
- Optionally set `ALLOWED_SENDER` to the exact address allowed to replace the data.
- Store the token with `wrangler secret put GITHUB_TOKEN` and deploy the Worker.

The repository should remain private because the catalogue contains personal names.
