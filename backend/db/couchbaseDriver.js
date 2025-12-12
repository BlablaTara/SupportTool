import dotenv from "dotenv"
import couchbase from "couchbase";

import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
    path: path.join(__dirname, "..", "..", ".env")
});


let cluster = null;
let bucket = null;

const BUCKET = process.env.CB_BUCKET;
const SCOPE = process.env.CB_SCOPE;

export async function connectCouchbase() {
    if (cluster && bucket) {
        return { cluster, bucket };
    }

    cluster = await couchbase.connect(process.env.CB_CONNSTR, {
        username: process.env.CB_USERNAME,
        password: process.env.CB_PASSWORD,
    });

    console.log("Trying to connect to bucket:", BUCKET);
    bucket = cluster.bucket(BUCKET);
    console.log("Connected to Couchbase", BUCKET);

    return { cluster, bucket };
}

export { BUCKET, SCOPE };