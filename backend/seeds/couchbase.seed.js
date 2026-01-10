import { connectCouchbase, BUCKET, SCOPE } from "../db/couchbaseDriver.js";

export async function seedCouchbase() {
  const { cluster, bucket } = await connectCouchbase();

  // collections
  await createCollection(cluster, BUCKET, SCOPE, "users");
  await createCollection(cluster, BUCKET, SCOPE, "appusers");
  
  // NOTE:
  // testusers has NO primary index on purpose
  // Used for testing query error handling
  await createCollection(cluster, BUCKET, SCOPE, "testusers");

  // indexes
  await createPrimaryIndex(cluster, BUCKET, SCOPE, "users");
  await createPrimaryIndex(cluster, BUCKET, SCOPE, "appusers");

  const usersCollection = bucket.scope(SCOPE).collection("users");
  const appUsersCollection = bucket.scope(SCOPE).collection("appusers");

  // deleting existing data
  await cluster.query(`
    DELETE FROM \`${BUCKET}\`.\`${SCOPE}\`.users
  `);

  await cluster.query(`
    DELETE FROM \`${BUCKET}\`.\`${SCOPE}\`.appusers
  `);

  // Seed users
  await usersCollection.upsert("user::test@test.dk", {
    email: "test@test.dk",
    roles: ["tester"],
    orders: [
      {
        orderId: "order-001",
        items: [{ name: "Apple", quantity: 2, price: 3 }],
        total: 6,
        status: "success",
        createdAt: "2025-01-01T10:00:00Z"
      },
      {
        orderId: "order-002",
        items: [{ name: "Banana", quantity: 5, price: 1 }],
        total: 5,
        status: "cancelled",
        createdAt: "2025-01-02T11:30:00Z"
      },
      {
        orderId: "order-003",
        items: [{ name: "Orange", quantity: 3, price: 2 }],
        total: 6,
        status: "fail",
        createdAt: "2025-01-03T14:45:00Z"
      }
    ],
    products: [
      {
        productId: "product-abc",
        status: "active",
        createdAt: "2025-01-02T09:00:00Z"
      }
    ],
    createdAt: new Date().toISOString()
  });

  await usersCollection.upsert("user::dev@test.dk", {
    email: "dev@test.dk",
    roles: ["developer", "scrum-master"],
    orders: [
      {
        orderId: "order-004",
        items: [{ name: "Pear", quantity: 4, price: 2 }],
        total: 8,
        status: "success",
        createdAt: "2025-01-04T09:15:00Z"
      },
      {
        orderId: "order-005",
        items: [{ name: "Apple", quantity: 1, price: 3 }],
        total: 3,
        status: "success",
        createdAt: "2025-01-05T16:20:00Z"
      }
    ],
    products: [
      {
        productId: "product-xyz",
        status: "inactive",
        createdAt: "2025-01-03T11:20:00Z"
      }
    ],
    createdAt: new Date().toISOString()
  });

  await usersCollection.upsert("user::no@test.dk", {
    email: "no@test.dk",
    createdAt: new Date().toISOString()
  });

  await usersCollection.upsert("user::norole@test.dk", {
    email: "norole@test.dk",
    roles: [],
    createdAt: new Date().toISOString()
  });

  // Seed appusers
  await appUsersCollection.upsert("appuser::dev@dev.dk", {
    email: "dev@dev.dk",
    role: ["developer"],
    order: [
      {
        orderId: "order-900",
        items: [{ name: "Kiwi", quantity: 2, price: 4 }],
        total: 8,
        status: "success",
        createdAt: "2025-01-04T15:30:00Z"
      }
    ],
    product: [
      {
        productId: "product-xyz",
        status: "inactive",
        createdAt: "2025-01-03T11:20:00Z"
      }
    ],
    createdAt: new Date().toISOString()
  });

  console.log("Couchbase fully initialized & seeded");
}

async function createCollection(cluster, bucket, scope, collection) {
  try {
    await cluster.query(`
      CREATE COLLECTION \`${bucket}\`.\`${scope}\`.\`${collection}\`
    `);
  } catch (error) {
    if (error?.cause?.first_error_code === 12027) {
      return;
    }
    throw error;
  }
}

async function createPrimaryIndex(cluster, bucket, scope, collection) {
  try {
    await cluster.query(`
      CREATE PRIMARY INDEX ON \`${bucket}\`.\`${scope}\`.\`${collection}\`
    `);
  } catch (error) {
    if (
      error?.cause?.first_error_code === 4300 ||
      error.message?.includes("already exists")
    ) {
      return;
    }
    throw error;
  }
}

