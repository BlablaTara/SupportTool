import couchebase from "couchbase";
import "dotenv/config";

let cluster;
let bucket;
let collection;

export async function connectCouchbase() {
    if (cluster) return { cluster, bucket, collection };

    cluster = await couchebase.connect(process.env.CB_CONNSTR, {
        username: process.env.CB_USERNAME,
        password: process.env.CB_PASSWORD,
    });

    bucket = cluster.bucket(process.env.CB_BUCKET);
    collection = bucket.defaultCollection();

    console.log("Connected to Couchbase");

    return { cluster, bucket, collection };
}

export async function findAllCouchbase(bucketName) {
  const query = `SELECT * FROM \`${bucketName}\``;
  const result = await cluster.query(query);
  return result.rows.map(r => r[bucketName]);
}