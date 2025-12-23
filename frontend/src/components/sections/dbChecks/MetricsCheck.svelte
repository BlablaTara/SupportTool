<script>
    import { onMount } from "svelte";
    import { addCheck, loadingChecks } from "../../../stores/checksStore.js";


    //const TEST_CACHE_STATUS = "warning";

    onMount(() => {
        runMetricsCheck();
    });

    async function runMetricsCheck() {
        loadingChecks.update(v => ({ ...v, db: true }));

        try {
            const res = await fetch("/api/metrics");
            const data = await res.json();

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
            rawPercent: raw.connections.percentActual,
            status: raw.connections.status === "fail" ? "fail" :
                    raw.connections.status === "warning" ? "warning" :
                    "success",
            message: raw.connections.message
        },
        cache: {
            type: "cache",
            title: "Cache usage (GB)",
            value: `${raw.cache.current.value} ${raw.cache.current.unit}`,
            max: `${raw.cache.max.value} ${raw.cache.max.unit}`,
            percent: raw.cache.percentVisual,
            rawPercent: raw.cache.percentActual,
            status: 
                raw.cache.status === "fail" ? "fail" :
                raw.cache.status === "warning" ? "warning" :
                "success",
            message: raw.cache.message
        },

        // cache: (() => {
        //     const base = {
        //         type: "cache",
        //         title: "Cache usage (GB)",
        //         value: `${raw.cache.current.value} ${raw.cache.current.unit}`,
        //         max: `${raw.cache.max.value} ${raw.cache.max.unit}`,
        //         percent: raw.cache.percentVisual,
        //         rawPercent: raw.cache.percentActual,
        //         status:
        //             raw.cache.status === "fail" ? "fail" :
        //             raw.cache.status === "warning" ? "warning" :
        //             "success",
        //         message: raw.cache.message
        //     };

        //     // 🟡 TEST: WARNING
        //     if (TEST_CACHE_STATUS === "warning") {
        //         return {
        //             ...base,
        //             percent: 75,
        //             rawPercent: 75,
        //             status: "warning",
        //             value: "1.05 GB",
        //             message: "TEST: Cache usage is high"
        //         };
        //     }

        //     // 🔴 TEST: FAIL / CRITICAL
        //     if (TEST_CACHE_STATUS === "fail") {
        //         return {
        //             ...base,
        //             percent: 95,
        //             rawPercent: 95,
        //             status: "fail",
        //             value: "1.34 GB",
        //             message: "TEST: Cache usage is near capacity"
        //         };
        //     }

        //     return base;
        // })(),

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