import {RequestHandler, Request, Response} from "express";
import {ApiError, ApiResponse, asyncHandler} from "../../utils";
import z from "zod";
import {checkUserExists, createUser, getJWT} from "./services";

const registerSchema = z.object({
	username: z.string(),
	email: z.string().email(),
	password: z.string()
})

export const register: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
	const validInput = registerSchema.safeParse(req.body)

	if (!validInput.success) {
		throw new ApiError(400, "Please check if required fields are present")
	}

	const user = await checkUserExists(req.body.email)

	if (user) {
		throw new ApiError(400, "User already exists")
	}
	const {email, username, password} = req.body
	const id = await createUser(email, username, password)
	const token = getJWT(email, id[0].id)

	if (!id || !token) {
		throw new ApiError(500, "Something went wrong")
	}
	res.status(201).json(
		new ApiResponse(201, {
			user: {
				email, username
			},
			token
		}, "User created")
	)

})
export const login: RequestHandler = asyncHandler(async (req: Request, res: Response) => {})
