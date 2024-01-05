import { Router } from "express";
import authRoutesV1 from "./v1/auth/routes";
import serverRoutesV1 from "./v1/server/routes";

const router: Router = Router();

router.use("/auth", authRoutesV1);
router.use("/server", serverRoutesV1);

export default router;
