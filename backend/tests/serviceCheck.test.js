import { describe, expect, jest, beforeEach } from "@jest/globals";

// Mock global fetch
global.fetch = jest.fn();

// Mock parseServices
jest.unstable_mockModule("../utils/parseServices.js", () => ({
    parseServices: jest.fn()
}));

const { parseServices } = await import("../utils/parseServices.js");

// Import module under test (EFTER mocks)
const { serviceCheck } = await import("../checks/serviceCheck.js");

describe("serviceCheck", () => {

    beforeEach(() => {
        fetch.mockReset();
        parseServices.mockReset();
        process.env.SERVICE_CHECKS = "dummy";
    });

    test("returns error when no services configured", async () => {
        parseServices.mockReturnValueOnce([]);

        const result = await serviceCheck();

        expect(result).toEqual({
            status: "error",
            message: "No services configured in backend (SERVICE_CHECKS)",
            data: []
        });
    });

    test("returns success when service responds with version", async () => {
        parseServices.mockReturnValueOnce([
            {
                name: "Test Service",
                devURL: "localhost:8081",
                testURL: "localhost:8082",
                prodURL: "localhost:8083"
            }
        ]);

        fetch.mockResolvedValue({
            ok: true,
            json: async () => ({ version: "1.2.3" })
        });

        const result = await serviceCheck();

        expect(result.status).toBe("success");
        expect(result.data[0]).toEqual({
            service: "Test Service",
            dev: "1.2.3",
            test: "1.2.3",
            prod: "1.2.3",
            errors: []
        });
    });

    test("returns fail when a service is down", async () => {
        parseServices.mockReturnValueOnce([
            {
                name: "Down Service",
                devURL: "localhost:9999",
                testURL: "localhost:9999",
                prodURL: "localhost:9999"
            }
        ]);

        fetch.mockRejectedValue(new Error("ECONNREFUSED"));

        const result = await serviceCheck();

        expect(result.status).toBe("fail");

        expect(result.data[0].dev).toBe("down");
        expect(result.data[0].test).toBe("down");
        expect(result.data[0].prod).toBe("down");

        expect(result.data[0].errors.length).toBe(3);
    });

    test("handles http responses where ok=false", async () => {
        parseServices.mockReturnValueOnce([
            {
                name: "HTTP Fail Service",
                devURL: "localhost:8081",
                testURL: "localhost:8081",
                prodURL: "localhost:8081"
            }
        ]);

        fetch.mockResolvedValue({
            ok: false,
            status: 503
        });

        const result = await serviceCheck();

        expect(result.status).toBe("fail");

        expect(result.data[0].dev).toBe("down");
        expect(result.data[0].test).toBe("down");
        expect(result.data[0].prod).toBe("down");

        expect(result.data[0].errors).toContain("dev fail: HTTP 503");
    });

    test("handles missing URL as error", async () => {
        parseServices.mockReturnValueOnce([
            {
                name: "Bad Config",
                devURL: null,
                testURL: "",
                prodURL: undefined
            }
        ]);

        const result = await serviceCheck();

        expect(result.status).toBe("fail");

        expect(result.data[0].dev).toBe("error");
        expect(result.data[0].test).toBe("error");
        expect(result.data[0].prod).toBe("error");

        expect(result.data[0].errors.length).toBe(3);
    });

});
