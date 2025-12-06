import { jest } from "@jest/globals";

// Mock connectMongo
let mockCountDocuments;

jest.unstable_mockModule("../../db/mongoDriver.js", () => ({
    connectMongo: jest.fn(async () => ({
        collection: () => ({
            countDocuments: mockCountDocuments
        })
    }))
}));

const { collectionsCheckM } = await import("../../checks/mongo/collectionsCheckM.js");

describe("collectionsCheckM", () => {

    test("returns success when all collections have data", async () => {
        mockCountDocuments = jest.fn(async () => 5);

        const result = await collectionsCheckM(["users", "orders"]);

        expect(result).toEqual({
            status: "success",
            title: "Collections Check",
            message: "All collections contain data",
            detail: "Checked: users,orders",
            data: ["users", "orders"]
        });
    });

    test("returns fail when some collections are empty", async () => {
        mockCountDocuments = jest
            .fn()
            .mockResolvedValueOnce(0) // users
            .mockResolvedValueOnce(3); // orders

        const result = await collectionsCheckM(["users", "orders"]);

        expect(result).toEqual({
            status: "fail",
            title: "Collections Check",
            message: "One or more collections have no data",
            detail: "Empty collections: users",
            data: ["users"]
        });
    });

    test("returns fail with multiple empty collections", async () => {
        mockCountDocuments = jest.fn(async () => 0);

        const result = await collectionsCheckM(["users", "orders"]);

        expect(result).toEqual({
            status: "fail",
            title: "Collections Check",
            message: "One or more collections have no data",
            detail: "Empty collections: users,orders",
            data: ["users", "orders"]
        });
    });

    test("returns error when Mongo throws", async () => {
        mockCountDocuments = jest.fn(async () => {
            throw new Error("Mongo crash!");
        });

        const result = await collectionsCheckM(["users"]);

        expect(result).toEqual({
            status: "error",
            title: "Collections Check",
            message: "MongoDB collection check failed",
            detail: "Mongo crash!",
            data: []
        });
    });

});
