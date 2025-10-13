export const ROLES = {
    STUDENT: "STUDENT",
    ADMIN: "ADMIN",
} as const;

export type RoleType = (typeof ROLES)[keyof typeof ROLES];
