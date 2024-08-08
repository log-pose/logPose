import {org, orgInvite, and, psqlClient, eq, userOrg, user} from "@logpose/drizzle"
import z from "zod"
import {orgRolesSchema} from "../../zod/org"
import {sendEmail} from "@logpose/utils"
import crypto from "node:crypto"

type TOrgRoles = z.infer<typeof orgRolesSchema>

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

export const getUserById = async (userId: string) => {
	const userRow = await psqlClient.select().from(user).limit(1)
	return userRow[0]
}

export const saveInviteToken = async (invitedRole: TOrgRoles, invitee: string, inviter: string, orgId: string) => {
	const randomToken = crypto.randomBytes(4).toString('hex') // keeping it small 
	await psqlClient.insert(orgInvite).values({
		token: randomToken,
		invitedRole: invitedRole,
		invitee: invitee,
		inviter: inviter,
		orgId: orgId
	})

	return randomToken
}
export const sendInviteMail = async (toEmail: string, orgName: string, username: string, token: string) => {
	const html = `<a href="http://localhost:8000/api/v1/org/join/${token}">Join now</a>`
	const {data, error} = await sendEmail(
		"Log Pose <no-reply@sebzz.tech>",
		[toEmail],
		`${username} has invited you to join ${orgName}`,
		html
	)
	return {data, error}
}

export const assignUserToOrg = async (orgId: string, userId: string, role: TOrgRoles) => {
	await psqlClient.insert(userOrg).values([{
		userId, orgId, role
	}])
}
