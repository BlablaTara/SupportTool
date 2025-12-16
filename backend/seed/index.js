import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "..", "..", ".env")
});

if (process.env.DB_TYPE === "MongoDB") {
  const { seedMongo } = await import("./mongo.seed.js");
  await seedMongo();
}

if (process.env.DB_TYPE === "Couchbase") {
  const { seedCouchbase } = await import("./couchbase.seed.js");
  await seedCouchbase();
}

process.exit(0);
