import { roles, user, user_roles, psqlClient, eq } from "@logpose/drizzle";
import { randomUUID } from "node:crypto";
import bcrypt from "bcrypt";
import { z } from "zod";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;
const saltRounds = 10;

const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  console.log(hash);
  return hash;
};

const verifyPassword = async (password: string, hash: string) => {
  const match = await bcrypt.compare(password, hash);
  return match;
};

const getRoleId = async (role: string) => {
  const result = await psqlClient
    .select({
      id: roles.id,
    })
    .from(roles)
    .where(eq(roles.role_name, role));
  return result[0].id;
};

const checkUserExists = async (email: string) => {
  const result = await psqlClient
    .select({
      id: user.id,
      email: user.email,
      username: user.username,
      role_name: roles.role_name,
      hash: user.password,
    })
    .from(user)
    .where(eq(user.email, email))
    .leftJoin(user_roles, eq(user.id, user_roles.user_id))
    .leftJoin(roles, eq(user_roles.role_id, roles.id));

  if (result.length === 0) {
    return null;
  }
  return result;
};

const createUser = async (
  email: string,
  username: string,
  password: string,
  roleId: number
) => {
  const id = randomUUID();
  z.string().uuid().parse(id); // throws if invalid uuid
  const hashedPassword = await hashPassword(password);
  await psqlClient.transaction(async (trx) => {
    await trx
      .insert(user)
      .values([{ id, email, username, password: hashedPassword }])
      .onConflictDoNothing();
    await trx
      .insert(user_roles)
      .values([{ user_id: id, role_id: roleId }])
      .onConflictDoNothing();
  });
  return id;
};

const getJWT = async (email: string, id: string) => {
  const objToSign = {
    email,
    id,
  };

  const token = jwt.sign(objToSign, JWT_SECRET, { expiresIn: "1d" });
  console.log(token);
  return token;
};

export { getRoleId, checkUserExists, createUser, getJWT, verifyPassword };
