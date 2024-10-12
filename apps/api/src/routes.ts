import {Router} from "express";
import authRoutesV1 from "./v1/auth/routes";
import orgRoutesV1 from "./v1/org/routes";
import monitorRoutesV1 from "./v1/monitor/routes";

const router: Router = Router();

router.use("/auth", authRoutesV1);
router.use("/monitor", monitorRoutesV1);
router.use("/org", orgRoutesV1);

export default router;
