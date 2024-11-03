import * as z from "zod"

const httpSchema = z.object({
    url: z.string().url(),
    method: z.enum(["GET", "PUT", "POST", "PATCH", "DELETE"]),
    headers: z.record(z.string()).optional(),
    body: z.record(z.any()).optional(),
});

export const validateHttp = (obj: any): { success: boolean, err: string | null } => {
    const parsed = httpSchema.safeParse(obj)
    if (parsed.success) {
        return {
            success: true,
            err: null
        }
    }
    const formatted = parsed.error.format()
    const formattedStr = formatZodError(parsed.error.format());return {
        success: false,
        err: formattedStr
    }
}

// helper
const formatZodError = (error: z.ZodFormattedError<any>): string => {
    return Object.entries(error).map(([key, value]) => {
        if (key !== "_errors" && typeof value === "object" && value !== null && "_errors" in value) {
            const errors = (value._errors as unknown) as string[];
            return `${key} ${errors.join(", ").toLowerCase()}`;
        }
    }).filter(Boolean).join(" and ");
};