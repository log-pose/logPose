import z from "zod";

export const createOrgSchema = z.object({
	orgName: z.string(),
})
