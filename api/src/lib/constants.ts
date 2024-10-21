
export const userPlans = ["free"] as const
export const orgRoles = ['admin', 'read', 'write'] as const
export const monitorTypes = ['http'] as const

export enum pingEnum {
    ONE_MIN = "60",
    TEN_MIN = "600",
    FIFTEEN_MIN = "900",
    THIRTY_MIN = "1800",
    ONE_HR = "3600",
    THREE_HR = "10800",
    SIX_HR = "21600",
    TWELVE_HR = "43200",
    ONE_DAY = "86400"
}

export const pingInterval = [
    pingEnum.ONE_MIN,
    pingEnum.TEN_MIN,
    pingEnum.FIFTEEN_MIN,
    pingEnum.THIRTY_MIN,
    pingEnum.ONE_HR,
    pingEnum.THREE_HR,
    pingEnum.SIX_HR,
    pingEnum.TWELVE_HR,
    pingEnum.ONE_DAY,
] as const

export const DEFAULT_PLAN = "free"
export const DEFAULT_ROLE = "admin"

export enum roleEnum {
    "admin" = 1,
    "read",
    "write"
}