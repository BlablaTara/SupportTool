import "dotenv/config"
import { connectMongo, findAllMongo } from "./drivers/mongo.js";
import { connectCouchbase, findAllCouchbase } from "./drivers/couchbase.js";

let driver = {};

if (process.env.DB_TYPE === "mongo") {
    await connectMongo();
    driver = {
        findAll: (c) => findAllMongo(c),

    };
} else if (process.env.DB_TYPE === "couchbase") {
    const { bucket } = await connectCouchbase();
    driver = {
        findAll: () => findAllCouchbase(bucket.name),

    };
}

export default driver;