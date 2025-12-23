<script>
    import { onDestroy, onMount } from "svelte";
    import { addCheck, loadingChecks, updateCheck } from "../../../stores/checksStore.js";

    let interval;
    let initialized = false;

    //const TEST_CACHE_STATUS = "warning";

    onMount(() => {
        runMetricsCheck(true);
        interval = setInterval(() => runMetricsCheck(false), 5000); // updating every 5s
    });

    onDestroy(() => {
        clearInterval(interval);
    });

    async function runMetricsCheck(isInitial = false) {
        if (isInitial) {
            loadingChecks.update(v => ({ ...v, db: true }));
        }

        try {
            const res = await fetch("/api/metrics");
            const data = await res.json();

            const metrics = normalizeMetrics(data.data);

            if (!initialized) {
                addCheck("db", {
                    id: crypto.randomUUID(),
                    title: data.title,
                    status: data.status,
                    message: data.message,
                    detail: data.detail,
                    metrics,
                    renderType: "metrics"
                });
                initialized = true;
            } else {
                updateCheck("db", data.title, {
                    status: data.status,
                    message: data.message,
                    detail: data.detail,
                    metrics
                });
            }

        } catch (error) {
            addCheck("db", {
                id: crypto.randomUUID(),
                title: "DB Metrics",
                status: "error",
                message: "Failed to fetch metrics",
                detail: error.message,
                renderType: "metrics"
            });
        }

        if (isInitial) {
            loadingChecks.update(v => ({ ...v, db: false }));
        }
        
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
            type: "network",
            title: "Network requests",
            value: raw.network.current,
            max: raw.network.max,
            percent: raw.network.percentVisual,
            rawPercent: raw.network.percentActual,
            status:
                raw.network.status === "fail" ? "fail" :
                raw.network.status === "warning" ? "warning" :
                "success",
            message: raw.network.message
        },

        cpu: {
            type: "cpu",
            title: "CPU usage",
            value: `${raw.cpu.current}%`,
            max: `${raw.cpu.max}%`,
            percent: raw.cpu.percentVisual,
            rawPercent: raw.cpu.percentActual,
            status:
                raw.cpu.status === "fail" ? "fail" :
                raw.cpu.status === "warning" ? "warning" :
                "success",
            message: raw.cpu.message
        }
    };

}


</script>