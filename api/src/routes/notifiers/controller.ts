
import { RequestHandler, Response } from "express";
import ApiResponse from "../../lib/ApiResponse";
import ApiError from "../../lib/ApiError";
import asyncHandler from "../../lib/asyncHandler";
import { IRequest } from "../../types/request";
import * as u from "../../lib/utils"
import * as c from "../../lib/constants"
import logger from "../../lib/logger";
import { authOrg } from "../../lib/authorize";

export const create: RequestHandler = asyncHandler(async (req: IRequest, res: Response) => {
    const { id: userId } = req.user
    const { orgId } = req.body
    if (!orgId){
        throw new ApiError(400, "Org id is required")
    }
    const isAuth = authOrg(userId, "create:notifiers", orgId)
    if(!isAuth){
        throw new ApiError(403, "You cannot create a notifier in this org")
    }
})
export const update: RequestHandler = asyncHandler(async (req: IRequest, res: Response) => {
    const { id: userId } = req.user
    const { orgId } = req.body
    if (!orgId) {
        throw new ApiError(400, "Org id is required")
    }
    const isAuth = authOrg(userId, "update:notifiers", orgId)
    if (!isAuth) {
        throw new ApiError(403, "You cannot update a notifier in this org")
    }
 })
export const deleteNotifiers: RequestHandler = asyncHandler(async (req: IRequest, res: Response) => {
    const { id: userId } = req.user
    const { orgId } = req.query
    if (!orgId) {
        throw new ApiError(400, "Org id is required")
    }
    const isAuth = authOrg(userId, "delete:notifiers", orgId as string)
    if (!isAuth) {
        throw new ApiError(403, "You cannot update a notifier in this org")
    }
 })
export const getById: RequestHandler = asyncHandler(async (req: IRequest, res: Response) => {
    const { id: userId } = req.user
    const { orgId } = req.query
    if (!orgId) {
        throw new ApiError(400, "Org id is required")
    }
    const isAuth = authOrg(userId, "view:notifiers", orgId as string)
    if (!isAuth) {
        throw new ApiError(403, "You cannot view a notifier in this org")
    }
 })