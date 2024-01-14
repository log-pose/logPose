import e, { Request, RequestHandler, Response } from "express";
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
import { ApiError, ApiResponse, asyncHandler } from "../../utils";

const createMonitorSchema = z.object({
  kind: z.string(),
  uri: z.string().url({ message: "uri must be a valid url" }),
  ip: z.string().ip(),
  port: z.number(),
  connectionString: z.string(),
  interval: z.number(),
  retries: z.number(),
});

export const createMonitor: RequestHandler = asyncHandler(
  async (req: IRequest, res: Response) => {
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

    if (!kind) {
      throw new ApiError(400, "kind is required");
    }

    const { kindId, requiredStr } = await getRequiredMonitorParams(kind);
    requiredStr?.forEach((param: string) => {
      if (!req.body[param]) {
        throw new ApiError(400, `${param} is required`);
      }
    });
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
  }
);

export const getMonitorById: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    z.string().uuid().parse(id);

    const monitor = await fetchMonitorById(id);
    if (!monitor) {
      throw new ApiError(404, "Monitor not found");
    }
    return res.status(200).json(new ApiResponse(200, monitor, "success"));
  }
);

export const getAllMonitorsForUser: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.body.user.id;
    z.string().uuid().parse(userId);
    const monitors = await fetchAllMonitorByUserId(userId);
    return res.status(200).json(new ApiResponse(200, monitors, "success"));
  }
);

export const updateMonitorById: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
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
    z.string().uuid().parse(id);

    const monitor = await fetchMonitorById(id);
    if (!monitor) {
      throw new ApiError(404, "Monitor not found");
    }

    const { kindId, requiredStr } = await getRequiredMonitorParams(kind);
    requiredStr?.forEach((param: string) => {
      if (!req.body[param]) {
        throw new ApiError(400, `${param} is required`);
      }
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

    await updateMonitor(updateParams);
    return res
      .status(200)
      .json({ message: `Server monitor updated successfully` });
  }
);

export const deleteMonitorById: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    z.string().uuid().parse(id);

    await deleteMonitor(id);
    return res.status(200).json(new ApiResponse(201, null, "success"));
  }
);
