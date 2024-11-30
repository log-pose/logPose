import { RequestHandler, Response } from "express";
import * as service from "./service"
import ApiResponse from "../../lib/ApiResponse";
import ApiError from "../../lib/ApiError";
import asyncHandler from "../../lib/asyncHandler";
import { IRequest } from "../../types/request";
import * as c from "../../lib/constants"
import * as u from "../../lib/utils"
import { authOrg } from "../../lib/authorize";

export const createOrg: RequestHandler = asyncHandler(async (req: IRequest, res: Response) => {
    const { id: userId } = req.user
    const { orgName } = req.body
    try {
        const orgId = await service.createOrg(orgName, userId as string)
        res.status(201).json(new ApiResponse(201, "successfully created the organization", {
            orgId,
            orgName,
            orgPlan: c.DEFAULT_PLAN
        },))
    } catch (e) {
        throw new ApiError(400, "Name already taken")
    }
})

export const getOrgById: RequestHandler = asyncHandler(async (req: IRequest, res: Response) => {
    const { orgId } = req.params;
    const { id: userId } = req.user;
    if (!orgId) {
        throw new ApiError(400, "id is required")
    }
    const isAuth = await authOrg(userId, "view:org", orgId)
    if(!isAuth){
        throw new ApiError(403, "You cannot view this org")
    }
    const org = await service.getOrgById(orgId)
    res.status(200).json(new ApiResponse(200, "org found", org))
})

export const getUserOrg: RequestHandler = asyncHandler(async (req: IRequest, res: Response) => {
    const { limit, pageNumber } = req.query
    const { id: userId } = req.user
    if (parseInt(pageNumber as string) < 1) {
        throw new ApiError(400, "Not a valid page number")
    }
    const response = await service.getUserOrgById(userId, parseInt(limit as string), parseInt(pageNumber as string))
    res.status(200).json(
        new ApiResponse(200, "user organizations fetched successfully", response.orgs, {
            isNext: response.isNext,
            isPrev: response.isPrev,
            pageNumber,
            limit
        })
    )
})

export const editOrg: RequestHandler = asyncHandler(async (req: IRequest, res: Response) => {
    const { orgId } = req.params;
    const { id: userId } = req.user;
    const { orgName } = req.body;
    const isAuth = await authOrg(userId, "update:org", orgId)
    if(!isAuth){
        throw new ApiError(403, "You cannot update this org")
    }
    const updatedOrgId = await service.updateOrg(orgId, orgName)
    if (!updatedOrgId || updatedOrgId !== orgId) {
        throw new ApiError(500, "Something went wrong")
    }
    res.status(200).json(
        new ApiResponse(200, "Updated org", null)
    )
})

export const deleteOrg: RequestHandler = asyncHandler(async (req: IRequest, res: Response) => {
    const { orgId } = req.params;
    const { id: userId } = req.user;
    const isAuth = await authOrg(userId, "delete:org", orgId)
    if (!isAuth) {
        throw new ApiError(403, "You cannot delete this org")
    }
    const deletedOrgId = await service.deleteOrg(orgId)
    if (!deleteOrg || deletedOrgId !== orgId) {
        throw new ApiError(500, "Something went wrong")
    }
    res.status(200).json(
        new ApiResponse(200, "Deleted org", null)
    )
})

export const inviteUserToOrg: RequestHandler = asyncHandler(async (req: IRequest, res: Response) => {
    const { orgId } = req.params
    const { userToInvite, invitedUserRole } = req.body
    const { id: userId } = req.user;
    const isAuth = await authOrg(userId, "user:org", orgId)
    if (!isAuth) {
        throw new ApiError(403, "you cannot invite other users to this org")
    }
    const ifAlreadyMember = await service.checkIfUserAlreadyMember(userToInvite, orgId)
    if (ifAlreadyMember) {
        throw new ApiError(400, "User is already a member")
    }
    const token = await service.saveInviteToken(invitedUserRole, userToInvite, userId, orgId)
    // TODO: for sending mail
    //const userOrg = await service.getOrgById(orgId, userId)
    //const userDetails = await service.getUserById(userId)

    //const {
    //    data: _,
    //    error
    //} = await service.sendInviteMail(userToInvite, userOrg.name as string, userDetails.username as string, token)
    //if (error) {
    //    throw new ApiError(500, "Something went wrong")
    //}
    res.status(200).json(new ApiResponse(200, "User invited to org", { token }))
})

export const acceptInvite: RequestHandler = asyncHandler(async (req: IRequest, res: Response) => {
    const { id: userId } = req.user
    const { joinToken } = req.params
    const tokenInfo = await service.getTokenInfo(joinToken)
    if (!tokenInfo) {
        throw new ApiError(400, "Invite Expired!")
    }
    const userInfo = await service.getUserById(userId)
    if (userInfo.id !== tokenInfo.invitee) {
        throw new ApiError(403, "You cannot join")
    }
    const ifAlreadyMember = await service.checkIfUserAlreadyMember(tokenInfo.invitee, tokenInfo.orgId)
    if (ifAlreadyMember) {
        throw new ApiError(400, "User is already a member")
    }
    await service.joinOrg(joinToken, userId, tokenInfo.orgId, tokenInfo.invitedRole)
    res.status(200).json(
        new ApiResponse(200, "User joined org successfully", null)
    )
})

export const removeUserFromOrg: RequestHandler = asyncHandler(async (req: IRequest, res: Response) => {
    const { orgId } = req.params
    const { userId: userToRemove } = req.query
    const { id: orgAdmin } = req.user
    const isAuth = await authOrg(orgAdmin, "user:org", orgId)
    if (!isAuth) {
        throw new ApiError(403, "you cannot invite other users to this org")
    }
    await service.removeUser(orgId, userToRemove as string)
    res.status(200).json(
        new ApiResponse(200, "User Removed", null)
    )
})

//TODO if the last admin exits the org should be deleted
export const exitOrg: RequestHandler = asyncHandler(async (req: IRequest, res: Response) => {
    const { id: userId } = req.user
    const { orgId } = req.params
    await service.removeUser(orgId, userId)
    res.status(200).json(
        new ApiResponse(200, "User exited org", null)
    )
})

export const getOrgMembers: RequestHandler = asyncHandler(async (req: IRequest, res: Response) => {
    const { orgId } = req.params
    const { limit, page } = req.query
    const {id: userId} = req.user
    const isAuth = await authOrg(userId, "view:org", orgId)
    if (!isAuth) {
        throw new ApiError(403, "You cannot view this org")
    }
    const response = await service.getOrgUser(orgId, parseInt(limit as string), parseInt(page as string))
    res.status(200).json(
        new ApiResponse(200, "user organizations fetched successfully", response.orgs, {
            isNext: response.isNext,
            isPrev: response.isPrev,
            page,
            limit
        })
    )
})

export const modifyUserOrgRole: RequestHandler = asyncHandler(async (req: IRequest, res: Response) => {
    const { id: userId } = req.user
    const { orgId } = req.params
    const { toRole, updateUser } = req.body
    const isAuth = await authOrg(userId, "user:org", orgId)
    if (!isAuth) {
        throw new ApiError(403, "You cannot update user roles")
    }
    await service.updateUserOrgRole(updateUser, orgId, toRole)
    res.status(200).json(
        new ApiResponse(200, "Org org role updated successfully", null)
    )
})

export const getOrgMonitors: RequestHandler = asyncHandler(async (req: IRequest, res: Response) => {
    const { id: userId } = req.user
    const { id } = req.params
    const isAuth = await authOrg(userId, "view:org", id)
    if (!isAuth) {
        throw new ApiError(403, "You cannot view this org")
    }
    const monitors = await service.getMonitors(id)
    if (monitors.length === 0) {
       throw new ApiError(404, "No monitors found.")
    }
    res.status(200).json(
        new ApiResponse(200, "Monitors found", monitors)
    )
})