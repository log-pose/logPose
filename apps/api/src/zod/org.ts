import z from "zod";

export const orgRolesSchema = z.enum(['admin', 'read', 'write'])
export const createOrgSchema = z.object({
	orgName: z.string(),
})

export const inviteUserToOrgSchema = z.object({
	userToInvite: z.string().email(),
	invitedUserRole: orgRolesSchema
})
