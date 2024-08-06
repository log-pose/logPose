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

	const response = await service.getUserOrg(userId, parseInt(limit as string), parseInt(pageNumber as string))

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
		new ApiResponse(200, "updated org")
	)

})

export const deleteOrg: RequestHandler = asyncHandler(async (req: Request, res: Response) => {})


// userToinvite
// orgId
export const inviteUserToOrg: RequestHandler = asyncHandler(async (req: IRequest, res: Response) => {
	const {userToInvite, invitedOrg, invitedRole} = req.body
})
export const removeUserFromOrg: RequestHandler = asyncHandler(async (req: Request, res: Response) => {})

export const acceptInvite: RequestHandler = asyncHandler(async (req: Request, res: Response) => {})
export const exitOrg: RequestHandler = asyncHandler(async (req: Request, res: Response) => {})
export const getOrgMembers: RequestHandler = asyncHandler(async (req: Request, res: Response) => {})
export const modifyUserOrgRole: RequestHandler = asyncHandler(async (req: Request, res: Response) => {})
