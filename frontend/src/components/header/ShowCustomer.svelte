<script>
    import { onMount } from "svelte";

    export let customer = "UNKNOWN";

    onMount(async () => {
        try {
            const res = await fetch("/api/customer");
            const data = await res.json();
            customer = data.customer || "UNKKNOWN";
        } catch (error) {
            console.error("Failed to fetch customername:", error);
            customer = "ERROR"
        }
    });

</script>

<p>{customer}</p>