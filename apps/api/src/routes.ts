import {Router} from "express";
import authRoutesV1 from "./v1/auth/routes";
import serverRoutesV1 from "./v1/server/routes";
import orgRoutesV1 from "./v1/org/routes";

const router: Router = Router();

router.use("/auth", authRoutesV1);
router.use("/server", serverRoutesV1);
router.use("/org", orgRoutesV1);

export default router;
