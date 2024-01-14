import { Request, Response } from "express";
import logger from "@logpose/logger";
import {
  getRoleId,
  checkUserExists,
  createUser,
  getJWT,
  verifyPassword,
} from "./service";

import { ApiError, ApiResponse, asyncHandler } from "../../utils";

const register: Function = asyncHandler(async (req: Request, res: Response) => {
  let { role, email, username, password } = req.body;
  if (!role) {
    logger.error("Missing role");
    throw new ApiError(400, "Missing role");
  }
  if (!email) {
    throw new ApiError(400, "Missing email");
  }
  if (!username) {
    throw new ApiError(400, "Missing username");
  }
  if (!password) {
    throw new ApiError(400, "Missing password");
  }

  role = role.toLowerCase();
  const roleId = await getRoleId(role);
  if (roleId === -1) {
    throw new ApiError(400, "Invalid role");
  }

  const user = await checkUserExists(email);
  if (user) {
    throw new ApiError(400, `User with ${email} already exists, Please login`);
  }

  const id = await createUser(email, username, password, roleId);
  const token = await getJWT(email, id);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: {
          email: email,
          username: username,
          role: role,
        },
        token: token,
      },
      "User created successfully"
    )
  );
});

const login: Function = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email) {
    throw new ApiError(400, "Missing email");
  }
  if (!password) {
    throw new ApiError(400, "Missing password");
  }

  const user = await checkUserExists(email);
  if (!user) {
    throw new ApiError(400, "User does not exist");
  }
  const { username, role_name, id, hash } = user[0];
  const passwordIsValid = await verifyPassword(password, hash as string);
  if (!passwordIsValid) {
    throw new ApiError(400, "Invalid password");
  }
  const token = await getJWT(email, id);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: {
          email: email,
          username: username,
          role: role_name,
        },
        token: token,
      },
      "User logged in successfully"
    )
  );
});

const getUser: Function = asyncHandler(async (req: Request, res: Response) => {
  const email = req.query.email as string;
  if (!email) {
    throw new ApiError(400, "Missing email");
  }

  const user = await checkUserExists(email);
  if (!user) {
    throw new ApiError(400, "User does not exist");
  }
  const { username, role_name } = user[0];

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: {
          email: email,
          username: username,
          role: role_name,
        },
      },
      "User found"
    )
  );
});

export { register, login, getUser };
