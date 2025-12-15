<script>
    import { addCheck, loadingChecks } from "../../../stores/checksStore.js";

    export let email = "";

    $: if (email) {
        runCountChecks();
    }

    async function runCountChecks() {
        loadingChecks.update(v => ({ ...v, user: true }));
        if (!email) return;

        try {
            const res = await fetch(`/api/users/count?email=${email}`);
            const data = await res.json(); 

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
                title: "Count Check",
                status: "error",
                message: "Failed to fetch from backend",
                detail: error.message
            });
        }

        loadingChecks.update(v => ({ ...v, user: false }));
    }
</script>
