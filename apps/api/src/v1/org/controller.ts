import {RequestHandler, Response} from "express";
import {ApiError, ApiResponse, asyncHandler} from "../../utils";
import {org} from "../../zod";
import {IRequest} from "../../types/request";
import * as service from "./service"

export const createOrg: RequestHandler = asyncHandler(async (req: IRequest, res: Response) => {
	const validInput = org.createOrgSchema.safeParse(req.body)
	if (!validInput.success) {
		throw new ApiError(400, "Please check if required fields are present")
	}
	const {id: userId} = req.user
	const orgName = req.body.orgName
	try {
		const orgId = await service.createOrg(orgName, userId)
		res.status(201).json(new ApiResponse(201, {orgId, orgName, orgPlan: "free"}, "successfully created the organization"))
	}
	catch (e) {
		throw new ApiError(400, "Name already taken")
	}
})

export const getOrgById: RequestHandler = asyncHandler(async (req: IRequest, res: Response) => {
	const {orgId} = req.params;
	const {id: userId} = req.user;
	if (!orgId) {
		throw new ApiError(400, "id is required")
	}
	const org = await service.getOrgById(orgId, userId)
	console.log(org)
	res.status(200).json(new ApiResponse(200, org))
})

export const getUserOrg: RequestHandler = asyncHandler(async (req: IRequest, res: Response) => {
	const {limit, pageNumber} = req.query
	const {id: userId} = req.user
	if (parseInt(pageNumber as string) < 1) {
		throw new ApiError(400, "Not a valid page number")
	}
	const response = await service.getUserOrgById(userId, parseInt(limit as string), parseInt(pageNumber as string))
	res.status(200).json(
		new ApiResponse(200, response.orgs, "user organizations fetched successfully", {
			isNext: response.isNext,
			isPrev: response.isPrev,
			pageNumber,
			limit
		})
	)
})

export const editOrg: RequestHandler = asyncHandler(async (req: IRequest, res: Response) => {
	const {orgId} = req.params;
	const {id: userId} = req.user;
	const {orgName} = req.body;
	const isUserValid = await service.checkIfValidUser(userId, orgId, 'admin')
	if (!isUserValid) {
		throw new ApiError(403, "You cannot perform this operation")
	}
	const updatedOrgId = await service.updateOrg(orgId, orgName)
	if (!updatedOrgId || updatedOrgId !== orgId) {
		throw new ApiError(500, "Something went wrong")
	}
	res.status(200).json(
		new ApiResponse(200, "Updated org")
	)
})

export const deleteOrg: RequestHandler = asyncHandler(async (req: IRequest, res: Response) => {
	const {orgId} = req.params;
	const {id: userId} = req.user;
	const isUserValid = await service.checkIfValidUser(userId, orgId, 'admin')
	if (!isUserValid) {
		throw new ApiError(403, "You cannot perform this operation")
	}
	const deletedOrgId = await service.deleteOrg(orgId)
	if (!deleteOrg || deletedOrgId !== orgId) {
		throw new ApiError(500, "Something went wrong")
	}
	res.status(200).json(
		new ApiResponse(200, "Deleted org")
	)
})

export const inviteUserToOrg: RequestHandler = asyncHandler(async (req: IRequest, res: Response) => {
	const {orgId} = req.params
	const {userToInvite, invitedUserRole} = req.body
	const {id: userId} = req.user;
	const validInputSchema = org.inviteUserToOrgSchema.safeParse(req.body)
	if (!validInputSchema.success) {
		throw new ApiError(400, "Please check if required fields are present")
	}
	const isUserValid = await service.checkIfValidUser(userId, orgId, 'admin')
	if (!isUserValid) {
		throw new ApiError(403, "You cannot perform this operation")
	}
	const ifAlreadyMember = await service.checkIfUserAlreadyMember(userToInvite, orgId)
	if (ifAlreadyMember) {
		throw new ApiError(400, "User is already a member")
	}
	const userOrg = await service.getOrgById(orgId, userId)
	const userDetails = await service.getUserById(userId)
	const token = await service.saveInviteToken(invitedUserRole, userToInvite, userId, orgId)
	const {data: _, error} = await service.sendInviteMail(userToInvite, userOrg.name as string, userDetails.username as string, token)
	if (error) {
		throw new ApiError(500, "Something went wrong")
	}
	res.status(200).json(new ApiResponse(200, null, "User invited to org"))
})

export const acceptInvite: RequestHandler = asyncHandler(async (req: IRequest, res: Response) => {
	const {id: userId} = req.user
	const {joinToken} = req.params
	const tokenInfo = await service.getTokenInfo(joinToken)
	if (!tokenInfo) {
		throw new ApiError(400, "Invite Expired!")
	}
	const userInfo = await service.getUserById(userId)
	if (userInfo.email !== tokenInfo.invitee) {
		throw new ApiError(403, "Forbidden")
	}
	const ifAlreadyMember = await service.checkIfUserAlreadyMember(tokenInfo.invitee, tokenInfo.orgId)
	if (ifAlreadyMember) {
		throw new ApiError(400, "User is already a member")
	}
	await service.joinOrg(joinToken, userId, tokenInfo.orgId, tokenInfo.invitedRole)
	res.status(200).json(
		new ApiResponse(200, null, "User joined org successfully")
	)
})

export const removeUserFromOrg: RequestHandler = asyncHandler(async (req: IRequest, res: Response) => {
	const {orgId} = req.params
	const {userId: userToRemove} = req.query
	const {id: orgAdmin} = req.user
	const isUserValid = await service.checkIfValidUser(orgAdmin as string, orgId, 'admin')
	if (!isUserValid) {
		throw new ApiError(403, "You cannot perform this operation")
	}
	await service.removeUser(orgId, userToRemove as string)
	res.status(200).json(
		new ApiResponse(200, null, "User Removed")
	)
})

//TODO if the last admin exits the org should be deleted
export const exitOrg: RequestHandler = asyncHandler(async (req: IRequest, res: Response) => {
	const {id: userId} = req.user
	const {orgId} = req.params
	await service.removeUser(orgId, userId)
	res.status(200).json(
		new ApiResponse(200, null, "Used exited org")
	)
})

export const getOrgMembers: RequestHandler = asyncHandler(async (req: IRequest, res: Response) => {
	const {orgId} = req.params
	const {limit, page} = req.query
	const {email} = req.user
	const isUserMember = await service.checkIfUserAlreadyMember(email, orgId)
	if (!isUserMember) {
		throw new ApiError(403, "You cannot view this organization")
	}
	const response = await service.getOrgUser(orgId, parseInt(limit as string), parseInt(page as string))
	res.status(200).json(
		new ApiResponse(200, response.orgs, "user organizations fetched successfully", {
			isNext: response.isNext,
			isPrev: response.isPrev,
			page,
			limit
		})
	)
})

export const modifyUserOrgRole: RequestHandler = asyncHandler(async (req: IRequest, res: Response) => {
	const {id: userId} = req.user
	const {orgId} = req.params
	const {toRole, updateUser} = req.body
	const isUserValid = await service.checkIfValidUser(userId as string, orgId, 'admin')
	if (!isUserValid) {
		throw new ApiError(403, "You cannot perform this operation")
	}
	await service.updateUserOrgRole(updateUser, orgId, toRole)
	res.status(200).json(
		new ApiResponse(200, null, "Org org role updated successfully")
	)
})

export const getOrgMonitors : RequestHandler = asyncHandler(async (req: IRequest, res: Response) => {
	const {id} = req.params
	const monitors = await service.getMonitors(id)
	if (monitors.length === 0) {
		throw new ApiError(404, "No monitors found.")
	}
	res.status(200).json(
		new ApiResponse(200, monitors, "Monitors found")
	)
})