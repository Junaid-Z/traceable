import { connection } from "../shared/lib/connection.lib.js";

async function migrateMake() {
  const migrationName = process.argv[2];
  try {
    if (!migrationName) throw new Error("Migration name not provided");
    console.log(`Creating migration ${migrationName}`);

    // Execute the latest migrations
    const resultFileName = await connection.migrate.make(migrationName);

    console.log(`Migration successfully created: ${resultFileName}`);
  } catch (e) {
    console.log(`Failed to create migration ${migrationName}`, e);
  } finally {
    await connection.destroy();
    process.exit(1);
  }
}

await migrateMake();
