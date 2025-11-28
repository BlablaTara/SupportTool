import { jest } from "@jest/globals";

// ENV for test
process.env.COUNT_COLLECTION = "users";
process.env.COUNT_FIELD = "orders";

// Mock mongoDriver before import
let mockFindOne;
jest.unstable_mockModule("../../db/mongoDriver.js", () => ({
    connectMongo: jest.fn(async () => ({
        collection: () => ({
            findOne: mockFindOne
        })
    }))
}));

// Import module under test
const { countCheckM } = await import("../../checks/mongo/countCheckM.js");

describe("countCheckM", () => {

    test("returns success when field is an array with items", async () => {
        mockFindOne = jest.fn(async () => ({
            email: "array@test.dk",
            orders: ["a", "b", "c"]
        }));

        const result = await countCheckM("array@test.dk");

        expect(result).toEqual({
            status: "success",
            message: "array@test.dk, has 3 orders",
            detail: "Collection: ' users '.  Field: ' orders '",
            data: 3
        });
    });

    test("returns fail when field exists but array is empty", async () => {
        mockFindOne = jest.fn(async () => ({
            email: "empty@test.dk",
            orders: []
        }));

        const result = await countCheckM("empty@test.dk");

        expect(result).toEqual({
            status: "fail",
            message: "empty@test.dk, has 0 orders",
            detail: "Collection: ' users '.  Field: ' orders '",
            data: []
        });
    });

    test("returns fail when user exists but field is missing", async () => {
        mockFindOne = jest.fn(async () => ({
            email: "nofield@test.dk",
            otherField: []
        }));

        const result = await countCheckM("nofield@test.dk");

        expect(result).toEqual({
            status: "fail",
            message: "Field 'orders' does not exist on nofield@test.dk",
            detail: "Collection: 'users'. Field: 'orders'",
            data: []
        });
    });

    test("returns fail when email not found", async () => {
        mockFindOne = jest.fn(async () => null);

        const result = await countCheckM("ghost@test.dk");

        expect(result).toEqual({
            status: "fail",
            message: "Email not found: ghost@test.dk",
            detail: "Collection: 'users'",
            data: []
        });
    });

    test("returns error when Mongo throws", async () => {
        mockFindOne = jest.fn(async () => {
            throw new Error("Mongo boom");
        });

        const result = await countCheckM("error@test.dk");

        expect(result).toEqual({
            status: "error",
            message: "MongoDB role-query failed",
            detail: "Mongo boom"
        });
    });

});
