import { connection } from "../shared/lib/connection.lib.js";

async function migrateLatest() {
  try {
    console.log("Running migrations...");

    // Execute the latest migrations
    const [batchNo, log] = (await connection.migrate.latest({})) as [
      currentMigrationNumber: number,
      migrationRuns: string[],
    ];

    console.log(batchNo, log);
    await connection.destroy();
    process.exit(0);
  } catch (e) {
    console.log("Error while running migrations", e);
    await connection.destroy();
    process.exit(1);
  }
}

await migrateLatest();
