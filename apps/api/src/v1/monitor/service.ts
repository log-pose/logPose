import * as d from "@logpose/drizzle"
import {monitors} from "@logpose/drizzle"
import z from "zod";
import {heartbeatEnum} from "../../zod/monitor";

type THeartbeat = z.infer<typeof heartbeatEnum>
type TCreateMonitor = {
    name: string, orgId: string, heartbeatInterval: THeartbeat, retries: number, url: string
}
type TUpdateMonitor = TCreateMonitor & {
    id: string
}
export const createMonitor = async ({
                                        name,
                                        orgId,
                                        heartbeatInterval,
                                        retries,
                                        url
                                    }: TCreateMonitor): Promise<string> => {
    const [monitorId] = await d.psqlClient.insert(d.monitors).values({
        name,
        orgId,
        heartbeatInterval,
        retries,
        url
    }).returning({id: d.monitors.id})
    return monitorId.id
}
export const deleteMonitor = async (id: string) => {
    await d.psqlClient.delete(d.monitors).where(
        d.eq(d.monitors.id, id)
    )
}
export const updateMonitor = async ({
                                        id,
                                        name,
                                        orgId,
                                        heartbeatInterval,
                                        retries,
                                        url
                                    }: TUpdateMonitor) :Promise<string> => {

  const [updatedId] =  await d.psqlClient.update(monitors).set({
        name,
        orgId,
        heartbeatInterval,
        retries,
        url
    }).where(
        d.eq(d.monitors.id, id)
    ).returning({id: d.monitors.id})
    return updatedId.id
}
export const getMonitorById = async (id: string) => {
    return  d.psqlClient.select().from(d.monitors).where(
        d.eq(d.monitors.id, id)
    )
}

