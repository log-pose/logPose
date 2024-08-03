import {org, psqlClient, eq, userOrg} from "@logpose/drizzle"


export const createOrg = async (orgName: string, userId: string) => {
	return await psqlClient.transaction(async (trx) => {
		const orgIdRow = await trx.insert(org).values([{
			name: orgName,
			created_by: userId,
			plan: "free",
		}]).returning({id: org.id})
		await trx.insert(userOrg).values([{
			userId,
			orgId: orgIdRow[0].id,
			role: 'admin'
		}])
		return orgIdRow[0].id
	})
}

export const getOrgById = async (orgId: string, userId: string) => {
	const [orgObj] = await psqlClient.select({org}).from(org).leftJoin(userOrg, eq(userOrg.orgId, org.id)).where(eq(
		userOrg.userId, userId
	)).limit(1)
	return orgObj.org
}


export const assignUserToOrg = async (orgId: string, userId: string, role: 'admin' | 'read' | 'write') => {
	await psqlClient.insert(userOrg).values([{
		userId, orgId, role
	}])
}
