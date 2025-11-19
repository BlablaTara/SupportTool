<script>
  import { onMount } from "svelte";

    export let environment = "UNKNOWN";

    function badgeColor(env) {
        switch (env) {
            case "DEV": return "green";
            case "TEST": return "yellow";
            case "PROD": return "red";
            default: return "grey";
        }
    }

    onMount(async () => {
        try {
            const res = await fetch("http://localhost:8080/api/environment");
            const data = await res.json();
            environment = data.environment || "UNKNOWN";
        } catch (error) {
            console.error("Failed to fetch environment:", error);
            environment = "ERROR";
        }
    });
</script>

<span class="env-badge" style="background-color: {badgeColor(environment)}">
    {environment}
</span>


