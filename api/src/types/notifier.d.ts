
import { notificationTypeEnum } from "../config/schema"
import z from "zod";
const notificationEnum = z.enum(notificationTypeEnum.enumValues);

export type TNotifier = z.infer<typeof notificationEnum>