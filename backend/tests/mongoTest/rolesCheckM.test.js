import { describe, expect, jest } from "@jest/globals";

process.env.EMAIL_COLLECTION = "users";
process.env.ROLES_FIELD = "roles";

// Mock mongoDriver before import
jest.unstable_mockModule("../../db/mongo/mongoDriver.js", () => ({
    connectMongo: jest.fn(async () => ({
        collection: () => ({
            findOne: mockFindOne
        })
    }))
}));


let mockFindOne;

// Import module under test
const { rolesCheckM } = await import("../../db/mongo/rolesCheckM.js");

describe("rolesCheckM", () => {

    test("returns success when user has roles as array", async () => {
        mockFindOne = jest.fn(async () => ({
            email: "arrayexists@test.dk",
            roles: ["tester", "developer"]
        }));

        const result = await rolesCheckM("arrayexists@test.dk");

        expect(result).toEqual({
            status: "success",
            message: "arrayexists@test.dk has roles: tester, developer",
            detail: "roles",
            data: ["tester", "developer"]
        });
    });

    test("returns success when user has role as string", async () => {
        mockFindOne = jest.fn(async () => ({
            email: "stringexists@test.dk",
            roles: "developer"
        }));

        const result = await rolesCheckM("stringexists@test.dk");

        expect(result).toEqual({
            status: "success",
            message: "stringexists@test.dk has roles: developer",
            detail: "roles",
            data: ["developer"]
        });
    });

    test("returns fail when user has 0 roles", async () => {
        mockFindOne = jest.fn(async () => ({
            email: "empty@test.dk",
            roles: []
        }));

        const result = await rolesCheckM("empty@test.dk");

        expect(result).toEqual({
            status: "fail",
            message: "empty@test.dk has 0 roles",
            detail: "roles",
            data: []
        });
    });

    test("returns fail when user not found", async () => {
        mockFindOne = jest.fn(async () => null);

        const result = await rolesCheckM("ghost@test.dk");

        expect(result).toEqual({
            status: "fail",
            message: "User not found: ghost@test.dk",
            detail: "users",
            data: []
        });
    });

    test("returns error when Mongo throws", async () => {
        mockFindOne = jest.fn(async () => {
            throw new Error("Mongo crashed");
        });

        const result = await rolesCheckM("error@test.dk");

        expect(result.status).toBe("error");
        expect(result.message).toBe("MongoDB role-query failed");
        expect(result.detail).toBe("Mongo crashed");
    });
});
