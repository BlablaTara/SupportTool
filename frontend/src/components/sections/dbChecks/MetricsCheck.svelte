<script>
    import { onMount } from "svelte";
    import { addCheck, loadingChecks } from "../../../stores/checksStore.js";

    onMount(() => {
        runMetricsCheck();
    });

    async function runMetricsCheck() {
        loadingChecks.update(v => ({ ...v, db: true }));

        try {
            const res = await fetch("/api/metrics");
            const data = await res.json();

            // const items = Object.entries(data.data || {}).map(([key, value]) => ({
            //     id: crypto.randomUUID(),
            //     label: key.charAt(0).toUpperCase() + key.slice(1),
            //     value
            // }));

            

            addCheck("db", {
                id: crypto.randomUUID(),
                title: data.title,
                status: data.status,
                message: data.message,
                detail: data.detail,
                renderType: "metrics",
                metrics: normalizeMetrics(data.data)
            });

        } catch (error) {
            addCheck("db", {
                id: crypto.randomUUID(),
                title: "DB Metrics",
                status: "error",
                message: "Failed to fetch metrics",
                detail: error.message
            });
        }

        loadingChecks.update(v => ({ ...v, db: false }));
        
    }

    function normalizeMetrics(raw) {
    return {
        connections: {
            type: "connections",
            title: "Connections",
            value: raw.connections.current,
            max: raw.connections.max,
            percent: raw.connections.percentVisual,
            rawPercent: raw.connections.percentActual,
            status: raw.connections.status,
            message: raw.connections.message
        },
        cache: {
            type: "gauge",
            title: "Cache usage",
            value: raw.cache.usagePercent,
            percent: raw.cache.usagePercent,
            status: raw.cache.status,
            unit: "%"
        },
        network: {
            value: raw.network.requests,
            status: raw.network.status,
            unit: ""
        },
        cpu: {
            value: raw.cpu.pageFaults,
            status: raw.cpu.status,
            unit: ""
        }
    };
}

</script>