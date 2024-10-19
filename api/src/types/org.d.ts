import {orgRoleEnum} from "../config/schema"
import z from "zod";

const roleEnumSchema = z.enum(orgRoleEnum.enumValues);
export type TOrgRoles = z.infer<typeof roleEnumSchema>