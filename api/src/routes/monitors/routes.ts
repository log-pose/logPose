import { Router } from "express";
import * as c from "./controller"

import authenticate from "../../middleware/authenticate";
const router: Router = Router();

router.get("/:id", authenticate, c.getMonitorById)
router.post("/", authenticate, c.createMonitors)
router.put("/:id",authenticate, c.updateMonitor)
router.delete("/:id",authenticate, c.deleteMonitor)

export default router;
