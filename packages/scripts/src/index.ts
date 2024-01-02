import logger from "@logpose/logger";
import { initPSQL } from "./initDB";

(async () => {
  await initPSQL().catch((err) => {
    logger.error(err);
  });
})();
