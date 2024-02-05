import axios from "axios";

import { sysadmin, servers } from "../../../logpose.config.json";
import logger from "@logpose/logger";

const BASE_URL = "http://localhost:3000";

export default async function () {
  try {
    const token = await register();
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    if (token) {
      servers.forEach(async (server) => {
        try {
          const response = await axios.post(
            `${BASE_URL}/api/v1/server`,
            server
          );
          logger.info(`Added server ${server.serverName}`);
        } catch (error) {
          logger.error("Error adding server", error);
        }
      });
    }
  } catch (error) {
    console.error("Failed to register or login", error);
  }
}

async function register() {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/v1/auth/register`,
      sysadmin
    );
    return response.data.token;
  } catch (error) {
    logger.error("Error registering, trying to login");
    return login();
  }
}

async function login() {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/v1/auth/login`,
      sysadmin
    );
    return response.data.data.token;
  } catch (error) {
    logger.error("Error logging in");
    return null;
  }
}
