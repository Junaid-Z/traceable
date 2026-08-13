import { describe, expect, it } from "vitest";
import { deviceSearch } from "./device.service.js";

describe("device Search", function () {
  it("should get device by deviceNumber", async function () {
    const devices = await deviceSearch({
      query: { deviceNumber: "1234567890" },
    });

    expect(devices.length).toBe(1);
    expect(devices[0]).toBeDefined();
  });

  it("should get device by partial deviceNumber", async function () {
    const devices = await deviceSearch({
      query: { deviceNumber: "1234" },
      meta: { exactDeviceNumberMatch: false },
    });

    for (const device of devices) {
      expect(device).toBeDefined();
    }
  });

  it("should get devices in user's store", async function () {
    const store = "00000000-0000-0000-0000-000000000000";
    const devices = await deviceSearch({
      query: { store },
    });

    for (const device of devices) {
      expect(device.store).toBeDefined();
    }
  });

  it("should get not get devices not in user's store", async function () {
    const store = "00000000-0000-0000-0000-000000000001";
    const devices = await deviceSearch({
      query: { store, deviceNumber: "1234567890" },
    });

    expect(devices.length).toBe(0);
  });

  it("should get devices pending transfers", async function () {
    const devices = await deviceSearch({
      query: { isTransferring: true },
    });

    for (const device of devices) {
      expect(device.isTransferring).toBe(true);
    }
  });
});
