import { RequestHandler, Response } from "express";
import ApiResponse from "../../lib/ApiResponse";
import ApiError from "../../lib/ApiError";
import asyncHandler from "../../lib/asyncHandler";
import { IRequest } from "../../types/request";
import * as s from "./service"
import { authOrg } from "../../lib/authorize";

export const create: RequestHandler = asyncHandler(async (req: IRequest, res: Response) => {
    const { id: userId } = req.user
    const { orgId, type, addInfo, name } = req.body
    if (!orgId) {
        throw new ApiError(400, "Org id is required")
    }
    const isAuth = authOrg(userId, "create:notifiers", orgId)
    if (!isAuth) {
        throw new ApiError(403, "You cannot create a notifier in this org")
    }
    const isValid = s.validate(type, addInfo)
    if (!isValid.success) {
        const str = `${isValid.err} as additional info for ${type}`
        throw new ApiError(400, str)
    }
    const id = await s.create(name, type, addInfo)
    res.status(201).json(
        new ApiResponse(201, "notifier created", { id })
    )
})
export const update: RequestHandler = asyncHandler(async (req: IRequest, res: Response) => {
    const { id: userId } = req.user
    const { id } = req.params
    const { orgId, type, addInfo, name } = req.body
    if (!orgId) {
        throw new ApiError(400, "Org id is required")
    }
    const isAuth = authOrg(userId, "update:notifiers", orgId)
    if (!isAuth) {
        throw new ApiError(403, "You cannot update a notifier in this org")
    }
    const isValid = s.validate(type, addInfo)
    if (!isValid.success) {
        const str = `${isValid.err} as additional info for ${type}`
        throw new ApiError(400, str)
    }
    const notifierId = await s.update(name, type, addInfo, id)
    res.status(200).json(
        new ApiResponse(200, "notifier updated", { id: notifierId })
    )
})
export const deleteNotifiers: RequestHandler = asyncHandler(async (req: IRequest, res: Response) => {
    const { id: userId } = req.user
    const { orgId } = req.query
    const { id } = req.params
    if (!orgId) {
        throw new ApiError(400, "Org id is required")
    }
    const isAuth = authOrg(userId, "delete:notifiers", orgId as string)
    if (!isAuth) {
        throw new ApiError(403, "You cannot update a notifier in this org")
    }
    await s.deleteNotifiers(id)
    res.status(200).json(
        new ApiResponse(200, "notifier deleted", null)
    )
})
export const getById: RequestHandler = asyncHandler(async (req: IRequest, res: Response) => {
    const { id: userId } = req.user
    const { orgId } = req.query
    const { id } = req.params
    if (!orgId) {
        throw new ApiError(400, "Org id is required")
    }
    const isAuth = authOrg(userId, "view:notifiers", orgId as string)
    if (!isAuth) {
        throw new ApiError(403, "You cannot view a notifier in this org")
    }
    const notifier = await s.getById(id)
    res.status(200).json(
        new ApiResponse(200, "notifier found", notifier)
    )
})

type CReq = IRequest & {
    query : {
        monitorId : string,
        kind : string,
        orgId : string
    }
}
const validkind = ['org', 'monitor']
export const getNotifiers: RequestHandler = asyncHandler(async (req: CReq, res: Response) => {
    const { id: userId } = req.user
    const { monitorId, kind = "org", orgId } = req.query
    
    if (!validkind.includes(kind)) {
        throw new ApiError(400, "Not a valid kind")
    }
    const entityId = kind === "org" ? orgId : monitorId

    const isAuth = authOrg(userId, "view:org", orgId as string)
    if (!isAuth) {
        throw new ApiError(403, "You cannot view a notifier in this org")
    }

    const notifiers = s.getEntityNotifier(kind, entityId)

    res.status(200).json(
        new ApiResponse(200, `Notifiers for ${kind} found`, notifiers)
    )
})