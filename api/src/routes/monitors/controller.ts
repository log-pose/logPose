import { RequestHandler, Response } from "express";
import ApiResponse from "../../lib/ApiResponse";
import ApiError from "../../lib/ApiError";
import asyncHandler from "../../lib/asyncHandler";
import { IRequest } from "../../types/request";
import * as u from "../../lib/utils"
import * as s from "./services"
import * as c from "../../lib/constants"
import logger from "../../lib/logger";
import { authOrg } from "../../lib/authorize";

export const createMonitors: RequestHandler = asyncHandler(async (req: IRequest, res: Response) => {
    let { monitorType, orgId, name, ping, additionalInfo = {} } = req.body
    const user = req.user
    if (!orgId) {
        throw new ApiError(400, "orgId is required")
    }
    const isAuth = await authOrg(user.userId, "create:monitor", orgId)
    if (!isAuth) {
        throw new ApiError(403, "You cannot create a monitor for this org")
    }
    if (!c.pingInterval.includes(ping)) {
        throw new ApiError(400, "Not a valid ping interval")
    }
    if (!c.monitorTypes.includes(monitorType)) {
        throw new ApiError(400, "Not a valid monitor type")
    }
    const validMonitor = s.validateMonitorType(monitorType, additionalInfo)
    if (!validMonitor.success) {
        const str = `${validMonitor.err} as additional info for ${monitorType}`
        throw new ApiError(400, str)
    }
    if (!name) {
        name = u.generateNames()
    }

    try {
        const monitorId = await s.createMonitor(name, additionalInfo, ping, orgId, monitorType)
        res.status(201).json(
            new ApiResponse(201, "new monitor created", monitorId)
        )
    } catch (e) {
        logger.error(e)
        throw new ApiError(500, "Something Went wrong")
    }
})

export const updateMonitor: RequestHandler = asyncHandler(async (req: IRequest, res: Response) => {
    let { orgId, name, ping, additionalInfo = {}, monitorType } = req.body
    const { id } = req.params
    const user = req.user
    if (!orgId) {
        throw new ApiError(400, "orgId is required")
    }
    const isAuth = await authOrg(user.userId, "update:monitor", orgId)
    if (!isAuth) {
        throw new ApiError(403, "You cannot update a monitor for this org")
    }
    if (!c.monitorTypes.includes(monitorType)) {
        throw new ApiError(400, "Not a valid monitor type")
    }
    if (!c.pingInterval.includes(ping)) {
        throw new ApiError(400, "Not a valid ping interval")
    }
    if (!name) {
        name = u.generateNames()
    }

    const monitorId = await s.updateMonitor(name, additionalInfo, ping, orgId, monitorType, id)
    res.status(200).json(
        new ApiResponse(200, "Monitor updated", monitorId)
    )
})

export const getMonitorById: RequestHandler = asyncHandler(async (req: IRequest, res: Response) => {
    const { id } = req.params
    const user = req.user
    const monitor = await s.getMonitorById(id)

    const isAuth = await authOrg(user.userId, "view:monitor", monitor.orgId!)
    if (!isAuth) {
        throw new ApiError(403, "You cannot view a monitor for this org")
    }
    res.status(200).json(
        new ApiResponse(200, "monitor fetched", { monitor })
    )
})

export const deleteMonitor: RequestHandler = asyncHandler(async (req: IRequest, res: Response) => {
    const { id } = req.params
    const user = req.user
    const monitor = await s.getMonitorById(id)
    const isAuth = await authOrg(user.userId, "delete:monitor", monitor.orgId!)
    if (!isAuth) {
        throw new ApiError(403, "You cannot delete a monitor for this org")
    }
    await s.deleteMonitor(id)
    res.status(200).json(
        new ApiResponse(200, "Deleted successfully", null)
    )
})