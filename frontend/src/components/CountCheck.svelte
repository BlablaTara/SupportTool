<script>
    import { addCheck } from "../stores/checksStore.js";

    export let email = "";
    let loading = false;

    $: if (email) {
        runCountCheck();
    }

    async function runCountCheck() {
        if (!email) return;

        loading = true;

        try {
            const res = await fetch(`http://localhost:8080/api/users/count?email=${email}`);
            const data = await res.json();

            addCheck("user", {
                id: crypto.randomUUID(),
                title: data.title,
                status: data.status,
                message: data.message,
                detail: data.detail
            });

        } catch (error) {
            addCheck("user", {
                id: crypto.randomUUID(),
                title: "Count Check",
                status: "error",
                message: "Failed to fetch from backend",
                detail: error.message
            });
        }
        loading = false;
    }
    
</script>