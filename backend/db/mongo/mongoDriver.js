import { MongoClient } from "mongodb";
import "dotenv/config";

let client;
let db;

export async function connectMongo() {
    if (db) return db;

    client = new MongoClient(process.env.MONGO_URI);
    await client.connect();

    db = client.db();
    console.log("Connected to MongoDB");

    return db;
}

// export async function findAllMongo(collection) {
//     return db.collection(collection).find({}).toArray();
// }

// export async function findAllMongoFiltered(collection, query) {
//     return db.collection(collection).find(query).toArray();
// }