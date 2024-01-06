import { eq, psqlClient, server, server_kind } from "@logpose/drizzle";
import logger from "@logpose/logger";

export default class Server {
  constructor() {
    this.monitorServer();
  }
  async monitorServer() {
    logger.info("Monitoring Server");
    const servers = await psqlClient
      .select({
        serverName: server.server_name,
        serverKind: server_kind.kind_name,
        ip: server.ip,
        port: server.port,
        connectionString: server.connecton_string,
        uri: server.uri,
        heartbeatInterval: server.heartbeat_interval,
        retries: server.retries,
        active: server.active,
      })
      .from(server)
      .where(eq(server.active, true))
      .leftJoin(server_kind, eq(server.server_kind_id, server_kind.id));

    console.log(servers);
  }
}
