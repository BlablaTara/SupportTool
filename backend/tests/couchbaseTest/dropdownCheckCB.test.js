import { jest } from "@jest/globals";

const config = {
    title: "Orders Dropdown Check",
    collection: "users",
    field: "orders",
};

// Mock Couchbase driver
let mockQuery;

jest.unstable_mockModule("../../db/couchbaseDriver.js", () => ({
    BUCKET: "mockBucket",
    SCOPE: "mockScope",
    connectCouchbase: jest.fn(async () => ({
        cluster: { query: mockQuery }
    })),
}));

// Mock emailEnding
jest.unstable_mockModule("../../utils/emailEnding.js", () => ({
    emailEnding: jest.fn(email => email)
}));

// Import module under test
const { dropdownCheckCB } = await import("../../checks/couchbase/dropdownCheckCB.js");

describe("dropdownCheckCB", () => {

    test("returns success when array has items", async () => {
        mockQuery = jest.fn(async () => ({
            rows: [{ orders: ["x", "y", "z"] }]
        }));

        const result = await dropdownCheckCB(config, "user@test.dk");

        expect(result.status).toBe("success");
        expect(result.data.length).toBe(3);
    });

    test("returns success when single value", async () => {
        mockQuery = jest.fn(async () => ({
            rows: [{ orders: "single" }]
        }));

        const result = await dropdownCheckCB(config, "single@test.dk");

        expect(result.status).toBe("success");
        expect(result.data.length).toBe(1);
        expect(result.data[0].value).toBe("single");
    });

    test("returns fail when array empty", async () => {
        mockQuery = jest.fn(async () => ({
            rows: [{ orders: [] }]
        }));

        const result = await dropdownCheckCB(config, "empty@test.dk");

        expect(result.status).toBe("fail");
        expect(result.data).toEqual([]);
    });

    test("returns fail when field missing", async () => {
        mockQuery = jest.fn(async () => ({
            rows: [{ otherField: [] }]
        }));

        const result = await dropdownCheckCB(config, "nofield@test.dk");

        expect(result.status).toBe("fail");
        expect(result.message).toMatch(/has no 'orders' field/);
    });

    test("returns fail when user not found", async () => {
        mockQuery = jest.fn(async () => ({
            rows: []
        }));

        const result = await dropdownCheckCB(config, "ghost@test.dk");

        expect(result.status).toBe("fail");
        expect(result.message).toMatch(/Email not found/);
    });

    test("returns fail when field exists but is not array", async () => {
        mockQuery = jest.fn(async () => ({
            rows: [{ orders: "not-an-array" }]
        }));

        const result = await dropdownCheckCB(config, "wrongtype@test.dk");

        expect(result.status).toBe("success");
        expect(result.message).toMatch(/1 recent 'orders' found/);
    });

    test("returns error when index missing", async () => {
        mockQuery = jest.fn(async () => {
            const error = new Error("Missing index");
            error.cause = { first_error_code: 4000 };
            throw error;
        });

        const result = await dropdownCheckCB(config, "index@test.dk");

        expect(result.status).toBe("error");
        expect(result.message).toMatch(/Required index is missing/);
    });

    test("returns error when keyspace missing", async () => {
        mockQuery = jest.fn(async () => {
            const error = new Error("Keyspace missing");
            error.cause = { first_error_message: "Keyspace not found" };
            throw error;
        });

        const result = await dropdownCheckCB(config, "keyspace@test.dk");

        expect(result.status).toBe("error");
        expect(result.message).toMatch(/bucket\/scope\/collection does not exist/);
    });

    test("returns error on unknown Couchbase errors", async () => {
        mockQuery = jest.fn(async () => { throw new Error("Random failure"); });

        const result = await dropdownCheckCB(config, "unknown@test.dk");

        expect(result.status).toBe("error");
        expect(result.message).toMatch(/Unknown Couchbase dropdown-query failed/);
    });

});
