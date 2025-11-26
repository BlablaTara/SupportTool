<script>
  import { onMount } from "svelte";

    export let environment = "UNKNOWN";
    let color = "grey";


    onMount(async () => {
        try {
            const res = await fetch("http://localhost:8080/api/environment");
            const data = await res.json();
            environment = data.environment || "UNKNOWN";
            color = data.color || "grey";
        } catch (error) {
            console.error("Failed to fetch environment:", error);
            environment = "ERROR";
            color = "black";
        }
    });
</script>

<span class="env-badge" style="background-color: {color}">
    {environment}
</span>


