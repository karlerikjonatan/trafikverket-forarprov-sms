/**
 * Called once for every slot found earlier than your TARGET_DATE.
 *
 * This is the seam you customize. By default it just logs to the console —
 * replace the body with however you want to be notified.
 *
 * @param {{ date: string, time: string, locationName: string }} slot
 */
export async function notify(slot) {
  console.log(`🚗 Slot available: ${slot.date} ${slot.time} — ${slot.locationName}`);

  // TODO: plug in your channel here (SMS, email, webhook, Discord, push…).
  //
  // Examples:
  //   • Webhook:  await fetch(process.env.WEBHOOK_URL, {
  //                 method: "POST",
  //                 headers: { "Content-Type": "application/json" },
  //                 body: JSON.stringify(slot),
  //               });
  //   • SMS/email: call your provider's SDK here.
  //
  // Keep it `async` so you can `await` your delivery call.
}
