import { loadConfig } from "./config.js";
import { checkForSlot } from "./observer.js";

async function main() {
  const config = loadConfig();
  const { notified, slot } = await checkForSlot(config);

  if (notified) {
    console.log("Notified about an earlier slot.");
  } else if (slot) {
    console.log(
      `Earliest slot (${slot.date}) is not before TARGET_DATE (${config.targetDate}). No notification.`
    );
  } else {
    console.log("No slots available for the current search.");
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
