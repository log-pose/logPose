import { Request, Response } from "express";
import logger from "@logpose/logger";
import {
  getRoleId,
  checkUserExists,
  createUser,
  getJWT,
  verifyPassword,
} from "./service";

const register = async (req: Request, res: Response) => {
  let { role, email, username, password } = req.body;
  if (!role) {
    logger.error("Missing role");
    return res.status(400).json({ message: "Missing role" });
  }
  if (!email) {
    logger.error("Missing email");
    return res.status(400).json({ message: "Missing email" });
  }
  if (!username) {
    logger.error("Missing username");
    return res.status(400).json({ message: "Missing username" });
  }
  if (!password) {
    logger.error("Missing password");
    return res.status(400).json({ message: "Missing password" });
  }

  role = role.toLowerCase();
  const roleId = await getRoleId(role);
  if (roleId === -1) {
    logger.error("Invalid role");
    return res.status(400).json({ message: "Invalid role" });
  }

  const user = await checkUserExists(email);
  if (user) {
    logger.error("User already exists");
    return res
      .status(400)
      .json({ message: `User with ${email} already exists, Please login` });
  }

  try {
    const id = await createUser(email, username, password, roleId);
    const token = await getJWT(email, id);

    return res.status(200).json({
      message: "User created successfully",
      data: {
        user: {
          email: email,
          username: username,
          role: role,
        },
        token: token,
      },
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ message: "User not created" });
  }
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email) {
    logger.error("Missing email");
    return res.status(400).json({ message: "Missing email" });
  }
  if (!password) {
    logger.error("Missing password");
    return res.status(400).json({ message: "Missing password" });
  }
  try {
    const user = await checkUserExists(email);
    if (!user) {
      logger.error("User does not exist");
      return res.status(400).json({ message: "User does not exist" });
    }
    const { username, role_name, id, hash } = user[0];
    const passwordIsValid = await verifyPassword(password, hash as string);
    if (!passwordIsValid) {
      logger.error("Invalid password");
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = await getJWT(email, id);
    return res.status(200).json({
      message: "User logged in successfully",
      data: {
        user: {
          email: email,
          username: username,
          role: role_name,
        },
        token: token,
      },
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ message: err });
  }
};

const getUser = async (req: Request, res: Response) => {
  const email = req.query.email as string;
  if (!email) {
    logger.error("Missing email");
    return res.status(400).json({ message: "Missing email" });
  }
  try {
    const user = await checkUserExists(email);
    if (!user) {
      logger.error("User does not exist");
      return res.status(400).json({ message: "User does not exist" });
    }
    const { username, role_name } = user[0];
    return res.status(200).json({
      message: "User found",
      data: {
        username: username,
        email: email,
        role: role_name,
      },
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ message: err });
  }
};

export { register, login, getUser };
