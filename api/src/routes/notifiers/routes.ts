import { Router } from "express";
import * as c from "./controller"

import authenticate from "../../middleware/authenticate";
const router: Router = Router();

router.get("/:id", authenticate, c.getById)
router.post("/", authenticate, c.create)
router.put("/:id", authenticate, c.update)
router.delete("/:id", authenticate, c.deleteNotifiers)

export default router;
