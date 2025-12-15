<script>
    import { onMount } from "svelte";
    import { addCheck, loadingChecks } from "../../../stores/checksStore.js";

    onMount(() => {
        runPingCheck();
    });

    async function runPingCheck() {
        loadingChecks.update(v => ({ ...v, system: true }));

        try {
            const res = await fetch('/api/ping');
            const data = await res.json();

            addCheck("system", {
                id: crypto.randomUUID(),
                title: "Ping Check",
                status: data.status,
                message: data.message,
                detail: data.detail
            });

        } catch (error) {
            addCheck("system", {
                id: crypto.randomUUID(),
                title: "Ping Check",
                status: "error",
                message: "Failed to fetch ping-url",
                detail: error.message
            });
            
        }
        loadingChecks.update(v => ({ ...v, system: false }));
        
    }
</script>
