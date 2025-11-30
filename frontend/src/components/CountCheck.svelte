<script>
    import { addCheck } from "../stores/checksStore.js";

    export let email = "";
    let loading = false;

    $: if (email) {
        runCountChecks();
    }

    async function runCountChecks() {
        if (!email) return;

        loading = true;

        try {
            const res = await fetch(`http://localhost:8080/api/users/count?email=${email}`);
            const data = await res.json(); // data er et array af check-resultater

            for (const check of data) {
                addCheck("user", {
                    id: crypto.randomUUID(),
                    title: check.title,
                    status: check.status,
                    message: check.message,
                    detail: check.detail
                });
            }

        } catch (error) {
            addCheck("user", {
                id: crypto.randomUUID(),
                title: "Count Checks",
                status: "error",
                message: "Failed to fetch from backend",
                detail: error.message
            });
        }

        loading = false;
    }
</script>
