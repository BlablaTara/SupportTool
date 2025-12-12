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
                bytesIn: 1234,
                bytesOut: 5678,
                numRequests: 90
            },
            wiredTiger: {
                cache: {
                    bytesCurrentlyInChache: 2000,
                    maximumBytesConfigured: 4000
                }
            },
            extra_info: {
                userTime: 11,
                systemTime: 22,
                page_faults: 3
            }
        }));

        const result = await metricsCheckM();

        expect(result).toEqual({
            status: "success",
            title: "MongoDB Metrics",
            message: "All Metrics is OK",
            detail: "Metrics monitored: connections, memory/cache, network & CPU usage",
            data: {
                connections: {
                    current: 10,
                    available: 100,
                    totalCreated: 50
                },
                cache: {
                    bytesInCache: 2000,
                    maxCache: 4000,
                    cacheUsagePercent: "50.00"
                },
                network: {
                    bytesIn: 1234,
                    bytesOut: 5678,
                    numRequests: 90
                },
                cpu: {
                    userMs: 11,
                    sysMs: 22,
                    pageFaults: 3
                }
            }
        });
    });

    test("returns success even when wiredTiger info is missing", async () => {
        mockCommand = jest.fn(async () => ({
            connections: { current: 1, available: 2, totalCreated: 3 },
            network: { bytesIn: 1, bytesOut: 2, numRequests: 3 },
            // no wiredTiger
            extra_info: {}
        }));

        const result = await metricsCheckM();

        expect(result.status).toBe("success");
        expect(result.data.cache.bytesInCache).toBe(0);
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
