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

            const items = Object.entries(data.data || {}).map(([key, value]) => ({
                id: crypto.randomUUID(),
                label: key.charAt(0).toUpperCase() + key.slice(1),
                value
            }));

            addCheck("db", {
                id: crypto.randomUUID(),
                title: data.title,
                status: data.status,
                message: data.message,
                detail: data.detail,
                renderType: "dropdown",
                items
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
</script>