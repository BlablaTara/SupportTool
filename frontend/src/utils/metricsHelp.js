export const metricsHelp = {
  cpu: {
    title: "CPU Usage",
    what: `
The percentage of CPU time consumed by MongoDB over time.

This metric is calculated by comparing MongoDB’s reported CPU time
(cpu_user + cpu_sys) between two samples and normalizing it across
the total number of CPU cores on the host.

Data source:
• serverStatus.extra_info.cpu_user
• serverStatus.extra_info.cpu_sys
• serverStatus.hostInfo.system.cpu.cores

The displayed value represents average MongoDB CPU usage across all cores
during the sampling interval.

    `,
    when: `
• CPU usage is sustained above 50% (warning threshold)
• CPU usage exceeds 80% (fail threshold – risk of saturation)
• CPU usage increases while cache usage remains healthy
• High CPU usage correlates with slow queries or increased latency

Thresholds:
• < 50% → Healthy
• 50–80% → Warning
• ≥ 80% → Critical

These thresholds are defined manually and are not provided by MongoDB.
    `,
  },

  cache: {
    title: "Cache Usage",
    what: `
How much of MongoDB’s WiredTiger cache is currently in use.

This metric is calculated as a percentage of:
• bytes currently in the cache
divided by
• maximum bytes configured for the WiredTiger cache

Data source:
• serverStatus.wiredTiger.cache["bytes currently in the cache"]
• serverStatus.wiredTiger.cache["maximum bytes configured"]

The bar visualizes memory pressure inside MongoDB’s storage engine,
not total system memory usage.

    `,
    when: `
• Cache usage is sustained above 70% (warning threshold)
• Cache usage exceeds 90% (fail threshold)
• Query latency increases while cache usage is high
• Disk activity increases due to cache eviction

Thresholds:
• < 70% → Healthy
• 70–90% → Warning
• ≥ 90% → Critical

These thresholds are defined manually based on typical WiredTiger behavior.
    `,
  },

  network: {
    title: "Network Throughput",
    what: `
The rate of incoming requests handled by MongoDB (requests per second).

This value is derived by measuring the increase in total network requests
between two samples and dividing it by elapsed time.

Data source:
• serverStatus.network.numRequests

The displayed value represents requests per second (RPS),
not bandwidth or packet size.

    `,
    when: `
• Request rate exceeds 500 RPS (warning threshold)
• Request rate exceeds 2000 RPS (fail threshold)
• Sudden spikes correlate with latency or CPU pressure
• Sustained high throughput causes resource contention

Thresholds:
• < 500 RPS → Healthy
• 500–2000 RPS → Warning
• ≥ 2000 RPS → Critical

These thresholds are manually defined and should be tuned
to match the expected workload of your environment.
    `,
  },

  connections: {
    title: "Connections",
    what: `
How many client connections are currently open to MongoDB
relative to the maximum available connections.

The percentage is calculated as:
current connections / (current + available connections)

Data source:
• serverStatus.connections.current
• serverStatus.connections.available

    `,
    when: `
• Connection usage exceeds 60% (warning threshold)
• Connection usage exceeds 80% (fail threshold)
• Connection count grows steadily without dropping
• Application requests start waiting for connections

Thresholds:
• < 60% → Healthy
• 60–80% → Warning
• ≥ 80% → Critical

These thresholds are defined manually and represent connection saturation risk.
    `,
  },
};
