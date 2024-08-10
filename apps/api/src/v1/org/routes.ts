import {Router} from "express";
import {
	createOrg, deleteOrg, editOrg, getOrgById, getUserOrg, getOrgMembers, inviteUserToOrg, acceptInvite, exitOrg, modifyUserOrgRole, removeUserFromOrg
} from "./controller"

import {verifyExpress} from "../../middleware/auth";
const router: Router = Router();

router.post("/", verifyExpress, createOrg)
router.get("/", verifyExpress, getUserOrg)
router.get("/:orgId", verifyExpress, getOrgById)
router.put("/:orgId", verifyExpress, editOrg)
router.delete("/:orgId", verifyExpress, deleteOrg)
router.post("/invite/:orgId", verifyExpress, inviteUserToOrg)
router.post("/join/:joinToken", verifyExpress, acceptInvite)
router.delete("/user/:orgId", verifyExpress, removeUserFromOrg)
router.delete("/exit/:orgId", verifyExpress, exitOrg)
router.get("/members/:orgId", verifyExpress, getOrgMembers)
router.put("/role/:orgId", verifyExpress, modifyUserOrgRole)

export default router;
