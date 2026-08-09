import { DeviceUserTable } from "@features/device-user/device-user.table.js";
import { connection } from "@shared/lib/connection.lib.js";
import { describe, expect, it } from "vitest";
import { deviceCreate } from "./device.service.js";
import { DeviceTable } from "./device.table.js";

describe("deviceCreate Service", () => {
  it("should write to both tables atomically", async () => {
    const testTrx = await connection.transaction(null, {
      doNotRejectOnRollback: true,
    });

    try {
      const store = "00000000-0000-0000-0000-000000000000";
      await deviceCreate(
        {
          deviceNumber: "TEST-999",
          deviceType: "type-a",
          store,
        },
        testTrx,
      );

      const deviceInDb = await testTrx(DeviceTable.default.name)
        .select([DeviceTable.default.columns.deviceNumber.name])
        .where({ [DeviceTable.default.columns.deviceNumber.name]: "TEST-999" })
        .first();

      const deviceInStore = await testTrx(DeviceUserTable.default.name)
        .select([
          DeviceUserTable.default.columns.device.ref.as("device"),
          DeviceUserTable.default.columns.user.ref.as("user"),
        ])
        .where({ [DeviceUserTable.default.columns.device.name]: "TEST-999" })
        .first();

      expect(deviceInDb).toBeDefined();
      expect(deviceInStore.user).toBe(store);
    } finally {
      await testTrx.rollback();
    }
  });
});
