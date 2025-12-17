import { connectMongo } from "../../db/mongoDriver.js";

export async function metricsCheckM() {
  try {
    const db = await connectMongo();
    const status = await db.admin().command({ serverStatus: 1 });

    const connections = status.connections;
    const cache = status.wiredTiger?.cache || {};
    const network = status.network || {};
    const cpu = status.extra_info || {};

    const bytesInCache = cache.bytesCurrentlyInCache || 0;
    const maxCache = cache.maximumBytesConfigured || 1;
    const cacheUsage = (bytesInCache / maxCache) * 100;

    function statusFromPercent(p) {
      if (p < 70) return "ok";
      if (p < 85) return "warning";
      return "critical";
    }

    return {
      status: "success",
      title: "MongoDB Metrics",
      message: "Live system health overview",
      data: {
        connections: {
          current: connections.current,
          available: connections.available,
          status:
            connections.current < 100 ? "ok" : "warning"
        },
        cache: {
          usagePercent: Number(cacheUsage.toFixed(1)),
          status: statusFromPercent(cacheUsage)
        },
        network: {
          requests: network.numRequests,
          status: "ok"
        },
        cpu: {
          pageFaults: cpu.page_faults,
          status:
            cpu.page_faults > 10000 ? "warning" : "ok"
        }
      }
    };

  } catch (error) {
    return {
      status: "error",
      title: "MongoDB Metrics",
      message: "Failed to retrieve MongoDB metrics",
      detail: error.message
    };
  }
}
