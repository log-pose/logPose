import { Router } from "express";
import * as c from "./controller";
import { verifyExpress } from "../../middleware/auth";
const router: Router = Router();

router.post("/", verifyExpress, c.createMonitor)
router.get("/:id", verifyExpress, c.getMonitorById)
router.put("/", verifyExpress, c.updateMonitor)
router.delete("/:id", verifyExpress, c.deleteMonitor)

export default router;
