import { psqlClient } from "@logpose/drizzle";
import Server from "../Server";

export default class Tcp {
  constructor() {
    this.getServers();
  }
  getServers() {
    const arr: number[] = [];
    for (let i = 0; i < arr.length; i++) {
      this.pingServer(arr[i]);
    }
  }
  pingServer(id: number) {
    //get server psql()
    // store in redis
    // ping server
  }
}
