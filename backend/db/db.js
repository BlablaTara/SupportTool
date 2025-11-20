import "dotenv/config"
import { connectMongo, findAllMongo, findAllMongoFiltered } from "./drivers/mongo.js";
import { connectCouchbase, findAllCouchbase } from "./drivers/couchbase.js";

let driver = {};

if (process.env.DB_TYPE === "MongoDB") {
    await connectMongo();
    driver = {
        findAll: (c) => findAllMongo(c),
        findFiltered: (c, q) => findAllMongoFiltered(c, q)
    };
} else if (process.env.DB_TYPE === "Couchbase") {
    await connectCouchbase();
    driver = {
        findAll: (c) => findAllCouchbase(c),
        findFiltered: (c, q) => findAllCouchbase(c) //TODO: Couchbase query kan laves senere
    };
}

export default driver;