import z from "zod";

export const deviceTransferIdSchema = z.uuid();

export const deviceTransferSearchResultSchema = z.object({
  id: z.string(),
  publicId: z.string(),
  deviceNumber: z.string(),
  fromUser: z.string().nullable(),
  toUser: z.string().nullable(),
  completedAt: z.date().nullable(),
});

export type DeviceTransferSearchResult = z.output<
  typeof deviceTransferSearchResultSchema
>;
