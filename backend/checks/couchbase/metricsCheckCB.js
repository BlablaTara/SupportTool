import { connectCouchbase, BUCKET } from "../../db/couchbaseDriver.js";

export async function metricsCheckCB() {
    try {
        const { cluster } = await connectCouchbase();

        // PING METRIC = network health
        const ping = await cluster.ping();

        // Extract network data almost similar to mongoDB metric
        const services = Object.values(ping.services).flat();
        const avgRtt =
            services.length > 0
            ? services.reduce((acc, s) => acc + s.latency, 0) / services.length
            : 0;


        // Connection info:
        const diagnostics = await cluster.diagnostics();

        const connections = {
            totalEndpoints: diagnostics.endpoints?.length ?? 0,
            services: diagnostics.endpoints || []
        };


        const network = {
            averageRttMs: avgRtt,
            endpoints: services.map(s => ({
                type: s.type,
                id: s.id,
                local: s.local,
                remote: s.remote,
                latency: s.latency
            }))
        };





        // Couchbase REST API url
        const url = `${process.env.CB_CONNSTR_HTTP}/pools/default/buckets/${BUCKET}`;

        const authHeader = "Basic " + Buffer.from(
            `${process.env.CB_USERNAME}:${process.env.CB_PASSWORD}`
        ).toString("base64");

        const res = await fetch(url, {
            headers: {
                "Authorization": authHeader
            }
        });

        const bucketStats = await res.json();

        const ramStats = bucketStats.basicStats;

        const bucketRamUsage = {
            memUsed: ramStats.memUsed,
            quotaPercentUsed: ramStats.quotaPercentUsed,
            diskUsed: ramStats.diskUsed
        };

        return {
            status: "success",
            title: "Couchbase Metrics",
            message: "Metrics retrieved",
            detail: "RAM, connections, network, CPU placeholder",
            data: {
                bucketRamUsage,
                connections,
                network
                // other metrics
            }
        };

    } catch (error) {
        return {
            status: "error",
            title: "Couchbase Metrics",
            message: "Failed to retrieve Couchbase metrics",
            detail: error.message,
            data: {}
        };
    }
}