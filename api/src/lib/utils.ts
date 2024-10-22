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
export function generateNames(): string {
	const adjectives = [
		"Brave", "Calm", "Delightful", "Eager", "Faithful",
		"Gentle", "Happy", "Jolly", "Kind", "Lively",
		"Mighty", "Noble", "Proud", "Quiet", "Radiant"
	];
	const nouns = [
		"Mountain", "River", "Forest", "Ocean", "Eagle",
		"Phoenix", "Lion", "Star", "Sun", "Moon",
		"Wolf", "Bear", "Falcon", "Tiger", "Storm"
	];
	const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
	const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
	return `${randomAdjective} ${randomNoun}`;
}