import { json, urlencoded } from "body-parser";
import express, { Express } from "express";
import cors from "cors";
import router from "./routes";

export const createServer: () => Express = () => {
  const app = express();
  app
    .disable("x-powered-by")
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cors())
    .use("/api/v1", router)
    .get("/healthz", (req, res) => {
      return res.json({ ok: true });
    });

  return app;
};
