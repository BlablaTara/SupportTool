<script>
    import { onMount } from "svelte";
    import { addCheck } from "../stores/checksStore.js";

    let loading = false;

    onMount(() => {
        runPingCheck();
    });

    async function runPingCheck() {
        loading = true;

        try {
            const res = await fetch('http://localhost:8080/api/ping');
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
        loading = false;
        
    }
</script>

<div>
    {#if loading}
        <p>Checking ping...</p>
    {/if}
</div>