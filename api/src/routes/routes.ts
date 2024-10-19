import authRoutes from "./auth/routes"
import {Router} from "express";

const router: Router = Router();

router.use("/auth", authRoutes);

export default router;

