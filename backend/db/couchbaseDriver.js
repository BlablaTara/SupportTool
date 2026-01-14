import couchbase from "couchbase";

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

    bucket = cluster.bucket(BUCKET);
    console.log("Connected to Couchbase", BUCKET);

    return { cluster, bucket };
}

export { BUCKET, SCOPE };

