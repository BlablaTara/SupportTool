import { jest } from '@jest/globals';

// Mocks the Mongo-driver
jest.unstable_mockModule('../db/mongo/mongoDriver.js', () => ({
    connectMongo: jest.fn()
}));

// Imports email-check after the mock
const { connectMongo } = await import("../db/mongo/mongoDriver.js");
const { emailCheckM } = await import("../db/mongo/emailCheckM.js");

describe("emailCheckM()", () =>{

    test("returns success when email exists", async () => {
        // Faking DB response
        connectMongo.mockResolvedValue({
            collection: () => ({
                find: () => ({
                    toArray: () => Promise.resolve([{ email: "exists@test.dk" }])
                })
            })
        });

        const result = await emailCheckM("users", "exists@test.dk");

        expect(result.status).toBe("success");
        expect(result.items.length).toBe(1);
        expect(result.message).toBe("User found: exists@test.dk");
    });

    test("returns fail when email does not exist", async () => {
        connectMongo.mockResolvedValue({
            collection: () => ({
                find: () => ({
                    toArray: () => Promise.resolve([])
                })
            })
        });

        const result = await emailCheckM("users", "notfound@test.dk");

        expect(result.status).toBe("fail");
        expect(result.items.length).toBe(0);
        expect(result.message).toBe("User does not exist");
    });

    test("returns error on Mongo exception", async () => {
        connectMongo.mockRejectedValue(new Error("Connection failed"));

        const result = await emailCheckM("users", "error@test.dk");

        expect(result.status).toBe("error");
        expect(result.message).toBe("MongoDB query failed");
        expect(result.detail).toContain("Connection failed");
        
    });
})