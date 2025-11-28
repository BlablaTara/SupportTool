import { jest } from "@jest/globals";

process.env.COUNT_COLLECTION = "users";
process.env.COUNT_FIELD = "orders";

// Mock Couchbase driver
let mockQuery;

jest.unstable_mockModule("../../db/couchbaseDriver.js", () => ({
    BUCKET: "mockBucket",
    SCOPE: "mockScope",
    connectCouchbase: jest.fn(async () => ({
        cluster: { query: mockQuery }
    })),
}));

// emailEnding mock 
jest.unstable_mockModule("../../utils/emailEnding.js", () => ({
    emailEnding: jest.fn((email) => email) 
}));

const { countCheckCB } = await import("../../checks/couchbase/countCheckCB.js");

describe("countCheckCB", () => {

    test("returns success when array has items", async () => {
        mockQuery = jest.fn(async () => ({
            rows: [
                { orders: ["x", "y", "z"] }
            ]
        }));

        const result = await countCheckCB("user@test.dk");

        expect(result).toEqual({
            status: "success",
            message: "user@test.dk, has 3 orders",
            detail: "Collection: ' users '.  Field: ' orders '",
            data: 3
        });
    });

    test("returns fail when array is empty", async () => {
        mockQuery = jest.fn(async () => ({
            rows: [
                { orders: [] }
            ]
        }));

        const result = await countCheckCB("empty@test.dk");

        expect(result).toEqual({
            status: "fail",
            message: "empty@test.dk, has 0 orders",
            detail: "Collection: ' users '.  Field: ' orders '",
            data: []
        });
    });

    test("returns fail when field is missing", async () => {
        mockQuery = jest.fn(async () => ({
            rows: [
                { otherField: [] }
            ]
        }));

        const result = await countCheckCB("nofield@test.dk");

        expect(result).toEqual({
            status: "fail",
            message: "nofield@test.dk has no 'orders' field",
            detail: "Collection: 'users', Field: 'orders'",
            data: []
        });
    });

    test("returns fail when user not found", async () => {
        mockQuery = jest.fn(async () => ({
            rows: []
        }));

        const result = await countCheckCB("ghost@test.dk");

        expect(result).toEqual({
            status: "fail",
            message: "Email not found: ghost@test.dk",
            detail: "Collection: 'users'",
            data: []
        });
    });

    test("returns fail when field exists but is not an array", async () => {
        mockQuery = jest.fn(async () => ({
            rows: [
                { orders: "not-an-array" }
            ]
        }));

        const result = await countCheckCB("wrongtype@test.dk");

        expect(result).toEqual({
            status: "fail",
            message: "'orders' exists, but is not an array.",
            detail: "Found type: string",
            data: []
        });
    });

    test("returns error when required index is missing", async () => {
        mockQuery = jest.fn(async () => {
            const error = new Error("Missing index");
            error.cause = { first_error_code: 4000 };
            throw error;
        });

        const result = await countCheckCB("index@test.dk");

        expect(result).toEqual({
            status: "error",
            message: "Required index is missing",
            detail:
                "CREATE INDEX idx_email ON `mockBucket`.`mockScope`.`users`(email);"
        });
    });

    test("returns error when keyspace is missing", async () => {
        mockQuery = jest.fn(async () => {
            const error = new Error("Keyspace missing");
            error.cause = { first_error_message: "Keyspace not found" };
            throw error;
        });

        const result = await countCheckCB("keyspace@test.dk");

        expect(result).toEqual({
            status: "error",
            message: "The bucket/scope/collection does not exist",
            detail: "Keyspace not found"
        });
    });

    test("returns error on unknown Couchbase errors", async () => {
        mockQuery = jest.fn(async () => {
            throw new Error("Some random failure");
        });

        const result = await countCheckCB("unknown@test.dk");

        expect(result).toEqual({
            status: "error",
            message: "Unknown Couchbase error",
            detail: "Some random failure"
        });
    });

});
