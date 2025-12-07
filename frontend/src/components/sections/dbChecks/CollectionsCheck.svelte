<script>
    import { onMount } from "svelte";
    import { addCheck } from "../../../stores/checksStore.js";

    let loading = false;

    onMount(() =>{
        runCollectionsCheck();
    });

    async function runCollectionsCheck() {
        loading = true;

        try {
            const res = await fetch("http://localhost:8080/api/collections");
            const data = await res.json();

            addCheck("db", {
                id: crypto.randomUUID(),
                title: "Collections Check",
                status: data.status,
                message: data.message,
                detail: data.detail
            });

        } catch (error) {
            addCheck("db", {
                id: crypto.randomUUID(),
                title: "Collection Check",
                status: "error",
                message: "Failed to fetch backend",
                detail: error.message
            });
        }
        loading = false; 
    }
</script>

<div>
    {#if loading}
        <p>Checking collections...</p>
    {/if}
</div>