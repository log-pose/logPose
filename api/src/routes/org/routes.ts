import {Router} from "express";
import {
	createOrg,
	deleteOrg,
	editOrg,
	getOrgById,
	getUserOrg,
	getOrgMembers,
	inviteUserToOrg,
	acceptInvite,
	exitOrg,
	modifyUserOrgRole,
	removeUserFromOrg,
	getOrgMonitors
} from "./controller"

import authenticate from "../../middleware/authenticate";
const router: Router = Router();

router.post("/", authenticate, createOrg)
router.get("/", authenticate, getUserOrg)
router.get("/:orgId", authenticate, getOrgById)
router.put("/:orgId", authenticate, editOrg)
router.delete("/:orgId", authenticate, deleteOrg)
router.post("/invite/:orgId", authenticate, inviteUserToOrg)
router.post("/join/:joinToken", authenticate, acceptInvite)
router.delete("/user/:orgId", authenticate, removeUserFromOrg)
router.delete("/exit/:orgId", authenticate, exitOrg)
router.get("/members/:orgId", authenticate, getOrgMembers)
router.put("/role/:orgId", authenticate, modifyUserOrgRole)
router.get("/monitors/:orgId", authenticate, getOrgMonitors)

export default router;
