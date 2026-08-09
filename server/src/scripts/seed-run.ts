import { connection } from "../shared/lib/connection.lib.js";

async function seedRun() {
  try {
    console.log("Running seeds...");
    const seedFileName = process.argv[2];

    // Execute the latest migrations
    const seeds = await connection.seed.run({ specific: seedFileName });

    console.log(seeds);
    await connection.destroy();
    process.exit(0);
  } catch (e) {
    console.log("Error while running seeds", e);
    await connection.destroy();
    process.exit(1);
  }
}

await seedRun();
