import { pingIntervalEnum, monitorTypesEnum } from "../config/schema"
import z from "zod";

const pingEnumSchema = z.enum(pingIntervalEnum.enumValues);
const monitorEnumSchema = z.enum(monitorTypesEnum.enumValues);

export type TMonitorType = z.infer<typeof monitorEnumSchema>
export type TPingInterval = z.infer<typeof pingEnumSchema>