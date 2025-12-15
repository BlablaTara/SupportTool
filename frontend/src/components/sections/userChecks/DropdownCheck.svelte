<script>
    import { addCheck, loadingChecks } from "../../../stores/checksStore.js";

    export let email = "";

    $: if (email) {
        runDropdownCheck();
    }


    async function runDropdownCheck() {
        loadingChecks.update(v => ({ ...v, user: true }));
        if (!email) return;

        try {
            const res = await fetch(`/api/users/dropdown?email=${email}`);
            const data = await res.json();

            for (const check of data) {
                addCheck("user", {
                    id: crypto.randomUUID(),
                    title: check.title,
                    status: check.status,
                    message: check.message,
                    items: check.data || [],
                    renderType: "dropdown"
                
                });
            
            }

        } catch (error) {
            addCheck("user", {
                id: crypto.randomUUID(),
                title: "Dropdown Check",
                status: "error",
                message: "Failed to fetch from backend",
                items: error.message,
                renderType: "dropdown"
            });
        }

        loadingChecks.update(v => ({ ...v, user: false }));
    }
</script>