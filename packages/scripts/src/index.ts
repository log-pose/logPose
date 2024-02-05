import logger from "@logpose/logger";
import { initPSQL } from "./initDB";
import initDev from "./initDev";

// (async () => {
//   await initPSQL().catch((err) => {
//     logger.error(err);
//   });
// })();
initDev();
