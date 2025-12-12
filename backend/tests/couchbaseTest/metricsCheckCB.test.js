import { jest } from "@jest/globals";

let mockCluster;
let mockPing;
let mockDiagnostics;

jest.unstable_mockModule("../../db/couchbaseDriver.js", () => ({
    BUCKET: "mockBucket",
    connectCouchbase: jest.fn(async () => ({
        cluster: mockCluster
    }))
}));

const { metricsCheckCB } = await import("../../checks/couchbase/metricsCheckCB.js");

describe("metricsCheckCB", () => {

    beforeEach(() => {
        process.env.CB_USERNAME = "user";
        process.env.CB_PASSWORD = "pass";
    });

    test("returns error if CB_CONNSTR_HTTP is missing", async () => {
        delete process.env.CB_CONNSTR_HTTP;

        const result = await metricsCheckCB();

        expect(result).toEqual({
            status: "error",
            title: "Couchbase Metrics",
            message: "Missing CB_CONNSTR_HTTP in environment variables",
            detail: "Please define CB_CONNSTR_HTTP",
            data: {}
        });
    });

    test("returns success with metrics", async () => {
        process.env.CB_CONNSTR_HTTP = "http://examplehost:8091";

        mockPing = jest.fn(async () => ({
            services: {
                kv: [
                    { latency: 10, type: "kv", id: "1", local: "a", remote: "b" }
                ]
            }
        }));

        mockDiagnostics = jest.fn(async () => ({
            endpoints: [{ type: "kv", id: "1" }]
        }));

        global.fetch = jest.fn(async () => ({
            ok: true,
            json: async () => ({
                basicStats: {
                    memUsed: 500,
                    quotaPercentUsed: 20,
                    diskUsed: 999
                }
            })
        }));

        mockCluster = {
            ping: mockPing,
            diagnostics: mockDiagnostics
        };

        const result = await metricsCheckCB();

        expect(result.status).toBe("success");
        expect(result.data.bucketRamUsage.memUsed).toBe(500);
        expect(global.fetch).toHaveBeenCalled();
    });

    test("returns error if REST API responds non-200", async () => {
        process.env.CB_CONNSTR_HTTP = "http://exampleurl:8091";

        mockCluster = {
            ping: jest.fn(async () => ({ services: {} })),
            diagnostics: jest.fn(async () => ({ endpoints: [] }))
        };

        global.fetch = jest.fn(async () => ({
            ok: false,
            status: 404,
            statusText: "Not Found"
        }));

        const result = await metricsCheckCB();

        expect(result).toEqual({
            status: "error",
            title: "Couchbase Metrics",
            message: "Failed to query Couchbase REST API",
            detail: "HTTP 404: Not Found",
            data: {}
        });
    });

    test("returns error if ping throws", async () => {
        process.env.CB_CONNSTR_HTTP = "http://example:8091";

        mockCluster = {
            ping: jest.fn(async () => {
                throw new Error("Ping fail");
            })
        };

        const result = await metricsCheckCB();

        expect(result.status).toBe("error");
        expect(result.detail).toBe("Ping fail");
    });

    test("returns error if connectCouchbase throws", async () => {
        process.env.CB_CONNSTR_HTTP = "http://example:8091";

        const { connectCouchbase } = await import("../../db/couchbaseDriver.js");
        connectCouchbase.mockImplementationOnce(async () => {
            throw new Error("Cluster broken");
        });

        const result = await metricsCheckCB();

        expect(result).toEqual({
            status: "error",
            title: "Couchbase Metrics",
            message: "Failed to retrieve Couchbase metrics",
            detail: "Cluster broken",
            data: {}
        });
    });

});
