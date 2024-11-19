import orgRoutes from "./org/routes"
import authRoutes from "./auth/routes"
import monitorRoutes from "./monitors/routes"
import notifierRoutes from "./notifiers/routes"
import { Router } from "express";

const router: Router = Router();

router.use("/auth", authRoutes);
router.use("/org", orgRoutes);
router.use("/monitor", monitorRoutes)
router.use("/notifier", notifierRoutes)

export default router;
