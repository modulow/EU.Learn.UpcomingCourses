# EU.Learn.UpcomingCourses

Daily pipeline for the course catalogue sent to `learn-it@ep.europa.kiwi`.

## Flow

1. Cloudflare Email Routing sends incoming messages for `learn-it@ep.europa.kiwi` to the Email Worker in `email-worker/`.
2. The Worker accepts the CSV attachment, detects comma/semicolon/tab separators and validates the eight required columns.
3. It keeps only the course details and the updater/creator first names, then replaces `public/data/courses.json` through the GitHub Contents API. No historical rows are merged.
4. GitHub Pages rebuilds the public searchable, sortable table.

## Required CSV columns

`NAME`, `USERDEFINED_ID`, `STARTDATE`, `LASTUPDATER_LASTNAME`, `LASTUPDATER_FIRSTNAME`, `LASTUPDATER_TITLE`, `CREATOR_LASTNAME`, `CREATOR_FIRSTNAME`.

Header matching is case-insensitive and converts spaces or hyphens to underscores.
Surnames and job titles are validated on input but are not stored in the public catalogue.

## GitHub token

Create one fine-grained token restricted to this repository with **Contents: Read and write**. Save it as a Cloudflare Worker secret named `GITHUB_TOKEN`; never commit it.

The website uses a separate read-only copy of the same secret, together with `GITHUB_OWNER`, `GITHUB_REPO` and `GITHUB_BRANCH`.

## Cloudflare Email Routing

- Activate `europa.kiwi` in Cloudflare Email Routing.
- Create a route for `learn-it@ep.europa.kiwi` whose action is the deployed Email Worker.
- Set `GITHUB_OWNER` in `email-worker/wrangler.jsonc` or as an environment variable.
- Optionally set `ALLOWED_SENDER` to the exact address allowed to replace the data.
- Store the token with `wrangler secret put GITHUB_TOKEN` and deploy the Worker.

The repository is public so GitHub Pages can serve the catalogue. Only first names are published.
