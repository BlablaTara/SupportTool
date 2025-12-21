import { connectMongo } from "../../db/mongoDriver.js";

export async function metricsCheckM() {
  try {
    const db = await connectMongo();
    const status = await db.admin().command({ serverStatus: 1 });

    const connections = status.connections;
    const maxConnections = connections.current + connections.available
    const connectionPercent = (connections.current / maxConnections) * 100;

    const cache = status.wiredTiger?.cache || {};
    const network = status.network || {};
    const cpu = status.extra_info || {};

    const bytesInCache = cache.bytesCurrentlyInCache || 0;
    const maxCache = cache.maximumBytesConfigured || 1;
    const cacheUsage = (bytesInCache / maxCache) * 100;

    // CONNECTIONS
    function connectionStatus(current, maxConnections) {
        const percent = (current / maxConnections) * 100;
        if (percent< 60) return "success";
        if (percent < 80) return "warning";
        return "fail";
    }

    // CONNECTIONS
    function connectionMessage(status) {
        if (status === "success") return "Connections usage is within normal range";
        if (status === "warning") return "High number of active connections";
        return "Connections limit is close - risk of saturation";
    }


    function statusFromPercent(p) {
      if (p < 70) return "success";
      if (p < 85) return "warning";
      return "fail";
    }

    return {
      status: "success",
      title: "MongoDB Metrics",
      message: "Health overview",
      data: {
        connections: {
          current: connections.current,
          max: maxConnections,
          percentActual: Number(connectionPercent.toFixed(5)),
          percentVisual: Math.max(connectionPercent, 0.5),
          status: connectionStatus(connections.current, maxConnections),
          message: connectionMessage(connectionStatus(connections.current, maxConnections))
        },
        cache: {
          usagePercent: Number(cacheUsage.toFixed(1)),
          status: statusFromPercent(cacheUsage)
        },
        network: {
          requests: network.numRequests,
          status: "success"
        },
        cpu: {
          pageFaults: cpu.page_faults,
          status:
            cpu.page_faults > 10000 ? "warning" : "success"
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
