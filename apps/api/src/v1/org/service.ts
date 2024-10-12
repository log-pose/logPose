import {and, eq, monitors, org, orgInvite, psqlClient, user, userOrg} from "@logpose/drizzle"
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

export const getUserOrgById = async (userId: string, limit: number, page: number) => {
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
			isPrev: page > 1
		}
	}
	return {
		orgs,
		isNext: false,
		isPrev: page > 1
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
	const userRow = await psqlClient.select().from(user).where(eq(user.id, userId))
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
	const html = `<a href="http://localhost:8000/org/join/${token}">Join now</a>`
	const {data, error} = await sendEmail(
		"Log Pose <no-reply@sebzz.tech>",
		[toEmail],
		`${username} has invited you to join ${orgName}`,
		html
	)
	return {data, error}
}

export const getTokenInfo = async (token: string) => {
	const tokenArr = await psqlClient.select().from(orgInvite).where(eq(orgInvite.token, token))
	const TIMEOUT = 60 * 60 * 24 // day in seconds 
	if (tokenArr.length > 0 && parseInt(Date.now() / 1000 as any) - tokenArr[0].timestamp <= TIMEOUT) {
		return tokenArr[0]
	}
	return null
}

export const checkIfUserAlreadyMember = async (userEmail: string, orgId: string) => {
	const res = await psqlClient.select({user}).from(user).leftJoin(
		userOrg, eq(
			userOrg.userId, user.id
		)
	).where(
		and(
			eq(
				user.email, userEmail
			),
			eq(
				userOrg.orgId, orgId
			)
		)
	)
	return res.length !== 0
}

export const joinOrg = async (inviteToken: string, userId: string, orgId: string, orgRole: TOrgRoles) => {
	await psqlClient.transaction(async (trx) => {
		await trx.insert(userOrg).values([{
			userId,
			orgId: orgId,
			role: orgRole,
		}])
		await trx.delete(orgInvite).where(eq(
			orgInvite.token, inviteToken
		))
	})
}

export const assignUserToOrg = async (orgId: string, userId: string, role: TOrgRoles) => {
	await psqlClient.insert(userOrg).values([{
		userId, orgId, role
	}])
}

export const removeUser = async (orgId: string, userId: string) => {
	await psqlClient.delete(userOrg).where(and(
		eq(userOrg.orgId, orgId),
		eq(userOrg.userId, userId)))
}

export const getOrgUser = async (orgId: string, limit: number, page: number) => {
	const orgs = await psqlClient.select().from(userOrg).where(
		eq(
			userOrg.orgId, orgId
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
		isPrev: page > 1
	}
}

export const updateUserOrgRole = async (userId: string, orgId: string, userOrgRole: TOrgRoles) => {
	await psqlClient.update(userOrg).set({
		role: userOrgRole
	}).where(and(
		eq(userOrg.orgId, orgId),
		eq(userOrg.userId, userId)
	))
}

export const getMonitors = async (orgId: string) => {
	return psqlClient.select({
		id: monitors.id,
		name: monitors.name,
		kind: monitors.kind
	}).from(monitors).where(
		eq(monitors.orgId, orgId)
	)
}