import dotenv from "dotenv"
import couchbase from "couchbase";

import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
    path: path.join(__dirname, "..", "..", "..", ".env")
});


let cluster = null;
let bucket = null;
//let collection;

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

// export async function findFilteredCouchbase(collection, filter) {
//   const { cluster } = await connectCouchbase();
//   const { email } = filter;

//   const query = `
//     SELECT * FROM \`${BUCKET}\`.\`${SCOPE}\`.\`${collection}\`
//     WHERE email = $email
//   `;

//   try {
//     const result = await cluster.query(query, { parameters: { email } });
//     return { status: "success", items: result.rows.map(r => r[collection]) };
//   } catch (err) {
//     const missingIndex = err?.cause?.first_error_code === 4000;
//     if (missingIndex) {
//       return {
//         status: "error",
//         message: "Required index is missing",
//         detail: `CREATE INDEX idx_email ON \`${BUCKET}\`.\`${SCOPE}\`.\`${collection}\`(email);`
//       };
//     }
//     return { status: "error", message: err.message, detail: err.code || "" };
//   }
// }

export { BUCKET, SCOPE };