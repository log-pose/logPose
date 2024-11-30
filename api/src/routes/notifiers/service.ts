import { TValidator } from "../../types/validator";
import * as v from "../../lib/validators"
import Encrypter from "../../lib/Encrypter"
import { db } from "../../loaders/psql";
import { monitorNotifications, monitors, notificationEntity } from "../../config/schema";
import { TNotifier } from "../../types/notifier";
import { eq } from "drizzle-orm";

const encryptRequired = (type: TNotifier, addInfo :any) => {
    switch (type){
        case 'telegram':
            addInfo.botToken = Encrypter.encrypt(addInfo.botToken);
    }
    return addInfo
}
const decryptRequired = (type:TNotifier, addInfo:any) => {
    switch(type){
        case 'telegram':
            addInfo.botToken = Encrypter.decrypt(addInfo.botToken)
    }
    return addInfo
}
export const create = async (name: string, type: TNotifier, addInfo: any) => {
    const encrypted = encryptRequired(type, addInfo)
    const [notifier] = await db.insert(notificationEntity).values({
        name: name,
        type,
        additionalInfo: encrypted
    }).returning({ id: notificationEntity.id })

    return notifier.id
}

export const update = async (name: string, type: TNotifier, addInfo: any, id: string) => {
    const encrypted = encryptRequired(type, addInfo)
    const [notifier] = await db.update(notificationEntity).set({
        name: name,
        type,
        additionalInfo: encrypted
    }).where(eq(notificationEntity.id, id)).returning({
        id: notificationEntity.id
    })
    return notifier.id
}

export const getById = async (id: string) => {
    const [notifier] = await db.select().from(notificationEntity).where(eq(notificationEntity.id, id))
    notifier.additionalInfo = decryptRequired(notifier.type, notifier.additionalInfo)
    return notifier
}

export const deleteNotifiers = async (id: string) => {
    await db.delete(notificationEntity).where(eq(notificationEntity.id, id))
}
export const validate = (type: TNotifier, obj: any): TValidator => {
    switch (type) {
        case "telegram": {
            return v.validateTelegram(obj)
        }
        default:
            return {
                success: false,
                err: "No such monitor type"
            }
    }
}

export const getEntityNotifier = async(entityKind: string, entityId : string) => {
    switch (entityKind){
        case "org":
            return db.select({
                monitorId : monitorNotifications.monitorId,
                notificationEntityId : monitorNotifications.notificationEntityId,
                isActive : monitorNotifications.isActive
            }).from(monitorNotifications).leftJoin(
                monitors, eq(monitors.orgId, entityId)
            ) 
        case "monitor":
            return db.select().from(monitorNotifications).where(eq(monitorNotifications.monitorId, entityId))
    }
}