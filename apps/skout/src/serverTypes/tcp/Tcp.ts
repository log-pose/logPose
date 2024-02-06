import { psqlClient } from "@logpose/drizzle";
import Server from "../Server";
import net from "net";

export default class Tcp {
  static instance: Tcp | null = null;

  constructor() {
    if (Tcp.instance) {
      return Tcp.instance;
    }

    Tcp.instance = this;
  }
  async ping(ip: string, port: number) {
    try {
      ip = "8.8.8.8";
      port = 53;
      const client = new net.Socket();
      client.connect(port, ip, () => {
        console.log("Connected");
        client.destroy();
      });

      client.on("error", (error) => {
        console.log("Error", error);
        client.destroy();
      });
    } catch (error) {
      console.log("Error", error);
    }
  }
}
