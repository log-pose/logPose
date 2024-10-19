import * as jwt from "jsonwebtoken";
import {NextFunction, Response} from "express";
import config from "../config/env";
import {IRequest} from "../types/request";

const authenticate = (
	req: IRequest,
	res: Response,
	next: NextFunction
) => {
	const token =
		req.headers &&
		req.headers.authorization &&
		req.headers.authorization.split(" ")[1];
	if (!token) return res.status(401).json({message: "No token provided"});
	try {
		req.user = jwt.verify(token, config.jwtSecret) as jwt.JwtPayload;
		next();
	} catch (err) {
		return res.status(401).json({message: "Unauthorized"});
	}
};

export default authenticate
