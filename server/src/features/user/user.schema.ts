import z from "zod";
import { USER_ROLE, USERNAME, CONTACT, NIC } from "./user.constants.js";

export const userIdSchema = z.uuid();

export const userNameSchema = z
  .string()
  .toLowerCase()
  .trim()
  .min(2, "Username must be at least 2 characters")
  .max(14, "Username cannot exceed 14 characters")
  .regex(USERNAME, "Invalid username");

export const passwordSchema = z.string().trim().min(8);

export const displayNameSchema = z.string().trim();

export const userNicSchema = z
  .string()
  .trim()
  .length(13, "NIC must be at exactly 13 numbers")
  .regex(NIC, "Only numbers allowed");

export const userContactSchema = z
  .string()
  .trim()
  .length(12, "Conact must be at exactly 12 numbers")
  .regex(CONTACT, "Only numbers allowed");

export const userRoleSchema = z.enum(USER_ROLE, "Invalid role");

export const userCreateSchema = z.object({
  id: userIdSchema.optional(),
  displayName: displayNameSchema,
  username: userNameSchema,
  password: passwordSchema,
  nic: userNicSchema,
  role: userRoleSchema,
  salary: z.number().nonnegative(),
  contact: userContactSchema,
  address: z.string().trim(),
  active: z.boolean().optional().default(true),
});
