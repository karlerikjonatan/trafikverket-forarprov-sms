import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const DEFAULT_REQUEST_URL = "https://fp.trafikverket.se/boka/occasion-bundles";
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Read and validate runtime configuration from the environment and payload file.
 *
 * @returns {{ targetDate: string, requestUrl: string, payload: object }}
 */
export function loadConfig() {
  const targetDate = process.env.TARGET_DATE;

  if (!targetDate) {
    throw new Error(
      "Missing TARGET_DATE. Set it to the latest acceptable test date " +
        "(YYYY-MM-DD) — you'll be notified about any slot earlier than this. " +
        "Copy .env.example to .env to get started."
    );
  }

  if (!DATE_PATTERN.test(targetDate) || Number.isNaN(Date.parse(targetDate))) {
    throw new Error(`Invalid TARGET_DATE "${targetDate}". Expected format YYYY-MM-DD.`);
  }

  const requestUrl = process.env.REQUEST_URL || DEFAULT_REQUEST_URL;

  return { targetDate, requestUrl, payload: loadPayload() };
}

function loadPayload() {
  const payloadPath = join(__dirname, "..", "payload.json");

  try {
    return JSON.parse(readFileSync(payloadPath, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error(
        "Missing payload.json. Copy payload.example.json to payload.json and " +
          "fill in the values from a real Trafikverket booking session " +
          "(see the README for how to capture them)."
      );
    }
    throw new Error(`Could not read payload.json: ${error.message}`);
  }
}
