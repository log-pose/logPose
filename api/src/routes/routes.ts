import orgRoutes from "./org/routes"
import authRoutes from "./auth/routes"
import monitorRoutes from "./monitors/routes"
import {Router} from "express";

const router: Router = Router();

router.use("/auth", authRoutes);
router.use("/org", orgRoutes);
router.use("/monitor", monitorRoutes)

export default router;
