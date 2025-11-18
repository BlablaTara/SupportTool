<script>
  import { onMount } from "svelte";

    let message = "Loading...";

    onMount(async () => {
        try {
            const res = await fetch ("http://localhost:8080/");
            message = await res.text();

        } catch (error) {
            message = "could not reach backend";
            console.error(error);
        }
    });
</script>

<h1>{message}</h1>