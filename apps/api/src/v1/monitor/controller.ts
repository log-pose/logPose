import {ApiError, ApiResponse, asyncHandler} from "../../utils";
import {Request, RequestHandler, Response} from "express";
import * as s from "./service"
import {monitors} from "@logpose/drizzle";

export const createMonitor: RequestHandler = asyncHandler(
    async (req: Request, res: Response) => {
        const {
            name,
            orgId,
            heartbeatInterval,
            retries,
            url
        } = req.body;

        if (!name) {
            throw new ApiError(400, "Name is required");
        }
        if (!orgId) {
            throw new ApiError(400, "orgId is required");
        }
        if (!heartbeatInterval) {
            throw new ApiError(400, "heartbeatInterval is required");
        }
        if (!retries) {
            throw new ApiError(400, "retries is required");
        }
        if (!url) {
            throw new ApiError(400, "url is required");
        }

        const monitorId = await s.createMonitor(
            {
                name,
                orgId,
                heartbeatInterval,
                retries,
                url
            }
        )
        if (!monitorId) {
            throw new ApiError(500, "Something went wrong");
        }

        res.status(201).json(
            new ApiResponse(201, {
                    monitorId
                },
                "User created")
        )
    }
)


export const getMonitorById: RequestHandler = asyncHandler(
    async (req: Request, res: Response) => {
        const {id} = req.params

        const monitor = await s.getMonitorById(id)

        if(monitor.length === 0) {
            throw new ApiError(404, "No monitors found.")
        }

        res.status(200).json(
            new ApiResponse(200, monitor, "Monitors found")
        )
    }
)
export const updateMonitor: RequestHandler = asyncHandler(
    async (req: Request, res: Response) => {
        const {id} = req.params
        const {
            name,
            orgId,
            heartbeatInterval,
            retries,
            url
        } = req.body;

        if (!name) {
            throw new ApiError(400, "Name is required");
        }
        if (!orgId) {
            throw new ApiError(400, "orgId is required");
        }
        if (!heartbeatInterval) {
            throw new ApiError(400, "heartbeatInterval is required");
        }
        if (!retries) {
            throw new ApiError(400, "retries is required");
        }
        if (!url) {
            throw new ApiError(400, "url is required");
        }

        const updatedMonitorId = await s.updateMonitor({
            id,
            name,
            orgId,
            heartbeatInterval,
            retries,
            url
        })

        if (!updatedMonitorId) {
            throw new ApiError(404, "Monitor not found");
        }

        res.status(200).json(
            new ApiResponse(201, {updatedMonitorId}, "Monitors updated")
        )
    }
)
export const deleteMonitor: RequestHandler = asyncHandler(
    async (req: Request, res: Response) => {
        const {id} = req.params
        await s.deleteMonitor(id)
        res.status(200).json(
            new ApiResponse(200, "Deleted monitor")
        )
    }
)
