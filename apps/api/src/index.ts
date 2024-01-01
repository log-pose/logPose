import { createServer } from "./server";
import logger from "@logpose/logger";

const port = process.env.BACKEND_PORT;
const server = createServer();

server.listen(port, () => {
  logger.info(`API running on port ${port}`);
});
