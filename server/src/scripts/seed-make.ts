import { connection } from "../shared/lib/connection.lib.js";

async function seedMake() {
  const seedName = process.argv[2];
  try {
    if (!seedName) throw new Error("Seed name not provided");
    console.log(`Creating seed ${seedName}`);

    // Execute the latest migrations
    const resultFileName = await connection.seed.make(seedName);

    console.log(`Seed successfully created: ${resultFileName}`);
    await connection.destroy();
    process.exit(0);
  } catch (e) {
    console.log(`Failed to create seed ${seedName}`, e);
    await connection.destroy();
    process.exit(1);
  }
}

await seedMake();
