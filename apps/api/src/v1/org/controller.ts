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
		res.status(201).json(new ApiResponse(201, {orgId, orgName, orgPlan: "free"}, "successfullly created the organization"))
	}
	catch (e) {
		throw new ApiError(400, "Name already taken")
	}
})

export const getOrgById: RequestHandler = asyncHandler(async (req: IRequest, res: Response) => {
	// TODO: to check if the user has access to the org
	const {orgId} = req.params;
	if (!orgId) {
		throw new ApiError(400, "id is required")
	}
	const org = await service.getOrgById(orgId)
	console.log(org)
	res.status(200).json(new ApiResponse(200, org))
})

export const getUserOrg: RequestHandler = asyncHandler(async (req: Request, res: Response) => {})
export const editOrg: RequestHandler = asyncHandler(async (req: Request, res: Response) => {})
export const deleteOrg: RequestHandler = asyncHandler(async (req: Request, res: Response) => {})


// userToinvite
// orgId
export const inviteUserToOrg: RequestHandler = asyncHandler(async (req: IRequest, res: Response) => {
	const {userToInvite, invitedOrg} = req.body
})
export const removeUserFromOrg: RequestHandler = asyncHandler(async (req: Request, res: Response) => {})

export const acceptInvite: RequestHandler = asyncHandler(async (req: Request, res: Response) => {})
export const exitOrg: RequestHandler = asyncHandler(async (req: Request, res: Response) => {})
export const getOrgMembers: RequestHandler = asyncHandler(async (req: Request, res: Response) => {})
export const modifyUserOrgRole: RequestHandler = asyncHandler(async (req: Request, res: Response) => {})
