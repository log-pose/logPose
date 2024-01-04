import { createServer } from "./server";
import logger from "@logpose/logger";

const port = process.env.BACKEND_PORT || 3000;
const secret = process.env.JWT_SECRET;

if (!secret) {
  logger.error("JWT_SECRET not set");
  process.exit(1);
}
const server = createServer();

server.listen(port, () => {
  logger.info(`API running on port ${port}`);
});
