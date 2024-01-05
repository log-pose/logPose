import { Router } from "express";
import {
  createMonitor,
  deleteMonitorById,
  getAllMonitorsForUser,
  getMonitorById,
  updateMonitorById,
} from "./controller";
import { verifyExpress } from "../../middleware/auth";
const router: Router = Router();

router.post("/", verifyExpress, createMonitor);
router.get("/", verifyExpress, getAllMonitorsForUser);
router.get("/:id", verifyExpress, getMonitorById);
router.put("/:id", verifyExpress, updateMonitorById);
router.delete("/:id", verifyExpress, deleteMonitorById);

export default router;
