import z from "zod";

export const DEVICE_TRANSFER_STAGE = Object.freeze({
  PENDING: "pending",
  REJECTED: "rejected",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
});

export const deviceTransferIdSchema = z.uuid();

export const deviceTransferStageSchema = z.enum(DEVICE_TRANSFER_STAGE);

export type DeviceTransferStage = z.output<typeof deviceTransferStageSchema>;

export const deviceTransferSearchResultSchema = z.object({
  id: z.string(),
  publicId: z.string(),
  deviceNumber: z.string(),
  fromUser: z.string().nullable(),
  toUser: z.string().nullable(),
  stage: deviceTransferStageSchema,
});

export type DeviceTransferSearchResult = z.output<
  typeof deviceTransferSearchResultSchema
>;
