import { deviceNumberSchema } from "@features/device/device.schema.js";
import { userIdSchema } from "@features/user/user.schema.js";
import z from "zod";

export const deviceUserSchema = z.object({
  device: deviceNumberSchema,
  user: userIdSchema,
});

export type DeviceUser = z.output<typeof deviceUserSchema>;
