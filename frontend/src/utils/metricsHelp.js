export const metricsHelp = {
  cpu: {
    title: "CPU Usage",
    what: `
Shows how much CPU time MongoDB is consuming over time.
This value is normalized across all available CPU cores.
    `,
    when: `
• Sustained usage above 80%
• CPU spikes combined with slow queries
• CPU usage increases while cache usage remains healthy
    `,
  },

  cache: {
    title: "Cache Usage",
    what: `
Shows how much of MongoDB’s WiredTiger cache is currently in use.
    `,
    when: `
• Sustained usage above 90%
• Increasing eviction activity
• Queries suddenly become slower
    `,
  },

  network: {
    title: "Network Throughput",
    what: `
Shows the rate of incoming and outgoing requests to MongoDB.
    `,
    when: `
• Sudden spikes combined with latency
• Sustained high request rate
    `,
  },
};
