<script>
  import { onMount } from "svelte"
  
  export let database = "UNKNOWN";

  onMount(async () => {
    try {
        const res = await fetch("/api/database");
        const data = await res.json();
        database = data.database || "UNKNOWN";
    } catch (error) {
        console.error("Failed to fetch database:", error)
        database = "ERROR"
    }
  });

</script>

<p>{database}</p>
