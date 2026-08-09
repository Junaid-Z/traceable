import z from "zod";
import { DEVICE_TYPE } from "./device.constants.js";

export const deviceNumberSchema = z.string().min(10).max(30);

export const deviceTypeSchema = z.enum(Object.values(DEVICE_TYPE));

export const deviceCreateSchema = z.object({
  deviceNumber: deviceNumberSchema,
  deviceType: deviceTypeSchema,
});
