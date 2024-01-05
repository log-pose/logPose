import { Router } from "express";
import { register, login, getUser } from "./controller";
import { verifyExpress } from "../../middleware/auth";

const authRouter: Router = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/user", verifyExpress, getUser);

export default authRouter;
