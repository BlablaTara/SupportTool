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

export async function findAllMongo(collection) {
    return db.collections(collection).find({}).toArray();
}

