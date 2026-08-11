import { describe, expect, it } from "vitest";
import { deviceTransferCreate } from "./device-transfer.service.js";
import { connection } from "@shared/lib/connection.lib.js";
import { DeviceTransferTable } from "./device-transfer.table.js";
import { DeviceTable } from "@features/device/device.table.js";
import {
  DeviceTransferCreateDeviceAlreadyPendingTransferError,
  DeviceTransferCreateDeviceNotFoundError,
} from "./device-transfer.lib.js";

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
      await trx.rollback();
    }
  });

  it("Should mark device having pending transfer", async function () {
    const trx = await connection.transaction({ doNotRejectOnRollback: true });
    try {
      await deviceTransferCreate(
        {
          deviceNumber: "1234567890",
          fromUser: "00000000-0000-0000-0000-000000000000",
          toUser: "00000000-0000-0000-0000-000000000001",
        },
        trx,
      );

      const device = await trx(DeviceTable.default.name).where({
        [DeviceTable.default.columns.deviceNumber.name]: "1234567890",
        [DeviceTable.default.columns.isTransferring.name]: true,
      });

      expect(device).toBeDefined();
    } finally {
      await trx.rollback();
    }
  });

  it("Should throw device already pending transfer error", async function () {
    const trx = await connection.transaction({ doNotRejectOnRollback: true });
    try {
      const deviceTransferCreatePromise = deviceTransferCreate(
        {
          deviceNumber: "000000000000",
          fromUser: "00000000-0000-0000-0000-000000000000",
          toUser: "00000000-0000-0000-0000-000000000001",
        },
        trx,
      );

      await expect(deviceTransferCreatePromise).rejects.instanceOf(
        DeviceTransferCreateDeviceAlreadyPendingTransferError,
      );
    } finally {
      await trx.rollback();
    }
  });

  it.only("Should throw device not found error", async function () {
    const trx = await connection.transaction({ doNotRejectOnRollback: true });
    try {
      const deviceTransferCreatePromise = deviceTransferCreate(
        {
          deviceNumber: "000000000010",
          fromUser: "00000000-0000-0000-0000-000000000000",
          toUser: "00000000-0000-0000-0000-000000000001",
        },
        trx,
      );

      await expect(deviceTransferCreatePromise).rejects.instanceOf(
        DeviceTransferCreateDeviceNotFoundError,
      );
    } finally {
      await trx.rollback();
    }
  });
});
