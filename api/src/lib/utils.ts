import {TOrgRoles} from "../types/org";
import { eq , and} from "drizzle-orm"
import { db } from "../loaders/psql"
import { userOrg } from "../config/schema"

export const checkIfValidUser = async (userId: string, orgId: string, orgRole: TOrgRoles) => {
	const rows = await db.select().from(userOrg).where(and(
		eq(
			userOrg.orgId, orgId
		),
		eq(
			userOrg.userId, userId
		),
		eq(
			userOrg.role, orgRole
		)
	)).limit(1)
	if (rows.length < 1) {
		return false
	}
	return true
}
