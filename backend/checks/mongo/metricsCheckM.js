import { connectMongo } from "../../db/mongoDriver.js";

export async function metricsCheckM() {
  try {
    const db = await connectMongo();
    const status = await db.admin().command({ serverStatus: 1 });

    // CONNECTIONS //
    const connections = status.connections;
    const maxConnections = connections.current + connections.available;
    const connectionPercent = (connections.current / maxConnections) * 100;

    function connectionStatus(current, maxConnections) {
        const percent = (current / maxConnections) * 100;
        if (percent< 60) return "success";
        if (percent < 80) return "warning";
        return "fail";
    }
    function connectionMessage(status) {
        if (status === "success") return "Connections usage is within normal range";
        if (status === "warning") return "High number of active connections";
        return "Connections limit is close - risk of saturation";
    }

    // CACHE //
    const cache = status.wiredTiger?.cache || {};
    const bytesInCache = cache["bytes currently in the cache"] ?? 0;
    const maxCache = cache["maximum bytes configured"] ?? 1;
    const cacheUsage =
        maxCache > 0 ? (bytesInCache / maxCache) * 100 : 0;
    const cacheStatusValue = cacheStatus(cacheUsage);
    const currentCache = formatBytes(bytesInCache);
    const maxCacheFormatted = formatBytes(maxCache);

    // console.log("CACHE RAW:", {
    //     bytesInCache,
    //     maxCache,
    //     cache
    // });

    function cacheStatus(percent) {
      if (percent < 70) return "success";
      if (percent < 90) return "warning";
      return "fail";
    }
    function cacheMessage(status) {
        if (status === "success") return "Cache usage is within healthy range";
        if (status === "warning") return "Cache usage is high – monitor memory pressure";
        return "Cache usage is near capacity – risk of eviction and degraded performance";
    }
    function formatBytes(bytes) {
        const gb = bytes / 1024 / 1024 / 1024;
        if (gb >= 0.1) {
            return { value: Number(gb.toFixed(2)), unit: "GB" };
        }

        const mb = bytes / 1024 / 1024;
        return { value: Number(mb.toFixed(1)), unit: "MB" };
    }

    // NETWORKS //
    const network = status.network || {};
    const networkRequests = network.numRequests ?? 0;
    //Our soft max
    const MAX_NETWORK_REQUESTS = 100000;
    const networkPercent = (networkRequests / MAX_NETWORK_REQUESTS) * 100;
    const networkStatusValue = networkStatus(networkPercent);

    function networkStatus(percent) {
        if (percent < 60) return "success";
        if (percent < 80 ) return "warning";
        return "fail";
    }
    function networkMessage(status) {
        if (status === "success") return "Network traffic is within normal range";
        if (status === "warning") return "High network activity detected";
        return "Network traffic is very high – potential bottleneck";
    }

    // CPU //
    const cpu = status.extra_info || {};


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
            current: currentCache,
            max: maxCacheFormatted,
            percentActual: Number(cacheUsage.toFixed(5)),
            percentVisual: Math.max(cacheUsage, 0.5),
            status: cacheStatusValue,
            message: cacheMessage(cacheStatusValue)
        },
       network: {
            current: networkRequests,
            max: MAX_NETWORK_REQUESTS,
            percentActual: Number(networkPercent.toFixed(2)),
            percentVisual: Math.max(networkPercent, 0.5),
            status: networkStatusValue,
            message: networkMessage(networkStatusValue)
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
