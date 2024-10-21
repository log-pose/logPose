import { TOrgRoles } from "../types/org";
import { eq, and } from "drizzle-orm"
import { db } from "../loaders/psql"
import { userOrg } from "../config/schema"
import * as c from "./constants"

export const checkIfValidUser = async (userId: string, orgId: string, roleToCheck: TOrgRoles): Promise<boolean> => {
	const userRows = await db.select().from(userOrg).where(and(
		eq(
			userOrg.orgId, orgId
		),
		eq(
			userOrg.userId, userId
		)
	)).limit(1)
	if (userRows.length < 1) {
		return false
	}
	return c.roleEnum[userRows[0].role!] <= c.roleEnum[roleToCheck] ? true : false
}
