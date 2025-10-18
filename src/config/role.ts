export const ROLES = {
    USER: "USER",
    ADMIN: "ADMIN",
} as const;

export type RoleType = (typeof ROLES)[keyof typeof ROLES];
