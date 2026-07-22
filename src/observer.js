import { notify } from "./notify.js";

/**
 * Run a single poll-and-check pass against Trafikverket.
 *
 * Fetches the earliest available occasion for the configured search and, if it
 * falls before `targetDate`, calls {@link notify}.
 *
 * @param {{ targetDate: string, requestUrl: string, payload: object }} config
 * @returns {Promise<{ notified: boolean, slot: object | null }>}
 */
export async function checkForSlot({ targetDate, requestUrl, payload }) {
  const response = await fetch(requestUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Request to ${requestUrl} failed with status ${response.status}`);
  }

  const { data } = await response.json();

  // Guard every hop: `bundles` / `occasions` may be empty arrays.
  const occasion = data?.bundles?.[0]?.occasions?.[0];

  if (!occasion) {
    return { notified: false, slot: null };
  }

  const { date, locationName, time } = occasion;

  if (date < targetDate) {
    const slot = { date, time, locationName };
    await notify(slot);
    return { notified: true, slot };
  }

  return { notified: false, slot: { date, time, locationName } };
}
