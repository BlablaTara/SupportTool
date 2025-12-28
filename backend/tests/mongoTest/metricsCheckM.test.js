import { jest } from "@jest/globals";

let mockCommand;

jest.unstable_mockModule("../../db/mongoDriver.js", () => ({
    connectMongo: jest.fn(async () => ({
        admin: () => ({
            command: mockCommand
        })
    }))
}));

const { metricsCheckM } = await import("../../checks/mongo/metricsCheckM.js");

describe("metricsCheckM", () => {

    test("returns success with parsed metrics", async () => {
        mockCommand = jest.fn(async () => ({
            connections: {
            current: 10,
            available: 100,
            totalCreated: 50
            },
            network: {
            numRequests: 90
            },
            wiredTiger: {
            cache: {
                "bytes currently in the cache": 2000,
                "maximum bytes configured": 4000
            }
            },
            extra_info: {
            cpu_user: 11,
            cpu_sys: 22
            }
        }));

        const result = await metricsCheckM();

        expect(result.status).toBe("success");
        expect(result.title).toBe("MongoDB Metrics");

        expect(result.data.connections.current).toBe(10);
        expect(result.data.connections.max).toBe(110);
        expect(result.data.connections.status).toBe("success");

        expect(result.data.cache.percentActual).toBeCloseTo(50, 1);
        expect(result.data.cache.status).toBe("success");

        expect(result.data.network).toHaveProperty("current");
        expect(result.data.cpu).toHaveProperty("current");
    });


    test("returns success even when wiredTiger info is missing", async () => {
        mockCommand = jest.fn(async () => ({
            connections: { current: 1, available: 2, totalCreated: 3 },
            network: { numRequests: 0 },
            extra_info: {}
        }));

        const result = await metricsCheckM();

        expect(result.status).toBe("success");
        expect(result.data.cache.percentActual).toBe(0);
        expect(result.data.cache.status).toBe("success");
    });



    test("returns error if Mongo throws", async () => {
        mockCommand = jest.fn(async () => {
            throw new Error("Mongo crashed badly");
        });

        const result = await metricsCheckM();

        expect(result).toEqual({
            status: "error",
            title: "MongoDB Metrics",
            message: "Failed to retrieve MongoDB metrics",
            detail: "Mongo crashed badly",
            data: {}
        });
    });

});
