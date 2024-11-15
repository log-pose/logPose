import { and, eq } from "drizzle-orm"
import { userOrg } from "../config/schema"
import { db } from "../loaders/psql"

type Role = keyof typeof ROLES
type Permission = (typeof ROLES)[Role][number]

const ROLES = {
    admin: [
        "view:org",
        "create:org",
        "update:org",
        "delete:org",
        "user:org",
    ],
    write: ["view:org"],
    read: ["view:org"],
} as const

export async function authOrg(userId: string, permission: Permission, orgId: string) {
    const [roleObj] = await db.select({
        role: userOrg.role
    }).from(userOrg)
        .where(
            and(
                eq(userOrg.orgId, orgId),
                eq(userOrg.userId, userId)
            )
        )
    if (!roleObj || !roleObj.role) {
        return false
    }
    return (ROLES[roleObj.role] as readonly Permission[]).includes(permission)
}