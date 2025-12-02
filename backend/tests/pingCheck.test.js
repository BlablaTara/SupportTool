import { describe, expect, jest } from "@jest/globals";

process.env.PING_URL = "https://example.com";

// Mocking fetch globally
global.fetch = jest.fn();

// Import module under test
const { pingCheck } = await import("../checks/pingCheck.js");

describe("pingCheck", () => {

    test("returns success when fetch returns ok=true", async () => {
        //Mocl fetch response
        fetch.mockResolvedValueOnce({
            ok: true,
            status: 200
        });

        const result = await pingCheck();

        expect(result).toEqual({
            status: "success",
            message: "Ping success - is running",
            detail: "https://example.com",
            data: [],
        });
    });

    test("returns fail when fetch returns ok=false", async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 503
        });

        const result = await pingCheck();

        expect(result).toEqual({
            status: "fail",
            message: "Ping failed: - 503",
            detail: "https://example.com",
            data: [], 
        });
    });

    test("returns error when fetch throws", async () => {
        fetch.mockRejectedValueOnce(new Error("Network down"));

        const result = await pingCheck();

        expect(result).toEqual({
            status: "error",
            message: "Couln't ping this domain - Check the URL for misspelling.",
            detail: "Network down"
        })
    })
})