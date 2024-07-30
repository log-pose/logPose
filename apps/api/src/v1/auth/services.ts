import {user, psqlClient, eq} from "@logpose/drizzle";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;
const saltRounds = 10;

const hashPassword = async (password: string) => {
	const salt = await bcrypt.genSalt(saltRounds);
	const hash = await bcrypt.hash(password, salt);
	return hash;
};

export const checkUserExists = async (email: string) => {
	const result = await psqlClient
		.select({
			id: user.id,
			email: user.email,
			username: user.username,
			hash: user.password,
		})
		.from(user)
		.where(eq(user.email, email))

	if (result.length === 0) {
		return null;
	}
	return result;
};

export const createUser = async (
	email: string,
	username: string,
	password: string,

) => {
	const hashedPassword = await hashPassword(password);
	return await psqlClient.insert(user).values([{
		email,
		username,
		password: hashedPassword
	}]).returning({
		id: user.id
	})
};

export const getJWT = async (email: string, id: string) => {
	const objToSign = {
		email,
		id,
	};

	return jwt.sign(objToSign, JWT_SECRET, {expiresIn: "1d"});
};
