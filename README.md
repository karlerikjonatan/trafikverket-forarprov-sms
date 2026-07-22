# trafikverket-driving-tests-observer

A small, dependency-free template that observes the availability of Trafikverket
driving tests (_förarprov_) and notifies you as soon as a slot becomes available
earlier than a date you choose.

It runs a single poll-and-check pass: it queries Trafikverket for the earliest
available test occasion and, if that occasion is before your target date, calls a
`notify()` function that you customize. Scheduling and delivery are left to you —
this repo is a starting point, not a hosted service.

> **Disclaimer:** This uses Trafikverket's internal booking endpoint, which is
> unofficial and may change or rate-limit without notice. Poll responsibly and
> use at your own risk.

## Requirements

- [Node.js](https://nodejs.org/) 18 or newer (uses the built-in global `fetch`).

## Setup

1. **Install** (there are no runtime dependencies, but this creates the lockfile):

   ```bash
   npm install
   ```

2. **Configure your target date** — copy the example env file and edit it:

   ```bash
   cp .env.example .env
   ```

   Set `TARGET_DATE` to the latest date you'd accept (`YYYY-MM-DD`). You'll be
   notified about any slot earlier than this.

3. **Provide your search body** — copy the example payload and fill it in:

   ```bash
   cp payload.example.json payload.json
   ```

   `payload.json` is git-ignored because it contains personal details. To get
   real values:

   - Log in and start a booking at <https://fp.trafikverket.se/boka/>.
   - Open your browser's **DevTools → Network** tab.
   - Search for a test; find the request to `occasion-bundles`.
   - Copy its **request payload** into `payload.json`. Key fields include
     `socialSecurityNumber`, `licenceId`, `examinationTypeId`, `locationId`, and
     `nearbyLocationIds`.

## Run

```bash
node --env-file=.env src/index.js
```

`--env-file` requires Node 20.6+. On older versions, export the variables
yourself (e.g. `TARGET_DATE=2026-12-31 node src/index.js`) or use `npm start`
after exporting them:

```bash
npm start
```

Each run performs one check and exits (non-zero on error), which makes it easy to
put on a schedule.

## Customize how you're notified

Delivery is intentionally left open. Edit [`src/notify.js`](src/notify.js) — it
receives `{ date, time, locationName }` and logs to the console by default. Swap
the body for a webhook, SMS/email provider, Discord message, push notification,
or anything else.

## Schedule it

Run it on whatever cadence you like. Two common options:

**cron** (every 5 minutes between 05:00–19:00):

```cron
*/5 5-19 * * * cd /path/to/trafikverket-driving-tests-observer && node --env-file=.env src/index.js >> observer.log 2>&1
```

**GitHub Actions** (`.github/workflows/observe.yml`):

```yaml
name: observe
on:
  schedule:
    - cron: "*/5 5-19 * * *"
  workflow_dispatch:
jobs:
  check:
    runs-on: ubuntu-latest
    env:
      TARGET_DATE: ${{ vars.TARGET_DATE }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      # Provide payload.json from a secret so personal details stay out of git.
      - run: echo "$PAYLOAD_JSON" > payload.json
        env:
          PAYLOAD_JSON: ${{ secrets.PAYLOAD_JSON }}
      - run: node src/index.js
```

## Project structure

```
src/
├── index.js       # entrypoint — one poll-and-check pass
├── observer.js    # fetches occasions, finds the earliest, compares to target
├── notify.js      # the seam you customize (console by default)
└── config.js      # reads/validates env + loads payload.json
```

## License

[MIT](LICENSE)
