<script>
  import { onMount } from "svelte";
  import { addCheck, loadingChecks } from "../../../stores/checksStore.js";

    onMount(() => {
        runServiceCheck();
    });

    async function runServiceCheck() {
        loadingChecks.update(v => ({ ...v, system: true }));
        try {

            const res = await fetch("http://localhost:8080/api/services");
            const data = await res.json();

            addCheck("system", {
                id: crypto.randomUUID(),
                title: "Service Check",
                status: data.status,
                message: data.message,
                table: data.data,
                renderType: "table"
            });


        } catch (error) {
            addCheck("system", {
                id: crypto.randomUUID(),
                title: "Service Check",
                status: "error",
                message: "Failed to fetch service data",
                detail: error.message,
                table: [],
                renderType: "table"
            });

        }

        loadingChecks.update(v => ({ ...v, system: false }));

    }
</script>
