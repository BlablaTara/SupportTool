import { writable } from "svelte/store";

export const metricsHistory = writable({
  cpu: [],
  network: [],
  cache: [],
  connections: []
});