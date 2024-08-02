import {org, psqlClient, eq} from "@logpose/drizzle"


export const createOrg = async (orgName: string, userId: string) => {
	const rows = await psqlClient.insert(org).values([{
		name: orgName,
		created_by: userId,
		plan: "free",
	}]).returning({id: org.id})

	return rows[0].id
}

export const getOrgById = async (orgId: string) => {
	const orgs = await psqlClient.select().from(org).where(eq(org.id, orgId)).limit(1)
	return orgs[0]
}


const assignUserToOrg = async (orgId: string, userId: string, orgRole: 'admin' | 'read' | 'write') => {

}
