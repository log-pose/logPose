import { eq } from "drizzle-orm"
import { monitors, org } from "../../config/schema"
import { db } from "../../loaders/psql"
import { TMonitorType, TPingInterval } from "../../types/monitor"

export const deleteMonitor = async (id: string) => {
    await db.delete(monitors)
        .where(eq(monitors.id, id))
}
export const getMonitorById = async (id: string) => {
    const [monitor] = await db.select().from(monitors)
        .where(eq(monitors.id, id))
    return monitor
}
export const updateMonitor = async (name: string, additionalInfo: any, pingInterval: TPingInterval, orgId: string, type: TMonitorType, id: string): Promise<{ id: string }> => {
    const [monitor] = await db
        .update(monitors)
        .set({
            ping: pingInterval,
            additionalInfo,
            name,
            orgId,
            monitorType: type
        })
        .where(eq(monitors.id, id))
        .returning({
            id: monitors.id
        })
    return monitor
}
export const createMonitor = async (name: string, additionalInfo: any, pingInterval: TPingInterval, orgId: string, type: TMonitorType): Promise<{ id: string }> => {
    const [monitor] = await db
        .insert(monitors)
        .values({
            ping: pingInterval,
            additionalInfo,
            name,
            orgId,
            monitorType: type
        }).returning({
            id: monitors.id
        })
    return monitor
}