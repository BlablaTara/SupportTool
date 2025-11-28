import { jest } from '@jest/globals';

process.env.EMAIL_COLLECTION = "users";

// Mocks the Mongo-driver
jest.unstable_mockModule("../../db/mongoDriver.js", () => ({
    connectMongo: jest.fn(async () => ({
        collection: () => ({
            find: () => ({
                toArray: mockToArray
            })
        })
    }))
}));

let mockToArray;

// Imports email-check after the mock
const { emailCheckM } = await import("../../checks/mongo/emailCheckM.js");

describe("emailCheckM()", () =>{

    test("returns success when email exists", async () => {
        mockToArray = jest.fn(async () => [
            { email: "exists@test.dk" }
        ]);

        const result = await emailCheckM("exists@test.dk");

        expect(result).toEqual({
            status: "success",
            message: "User found: exists@test.dk",
            detail: "users",
            data: [{ email: "exists@test.dk" }]
        });
    });

    test("returns fail when email does not exist", async () => {
        mockToArray = jest.fn(async () => []);

        const result = await emailCheckM("notfound@test.dk");

        expect(result).toEqual({
            status: "fail",
            message: "User does not exist: notfound@test.dk",
            detail: "users",
            data: []
        });
    });

    test("returns error on Mongo exception", async () => {
        mockToArray = jest.fn(async () => {
            throw new Error("Connection failed");
        });

        const result = await emailCheckM("error@test.dk");

        expect(result.status).toBe("error");
        expect(result.message).toBe("MongoDB query failed");
        expect(result.detail).toContain("Connection failed");
        
    });
})