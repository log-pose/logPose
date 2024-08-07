import {org, and, psqlClient, eq, userOrg} from "@logpose/drizzle"

type TOrgRoles = 'read' | 'write' | 'admin'

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
	const [orgObj] = await psqlClient.select({org}).from(org).leftJoin(userOrg, eq(userOrg.orgId, org.id)).where(
		and(
			eq(
				userOrg.userId, userId
			),
			eq(
				org.id, orgId
			)
		)
	).limit(1)
	return orgObj.org
}

export const getUserOrg = async (userId: string, limit: number, page: number) => {
	const orgs = await psqlClient.select({org}).from(org).leftJoin(
		userOrg, eq(
			userOrg.orgId, org.id
		)
	).where(
		eq(
			userOrg.userId, userId
		)
	).limit(limit + 1).offset((page - 1) * page)

	if (orgs.length === limit + 1) {
		return {
			orgs: orgs.slice(0, -1),
			isNext: true,
			isPrev: page <= 1 ? false : true
		}
	}
	return {
		orgs,
		isNext: false,
		isPrev: page <= 1 ? false : true
	}
}
export const checkIfValidUser = async (userId: string, orgId: string, orgRole: TOrgRoles) => {
	const rows = await psqlClient.select().from(userOrg).where(and(
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

export const updateOrg = async (orgId: string, name: string) => {
	const updatedIdRows: {id: string}[] = await psqlClient
		.update(org)
		.set({name: name})
		.where(eq(org.id, orgId))
		.returning(
			{
				id: org.id
			}
		)
	return updatedIdRows[0].id
}

export const deleteOrg = async (orgId: string) => {
	return await psqlClient.transaction(async (trx) => {
		await trx.delete(userOrg).where(eq(userOrg.orgId, orgId))
		const deletedOrg = await trx.delete(org).where(eq(org.id, orgId)).returning()
		return deletedOrg[0].id
	})
}

export const assignUserToOrg = async (orgId: string, userId: string, role: TOrgRoles) => {
	await psqlClient.insert(userOrg).values([{
		userId, orgId, role
	}])
}