import {Router} from "express";
import {
	createOrg, deleteOrg, editOrg, getOrgById, getUserOrg, getOrgMembers, inviteUserToOrg, acceptInvite, exitOrg, modifyUserOrgRole, removeUserFromOrg
} from "./controller"

import {verifyExpress} from "../../middleware/auth";
const router: Router = Router();

router.post("/", verifyExpress, createOrg)
router.get("/:orgId", verifyExpress, getOrgById)
export default router;
