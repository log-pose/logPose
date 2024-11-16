import * as z from "zod"

const httpSchema = z.object({
    url: z.string().url(),
    method: z.enum(["GET", "PUT", "POST", "PATCH", "DELETE"]),
    headers: z.record(z.string()).optional(),
    body: z.record(z.any()).optional(),
});

const telegramSchema = z.object({
    botToken: z.string(),
    chatId: z.string(),
});

type Result = {
    success: boolean;
    err: string | null;
};
export const validateHttp = (obj: any): Result => validateWithSchema(httpSchema, obj);
export const validateTelegram = (obj: any): Result => validateWithSchema(telegramSchema, obj);


// helper
const formatZodError = (error: z.ZodFormattedError<any>): string => {
    return Object.entries(error).map(([key, value]) => {
        if (key !== "_errors" && typeof value === "object" && value !== null && "_errors" in value) {
            const errors = (value._errors as unknown) as string[];
            return `${key} ${errors.join(", ").toLowerCase()}`;
        }
    }).filter(Boolean).join(" and ");
};

const validateWithSchema = (schema: any, obj: any): Result => {
    const parsed = schema.safeParse(obj);
    if (parsed.success) {
        return {
            success: true,
            err: null
        };
    }
    const formattedStr = formatZodError(parsed.error.format());
    return {
        success: false,
        err: formattedStr
    };
};