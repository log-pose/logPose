import { Request, Response } from "express";
import {
  createNewMonitor,
  getRequiredMonitorParams,
  fetchMonitorById,
  fetchAllMonitorByUserId,
  deleteMonitor,
  updateMonitor,
} from "./service";
import { z } from "zod";
import { IRequest } from "../../types/request";

const createMonitorSchema = z.object({
  kind: z.string(),
  uri: z.string().url({ message: "uri must be a valid url" }),
  ip: z.string().ip(),
  port: z.number(),
  connectionString: z.string(),
  interval: z.number(),
  retries: z.number(),
});
export const createMonitor = async (req: IRequest, res: Response) => {
  try {
    const {
      kind,
      uri,
      ip,
      port,
      serverName,
      connectionString,
      interval,
      retries,
    } = req.body;
    const userId = req.body.user.id;
    createMonitorSchema.partial().parse({
      uri,
      ip,
      port,
      connectionString,
      interval,
      retries,
    });

    if (!kind) throw new Error("kind is required");

    const { kindId, requiredStr } = await getRequiredMonitorParams(kind);
    requiredStr?.forEach((param: string) => {
      if (!req.body[param]) throw new Error(`${param} is required`);
    });
    //   try {
    const newMonitor = {
      uri,
      ip,
      port,
      server_name: serverName,
      connection_string: connectionString,
      server_kind_id: kindId,
      interval,
      retries,
      user_id: userId,
    };

    await createNewMonitor(newMonitor);
    return res.status(201).json({ message: "created" });
  } catch (e: any) {
    return res.status(400).json({ message: "Something went wrong", error: e });
  }
};

export const getMonitorById = async (req: Request, res: Response) => {
  const { id } = req.params;

  z.string().uuid().parse(id);

  const monitor = await fetchMonitorById(id);
  if (!monitor) {
    return res.status(404).json({ message: "Monitor not found" });
  }
  return res.status(200).json({ message: "success", data: monitor });
};

export const getAllMonitorsForUser = async (req: IRequest, res: Response) => {
  const userId = req.body.user.id;
  try {
    z.string().uuid().parse(userId);
  } catch (e) {
    return res.status(400).json({ message: "Invalid id" });
  }
  try {
    const monitors = await fetchAllMonitorByUserId(userId);
    return res.status(200).json({ message: "success", data: monitors });
  } catch (e) {
    return res.status(500).json({ message: "Something went wrong", error: e });
  }
};

export const updateMonitorById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    kind,
    uri,
    ip,
    port,
    serverName,
    connectionString,
    interval,
    retries,
  } = req.body;
  try {
    z.string().uuid().parse(id);
  } catch (e) {
    return res.status(400).json({ message: "Invalid id" });
  }

  const monitor = await fetchMonitorById(id);
  if (!monitor) {
    return res.status(404).json({ message: "Monitor not found" });
  }

  const { kindId, requiredStr } = await getRequiredMonitorParams(kind);
  requiredStr?.forEach((param) => {
    if (!req.body[param]) throw `${param} is required`;
  });
  const updateParams = {
    id,
    server_kind_id: kindId,
    uri,
    ip,
    port,
    server_name: serverName,
    connection_string: connectionString,
    interval,
    retries,
  };

  try {
    await updateMonitor(updateParams);
    return res
      .status(200)
      .json({ message: `Server monitor updated successfully` });
  } catch (e) {
    return res.status(500).json({ message: "Something went wrong", error: e });
  }
};

export const deleteMonitorById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    z.string().uuid().parse(id);
  } catch (e) {
    return res.status(400).json({ message: "Invalid id" });
  }

  try {
    await deleteMonitor(id);
    return res.status(200).json({ message: "success" });
  } catch (e) {
    return res.status(500).json({ message: "Something went wrong", error: e });
  }
};
