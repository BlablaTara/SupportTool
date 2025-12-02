import { jest } from "@jest/globals";

// ENV for test
const config = {
    title: "Orders Check",
    collection: "users",
    field: "orders"
};

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

        const result = await countCheckM(config, "array@test.dk");

        expect(result).toEqual({
            status: "success",
            title: "Orders Check",
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

        const result = await countCheckM(config, "empty@test.dk");

        expect(result).toEqual({
            status: "fail",
            title: "Orders Check",
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

        const result = await countCheckM(config, "nofield@test.dk");

        expect(result).toEqual({
            status: "fail",
            title: "Orders Check",
            message: "Field 'orders' does not exist on nofield@test.dk",
            detail: "Collection: 'users'. Field: 'orders'",
            data: []
        });
    });

    test("returns fail when email not found", async () => {
        mockFindOne = jest.fn(async () => null);

        const result = await countCheckM(config, "ghost@test.dk");

        expect(result).toEqual({
            status: "fail",
            title: "Orders Check",
            message: "Email not found: ghost@test.dk",
            detail: "Collection: 'users'",
            data: []
        });
    });

    test("returns error when Mongo throws", async () => {
        mockFindOne = jest.fn(async () => {
            throw new Error("Mongo boom");
        });

        const result = await countCheckM(config, "error@test.dk");

        expect(result).toEqual({
            status: "error",
            title: "Orders Check",
            message: "MongoDB role-query failed",
            detail: "Mongo boom"
        });
    });

});
