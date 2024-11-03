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
    const formattedStr = Object.entries(formatted).map(([k, v]) => {
        if (k !== "_errors") {
            if ("_errors" in v) {
                return `${k} ${v._errors.join(", ").toLowerCase()}`
            }
        }
    }).filter(el => el != null).join(" and ")
    return {
        success: false,
        err: formattedStr
    }
}
