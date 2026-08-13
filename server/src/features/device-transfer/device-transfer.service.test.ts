import { DeviceTable } from "@features/device/device.table.js";
import { connection } from "@shared/lib/connection.lib.js";
import { describe, expect, it } from "vitest";
import {
  DeviceTransferCreateDeviceNotFoundError,
  DeviceTransferCreateDeviceSenderSameAsReceiverError,
} from "./device-transfer.lib.js";
import {
  deviceTransferCreate,
  deviceTransferSearch,
} from "./device-transfer.service.js";
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
      await trx.rollback();
    }
  });

  it("Should throw DeviceTransferCreateDeviceSenderSameAsReceiverError", async function () {
    const trx = await connection.transaction({ doNotRejectOnRollback: true });
    try {
      const transferCreatePromise = deviceTransferCreate(
        {
          deviceNumber: "1234567890",
          fromUser: "00000000-0000-0000-0000-000000000000",
          toUser: "00000000-0000-0000-0000-000000000000",
        },
        trx,
      );

      await expect(transferCreatePromise).rejects.toBeInstanceOf(
        DeviceTransferCreateDeviceSenderSameAsReceiverError,
      );
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

  it("Should throw device not found error", async function () {
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

describe("deviceTransfer Search", function () {
  it("Should get transfer by id", async function () {
    const transfers = await deviceTransferSearch({
      query: { id: "00000000-0000-0000-0000-000000000000" },
    });

    expect(transfers.length).toBe(1);
    expect(transfers[0]).toBeDefined();
    expect(transfers[0]?.publicId).toBe("00000000");
  });

  it("Should get transfer by public id", async function () {
    const transfers = await deviceTransferSearch({
      query: { publicId: "00000000" },
    });

    expect(transfers.length).toBe(1);
    expect(transfers[0]).toBeDefined();
    expect(transfers[0]?.publicId).toBe("00000000");
  });

  it("Should get transfer by partial deviceNumber", async function () {
    const transfers = await deviceTransferSearch({
      query: { deviceNumber: "00000000000" },
      meta: { exactDeviceNumberMatch: false, limit: 1 },
    });

    for (let i = 0; i < transfers.length; i++) {
      expect(transfers[i]).toBeDefined();
      expect(transfers[i]?.deviceNumber.startsWith("00000000")).toBe(true);
    }
  });

  it("Should get completed transfers only", async function () {
    const transfers = await deviceTransferSearch({
      meta: { isComplete: true, limit: 10 },
    });

    for (let i = 0; i < transfers.length; i++) {
      expect.soft(transfers[i]).toBeDefined();
      expect.soft(transfers[i]?.completedAt !== null).toBe(true);
    }
  });

  it("Should get transfers where provided user is either sender or receiver", async function () {
    const user = "00000000-0000-0000-0000-000000000001";
    const transfers = await deviceTransferSearch({
      query: { user },
      meta: { limit: 10 },
    });

    for (let i = 0; i < transfers.length; i++) {
      expect.soft(transfers[i]).toBeDefined();
      expect
        .soft(transfers[i]?.toUser === user || transfers[i]?.fromUser === user)
        .toBeTruthy();
    }
  });

  it("Should get transfers where provided user is strictly the receiver", async function () {
    const user = "00000000-0000-0000-0000-000000000001";
    const transfers = await deviceTransferSearch({
      query: { user: { toUser: user } },
      meta: { limit: 10 },
    });

    for (let i = 0; i < transfers.length; i++) {
      expect.soft(transfers[i]).toBeDefined();
      expect.soft(transfers[i]?.toUser === user).toBeTruthy();
    }
  });

  it("Should get transfers where provided user is strictly the sender", async function () {
    const user = "00000000-0000-0000-0000-000000000001";
    const transfers = await deviceTransferSearch({
      query: { user: { fromUser: user } },
      meta: { limit: 10 },
    });

    for (let i = 0; i < transfers.length; i++) {
      expect.soft(transfers[i]).toBeDefined();
      expect.soft(transfers[i]?.fromUser === user).toBeTruthy();
    }
  });
});
