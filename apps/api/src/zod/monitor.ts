import z from "zod";

export const heartbeatEnum = z.enum(["1","15","30","45","60","120","180","720","1440"])
export const monitorKindEnum = z.enum(['http'])

