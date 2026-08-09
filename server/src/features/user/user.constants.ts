export const USER_ROLE = {
  SUPER_USER: "super-user",
  ADMIN: "admin",
  TECHNICIAN: "technician",
  SUPPORT: "support",
  RECOVERY_OFFICER: "recovery-officer",
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export const USERNAME = /^[a-zA-Z][a-zA-Z0-9_.-]{2,14}$/;

export const NIC = /^\d{13}$/;

export const CONTACT = /^\d{12}$/;
