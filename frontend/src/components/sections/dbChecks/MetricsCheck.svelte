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
                metrics: normalizeMetrics(data.data),
                renderType: "metrics"
    
            });

        } catch (error) {
            addCheck("db", {
                id: crypto.randomUUID(),
                title: "DB Metrics",
                status: "error",
                message: "Failed to fetch metrics",
                detail: error.message,
                metrics: error.message,
                renderType: "metrics"
            });
        }

        loadingChecks.update(v => ({ ...v, db: false }));
        
    }

    function normalizeMetrics(raw) {
        if (!raw) return {};
    return {
        connections: {
            type: "connections",
            title: "Connections",
            value: raw.connections.current,
            max: raw.connections.max,
            percent: raw.connections.percentVisual,
            // percent: 92.4,
            rawPercent: raw.connections.percentActual,
            // rawPercent: 92.4,
            status: raw.connections.status === "fail" ? "fail" :
                    raw.connections.status === "warning" ? "warning" :
                    "success",
            // status: "success",
            message: raw.connections.message
            // message: "Connections limit is close - risk of saturation"
        },
        cache: {
            type: "cache",
            title: "Cache usage",
            value: raw.cache.current,
            max: raw.cache.max,
            percent: raw.cache.percentVisual,
            rawPercent: raw.cache.percentActual,
            status: raw.cache.status === "fail" ? "fail" :
                    raw.cache.status === "warning" ? "warning" :
                    "success",
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