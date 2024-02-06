import { cache } from "@logpose/cache";
import { eq, psqlClient, server, server_kind } from "@logpose/drizzle";
import logger from "@logpose/logger";
import { Tcp } from ".";

export default class Server {
  constructor() {
    this.monitorServer();
  }
  async monitorServer() {
    logger.info("Monitoring Server");

    try {
      const servers = await this.getServers();
    } catch (error) {
      logger.error("Error getting servers", error);
      return;
    }
  }

  async getServers() {
    let servers;

    // cache.setKeyJson("isServersUpdated", "$", {
    //   serversUpdated: true,
    //   updatedServerKind: ["http"],
    // });

    const isServersUpdated = await cache.getKeyJson("isServersUpdated");
    if (!isServersUpdated) {
      servers = await psqlClient
        .select({
          id: server.id,
          server_name: server.server_name,
          ip: server.ip,
          port: server.port,
          uri: server.uri,
          connection_string: server.connection_string,
          interval: server.heartbeat_interval,
          retries: server.retries,
          server_kind_id: server.server_kind_id,
          kind: server_kind.kind_name,
        })
        .from(server)
        .leftJoin(server_kind, eq(server.server_kind_id, server_kind.id));

      const serversObject: any = {};
      servers.forEach((server) => {
        const kind = server.kind as string;
        if (!serversObject[kind]) {
          serversObject[kind] = [];
        }
        serversObject[kind].push(server);
      });

      const tcp = new Tcp();
      // const http = new Http();

      serversObject.tcp.forEach((server: any) => {
        tcp.ping(server.ip, server.port).then((res) => {
          logger.info("res", res);
        });
      });
    }

    // ping everything

    return servers;
  }
}
