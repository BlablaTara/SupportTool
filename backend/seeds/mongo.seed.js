import { connectMongo } from "../db/mongoDriver.js";

export async function seedMongo() {
    const db = await connectMongo();

    const users = db.collection("users");
    const appUsers = db.collection("appusers");
    const testUsers = db.collection("testusers");

    await users.deleteMany({});
    await appUsers.deleteMany({});
    await testUsers.deleteMany({});

    await users.insertMany([
        {
      email: "test@test.dk",
      roles: ["tester"],
      orders: [
        {
          orderId: "order-001",
          items: [
            { name: "Apple", quantity: 2, price: 3 }
          ],
          total: 6,
          status: "success",
          createdAt: new Date("2025-01-01T10:00:00Z")
        },
        {
          orderId: "order-002",
          items: [
            { name: "Banana", quantity: 5, price: 1 }
          ],
          total: 5,
          status: "cancelled",
          createdAt: new Date("2025-01-02T11:30:00Z")
        },
        {
          orderId: "order-003",
          items: [
            { name: "Orange", quantity: 3, price: 2 }
          ],
          total: 6,
          status: "fail",
          createdAt: new Date("2025-01-03T14:45:00Z")
        }
      ],
      products: [
        {
          productId: "product-abc",
          status: "active",
          createdAt: new Date("2025-01-02T09:00:00Z")
        }
      ],
      createdAt: new Date()
    },
    {
      email: "dev@test.dk",
      roles: ["developer", "scrum-master"],
      orders: [
        {
          orderId: "order-004",
          items: [
            { name: "Pear", quantity: 4, price: 2 }
          ],
          total: 8,
          status: "success",
          createdAt: new Date("2025-01-04T09:15:00Z")
        },
        {
          orderId: "order-005",
          items: [
            { name: "Apple", quantity: 1, price: 3 }
          ],
          total: 3,
          status: "success",
          createdAt: new Date("2025-01-05T16:20:00Z")
        }
      ],
      products: [
        {
          productId: "product-xyz",
          status: "inactive",
          createdAt: new Date("2025-01-03T11:20:00Z")
        }
      ],
      createdAt: new Date()
    },
    {
    email: "no@test.dk",
    createdAt: newDatee()
    }
  ]);

  await appUsers.insertOne({
    email: "dev@dev.dk",
    role: ["developer"],
    order: [
      {
        orderId: "order-900",
        items: [
          { name: "Kiwi", quantity: 2, price: 4 }
        ],
        total: 8,
        status: "success",
        createdAt: new Date()
      }
    ],
    createdAt: new Date()
  });


    console.log("MongoDB is seeded");
}