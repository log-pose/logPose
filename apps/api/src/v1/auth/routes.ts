import { Router } from "express";
import { register, login, getUser } from "./controller";
// import { verifyToken } from "middleware";

const authRouter: Router = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/user", getUser);

export default authRouter;
