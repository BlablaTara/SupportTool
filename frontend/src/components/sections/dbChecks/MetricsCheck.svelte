<script>
    import { onMount } from "svelte";
    import { addCheck, loadingChecks } from "../../../stores/checksStore.js";

    onMount(() => {
        runMetricsCheck();
    });

    async function runMetricsCheck() {
        loadingChecks.update(v => ({ ...v, db: true }));

        try {
            const res = await fetch("http://localhost:8080/api/metrics");
            const data = await res.json();

            const items = [
                {
                    id: crypto.randomUUID(),
                    label: "Connections",
                    value: data.data.connections
                },
                {
                    id: crypto.randomUUID(),
                    label: "Cache",
                    value: data.data.cache
                },
                {
                    id: crypto.randomUUID(),
                    label: "Network",
                    value: data.data.network
                },
                {
                    id: crypto.randomUUID(),
                    label: "CPU",
                    value: data.data.cpu
                }
            ];

            addCheck("db", {
                id: crypto.randomUUID(),
                title: "MongoDB Metrics",
                status: data.status,
                message: data.message,
                detail: data.detail,
                renderType: "dropdown",
                items
            });

        } catch (error) {
            addCheck("db", {
                id: crypto.randomUUID(),
                title: "MongoDB Metrics",
                status: "error",
                message: "Failed to fetch metrics",
                detail: error.message
            });
        }

        loadingChecks.update(v => ({ ...v, db: false }));
        
    }
</script>