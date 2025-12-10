import { connectMongo } from "../../db/mongoDriver.js";

export async function metricsCheckM() {
    try {
        const db = await connectMongo();
        const admin = db.admin();

        const status = await admin.command({ serverStatus: 1 });

        // Connections metrics
        const connections = status.connections;


        // Memory / Chache metrics
        const cache = status.wiredTiger?.cahce || {};
        const bytesInCache = cache.bytesCurrentlyInChache || 0;
        const maxCache = cache.maximumBytesConfigured || 1;
        const chacheUsagePercent = ((bytesInCache / maxCache) * 100).toFixed(2);

        // Network metrics
        const network = status.network;

        // CPU metrics
        const cpu = status.extra_info || {};

        return {
            status: "success",
            title: "MongoDB Metrics",
            message: "All Metrics is OK",
            detail: "Metrics monitored: connections, memory/cache, network & CPU usage",
            data: {
                connections: {
                    current: connections.current,
                    available: connections.available,
                    totalCreated: connections.totalCreated
                },
                cache: {
                    bytesInCache,
                    maxCache,
                    chacheUsagePercent
                },
                network: {
                    bytesIn: network.bytesIn,
                    bytesOut: network.bytesOut,
                    numRequests: network.numRequests
                },
                cpu: {
                    userMs: cpu.userTime,
                    sysMs: cpu.systemTime,
                    pageFaults: cpu.page_faults
                }
            }
        };

    } catch (error) {
        return {
            status: "error",
            title: "MongoDB Metrics",
            message: "Failed to retrieve MongoDB metrics",
            detail: error.message,
            data: {}
        };
    }
}