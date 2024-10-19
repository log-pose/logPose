import {Request, RequestHandler, Response} from "express";
import {checkUserExists, createUser, getJWT, verifyPassword} from "./services";
import asyncHandler from "../../lib/asyncHandler";
import ApiError from "../../lib/ApiError";
import ApiResponse from "../../lib/ApiResponse";

export const register: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const {email, username, password} = req.body
    if (!email) {
        throw new ApiError(400, "email is required")
    }
    if (!username) {
        throw new ApiError(400, "username is required")
    }
    if (!password) {
        throw new ApiError(400, "password is required")
    }
    const user = await checkUserExists(email)
    if (user) {
        throw new ApiError(400, "User already exists")
    }
    const id = await createUser(email, username, password)
    const token = await getJWT(email, id[0].id)
    if (!id || !token) {
        throw new ApiError(500, "Something went wrong")
    }
    res.status(201).json(
        new ApiResponse(201, "User created", {
            user: {
                email, username
            },
            token
        },)
    )

})

export const login: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const {email, password} = req.body;
    if (!email) {
        throw new ApiError(400, "email is required")
    }
    if (!password) {
        throw new ApiError(400, "password is required")
    }
    const user = await checkUserExists(email)
    if (!user) {
        throw new ApiError(400, "User doesn't exist")
    }
    const verified = await verifyPassword(password, user.hash as string)
    if (!verified) {
        throw new ApiError(401, "Unauthorized")
    }
    const token = await getJWT(email, user.id as string)
    // issue with delete operator
    interface TempUser {
        username: string | null,
        email: string | null,
        hash?: string | null
    }
    const tempUser: TempUser = user;
    delete tempUser.hash
    res.status(200).json(
        new ApiResponse(200, "login", {
            user: tempUser,
            token
        })
    )
})
