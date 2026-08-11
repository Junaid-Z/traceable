import { describe, expect, it } from "vitest";
import { deviceTransferCreate } from "./device-transfer.service.js";
import { connection } from "@shared/lib/connection.lib.js";
import { DeviceTransferTable } from "./device-transfer.table.js";

describe("deviceTransfer Create", function () {
  it("Should create a transfer", async function () {
    const trx = await connection.transaction({ doNotRejectOnRollback: true });
    try {
      const id = await deviceTransferCreate(
        {
          deviceNumber: "1234567890",
          fromUser: "00000000-0000-0000-0000-000000000000",
          toUser: "00000000-0000-0000-0000-000000000001",
        },
        trx,
      );
      expect(id).toBeDefined();
      const transfer = await trx(DeviceTransferTable.default.name)
        .where({
          [DeviceTransferTable.default.columns.publicId.name]: id,
        })
        .first();

      expect(transfer).toBeDefined();
    } finally {
      trx.rollback();
    }
  });
});
