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
        "create:monitor",
        "view:monitor",
        "delete:monitor",
        "update:monitor"
    ],
    write: [
        "view:org",
        "create:monitor",
        "view:monitor",
        "delete:monitor",
        "update:monitor"
    ],
    read: [
        "view:org",
        "view:monitor"
    ],
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