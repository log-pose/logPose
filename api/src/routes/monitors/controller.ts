import { RequestHandler, Response } from "express";
import ApiResponse from "../../lib/ApiResponse";
import ApiError from "../../lib/ApiError";
import asyncHandler from "../../lib/asyncHandler";
import { IRequest } from "../../types/request";
import * as u from "../../lib/utils"
import * as s from "./services"
import * as c from "../../lib/constants"

export const createMonitors: RequestHandler = asyncHandler(async (req: IRequest, res: Response) => {
    let { monitorType, orgId, name, ping, additionalInfo = {} } = req.body
    const user = req.user
    if (!orgId) {
        throw new ApiError(400, "orgId is required")
    }
    if (!c.pingInterval.includes(ping)) {
        throw new ApiError(400, "Not a valid ping interval")
    }
    if (!c.monitorTypes.includes(monitorType)) {
        throw new ApiError(400, "Not a valid monitor type")
    }
    if (!name) {
        name = u.generateNames()
    }
    const isUserValid = await u.checkIfValidUser(user.id, orgId, 'write')

    if (!isUserValid) {
        throw new ApiError(403, "You cannot perform this operation")
    }
    const monitorId = s.createMonitor(name, additionalInfo, ping, orgId, monitorType)
    res.status(201).json(
        new ApiResponse(201, "new monitor created", monitorId)
    )
})

export const updateMonitor: RequestHandler = asyncHandler(async (req: IRequest, res: Response) => {
    let { orgId, name, ping, additionalInfo = {}, monitorType } = req.body
    const { id } = req.params
    const user = req.user
    if (!orgId) {
        throw new ApiError(400, "orgId is required")
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
    const isUserValid = await u.checkIfValidUser(user.id, orgId, 'write')
    if (!isUserValid) {
        throw new ApiError(403, "You cannot perform this operation")
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
    const isUserValid = await u.checkIfValidUser(user.id, monitor.orgId!, 'read')
    if (!isUserValid) {
        throw new ApiError(403, "You cannot perform this operation")
    }
    res.status(200).json(
        new ApiResponse(200, "monitor fetched", { monitor })
    )
})

export const deleteMonitor: RequestHandler = asyncHandler(async (req: IRequest, res: Response) => {
    const { id } = req.params
    const user = req.user
    const monitor = await s.getMonitorById(id)
    const isUserValid = await u.checkIfValidUser(user.id, monitor.orgId!, 'write')
    if (!isUserValid) {
        throw new ApiError(403, "You cannot perform this operation")
    }
    await s.deleteMonitor(id)
    res.status(200).json(
        new ApiResponse(200, "Deleted successfully", null)
    )
})