import { Router } from "express";
import authRoutesV1 from "./v1/auth/routes";

const router: Router = Router();

router.use("/auth", authRoutesV1);

export default router;
