import orgRoutes from "./org/routes"
import authRoutes from "./auth/routes"
import {Router} from "express";

const router: Router = Router();

router.use("/auth", authRoutes);
router.use("/org", orgRoutes)

export default router;

