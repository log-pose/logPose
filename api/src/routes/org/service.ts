import crypto from "node:crypto"
import {db} from "../../loaders/psql";
import {org, orgInvite, user, userOrg} from "../../config/schema";
import {and, eq} from "drizzle-orm";
import {TOrgRoles} from "../../types/org";
import {sendEmail} from "../../lib/mail";
import * as c from "../../lib/constants"

export const createOrg = async (orgName: string, userId: string) => {
	return await db.transaction(async (trx) => {
		const orgIdRow = await trx.insert(org).values([{
			name: orgName,
			created_by: userId,
			plan: c.DEFAULT_PLAN,
		}]).returning({id: org.id})
		await trx.insert(userOrg).values([{
			userId,
			orgId: orgIdRow[0].id,
			role: c.DEFAULT_ROLE
		}])
		return orgIdRow[0].id
	})
}

export const getOrgById = async (orgId: string, userId: string) => {
	const [orgObj] = await db.select({org}).from(org).leftJoin(userOrg, eq(userOrg.orgId, org.id)).where(
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
	const orgs = await db.select({org}).from(org).leftJoin(
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

export const updateOrg = async (orgId: string, name: string) => {
	const updatedIdRows: {id: string}[] = await db.update(org)
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
	return await db.transaction(async (trx) => {
		await trx.delete(userOrg).where(eq(userOrg.orgId, orgId))
		const deletedOrg = await trx.delete(org).where(eq(org.id, orgId)).returning()
		return deletedOrg[0].id
	})
}

export const getUserById = async (userId: string) => {
	const userRow = await db.select().from(user).where(eq(user.id, userId))
	return userRow[0]
}

export const saveInviteToken = async (invitedRole: TOrgRoles, invitee: string, inviter: string, orgId: string) => {
	const randomToken = crypto.randomBytes(4).toString('hex') // keeping it small 
	await db.insert(orgInvite).values({
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
	const tokenArr = await db.select().from(orgInvite).where(eq(orgInvite.token, token))
	const TIMEOUT = 60 * 60 * 24 // day in seconds 
	if (tokenArr.length > 0 && parseInt(Date.now() / 1000 as any) - tokenArr[0].timestamp <= TIMEOUT) {
		return tokenArr[0]
	}
	return null
}

export const checkIfUserAlreadyMember = async (userEmail: string, orgId: string) => {
	const res = await db.select({user}).from(user).leftJoin(
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
	await db.transaction(async (trx) => {
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
	await db.insert(userOrg).values([{
		userId, orgId, role
	}])
}

export const removeUser = async (orgId: string, userId: string) => {
	await db.delete(userOrg).where(and(
		eq(userOrg.orgId, orgId),
		eq(userOrg.userId, userId)))
}

export const getOrgUser = async (orgId: string, limit: number, page: number) => {
	const orgs = await db.select().from(userOrg).where(
		eq(
			userOrg.orgId, orgId
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

export const updateUserOrgRole = async (userId: string, orgId: string, userOrgRole: TOrgRoles) => {
	await db.update(userOrg).set({
		role: userOrgRole
	}).where(and(
		eq(userOrg.orgId, orgId),
		eq(userOrg.userId, userId)
	))
}

export const getMonitors = async (orgId: string) => {
	return null
//	return psqlClient.select({
//		id: monitors.id,
//		name: monitors.name,
//		kind: monitors.kind
//	}).from(monitors).where(
//		eq(monitors.orgId, orgId)
//	)
}