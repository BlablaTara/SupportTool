import { jest } from "@jest/globals";

let mockQuery;

jest.unstable_mockModule("../../db/couchbaseDriver.js", () => ({
    BUCKET: "mockBucket",
    SCOPE: "mockScope",
    connectCouchbase: jest.fn(async () => ({
        cluster: { query: mockQuery }
    }))
}));

const { collectionsCheckCB } = await import("../../checks/couchbase/collectionsCheckCB.js");

describe("collectionsCheckCB", () => {

    test("returns success when all collections have data", async () => {
        mockQuery = jest.fn(async () => ({
            rows: [{ count: 5 }]
        }));

        const result = await collectionsCheckCB(["users", "orders"]);

        expect(result).toEqual({
            status: "success",
            title: "Collections Check",
            message: "All collections contain data",
            detail: "Checked: users, orders",
            data: ["users", "orders"]
        });
    });

    test("returns fail when some collections are empty", async () => {
        mockQuery = jest
            .fn()
            .mockResolvedValueOnce({ rows: [{ count: 0 }] })
            .mockResolvedValueOnce({ rows: [{ count: 4 }] });

        const result = await collectionsCheckCB(["users", "orders"]);

        expect(result).toEqual({
            status: "fail",
            title: "Collections Check",
            message: "One or more collections have no data",
            detail: "Empty collections: users",
            data: ["users"]
        });
    });

    test("returns error when keyspace is missing", async () => {
        mockQuery = jest.fn(async () => {
            const error = new Error("No collection");
            error.cause = { first_error_message: "Keyspace not found" };
            throw error;
        });

        const result = await collectionsCheckCB(["users"]);

        expect(result).toEqual({
            status: "error",
            title: "Collections Check",
            message: "Collection: 'users' does not exist",
            detail: "Keyspace not found",
            data: []
        });
    });

    test("returns error when primary index is missing", async () => {
        mockQuery = jest.fn(async () => {
            const error = new Error("No index");
            error.cause = { first_error_code: 4000 };
            throw error;
        });

        const result = await collectionsCheckCB(["users"]);

        expect(result).toEqual({
            status: "error",
            title: "Collections Check",
            message: "Missing index for collection 'users'",
            detail: "CREATE PRIMARY INDEX idx_users_primary ON `mockBucket`.`mockScope`.`users`;",
            data: []
        });
    });

    test("returns error on unknown query error", async () => {
        mockQuery = jest.fn(async () => {
            throw new Error("Something weird happened");
        });

        const result = await collectionsCheckCB(["users"]);

        expect(result).toEqual({
            status: "error",
            title: "Collections Check",
            message: "Unknown Couchbase query error in 'users'",
            detail: "Something weird happened",
            data: []
        });
    });

    test("returns error when connectCouchbase throws outside loop", async () => {
        // override the mock temporarily
        const { connectCouchbase } = await import("../../db/couchbaseDriver.js");
        connectCouchbase.mockImplementationOnce(async () => {
            throw new Error("Cluster connection broken");
        });

        const result = await collectionsCheckCB(["users"]);

        expect(result).toEqual({
            status: "error",
            title: "Collections Check",
            message: "Couchbase collection check failed",
            detail: "Cluster connection broken",
            data: []
        });
    });

});
