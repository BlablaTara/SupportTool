import { jest } from "@jest/globals";

// Test config
const config = {
    title: "Orders Dropdown Check",
    collection: "users",
    field: "orders",
};

// Mock mongoDriver
let mockFindOne;

jest.unstable_mockModule("../../db/mongoDriver.js", () => ({
    connectMongo: jest.fn(async () => ({
        collection: () => ({
            findOne: mockFindOne
        })
    }))
}));

// Import module under test
const { dropdownCheckM } = await import("../../checks/mongo/dropdownCheckM.js");

describe("dropdownCheckM", () => {

    test("returns success when field is an array with items", async () => {
        mockFindOne = jest.fn(async () => ({
            email: "array@test.dk",
            orders: ["a", "b", "c"]
        }));

        const result = await dropdownCheckM(config, "array@test.dk");

        expect(result.status).toBe("success");
        expect(result.data.length).toBe(3);
    });

    test("returns success when field is single value", async () => {
        mockFindOne = jest.fn(async () => ({
            email: "single@test.dk",
            orders: "only-one"
        }));

        const result = await dropdownCheckM(config, "single@test.dk");

        expect(result.status).toBe("success");
        expect(result.data.length).toBe(1);
        expect(result.data[0].value).toBe("only-one");
    });

    test("returns fail when array is empty", async () => {
        mockFindOne = jest.fn(async () => ({
            email: "empty@test.dk",
            orders: []
        }));

        const result = await dropdownCheckM(config, "empty@test.dk");

        expect(result.status).toBe("fail");
        expect(result.data).toEqual([]);
    });

    test("returns fail when field missing", async () => {
        mockFindOne = jest.fn(async () => ({
            email: "nofield@test.dk",
            otherField: []
        }));

        const result = await dropdownCheckM(config, "nofield@test.dk");

        expect(result.status).toBe("fail");
        expect(result.message).toMatch(/Field 'orders' does not exist/);
    });

    test("returns fail when email not found", async () => {
        mockFindOne = jest.fn(async () => null);

        const result = await dropdownCheckM(config, "ghost@test.dk");

        expect(result.status).toBe("fail");
        expect(result.message).toMatch(/Email not found/);
    });

    test("returns error when Mongo throws", async () => {
        mockFindOne = jest.fn(async () => { throw new Error("Mongo boom"); });

        const result = await dropdownCheckM(config, "error@test.dk");

        expect(result.status).toBe("error");
        expect(result.message).toMatch(/MongoDB dropdown-query failed/);
    });

});
