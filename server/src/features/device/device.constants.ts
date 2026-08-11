export const DEVICE_TYPE = {
  TypeA: "type-a",
  TypeB: "type-b",
} as const;

export type DeviceType = (typeof DEVICE_TYPE)[keyof typeof DEVICE_TYPE];
