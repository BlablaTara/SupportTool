<script>
    import { onMount } from "svelte";
    import { addCheck, loadingChecks } from "../../../stores/checksStore.js";

    onMount(() =>{
        runCollectionsCheck();
    });

    async function runCollectionsCheck() {
        loadingChecks.update(v => ({ ...v, db: true }));

        try {
            const res = await fetch("/api/collections");
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
        loadingChecks.update(v => ({ ...v, db: false })); 
    }
</script>
