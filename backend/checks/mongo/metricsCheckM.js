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

    const bytesInCache = cache.bytesCurrentlyInCache;
    const maxCache = cache.maximumBytesConfigured;
    const cacheUsage = (bytesInCache / maxCache) * 100;
    const cacheStatusValue = cacheStatus(cacheUsage);

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

    function cacheStatus(cache) {
      if (cache < 70) return "success";
      if (cache < 85) return "warning";
      return "fail";
    }

    function cacheMessage(status) {
        if (status === "success") return "Cache usage is within healthy range";
        if (status === "warning") return "Cache usage is high – monitor memory pressure";
        return "Cache usage is near capacity – risk of eviction and degraded performance";
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
            current: bytesInCache,
            max: maxCache,
            percentActual: Number(cacheUsage.toFxed(1)),
            percentVisual: Math.max(cacheUsage, 0.5),
            status: cacheStatusValue,
            message: cacheMessage(cacheStatusValue)
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
