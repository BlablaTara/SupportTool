<script>
    import { addCheck, loadingChecks} from "../../../stores/checksStore.js";
    
    export let email = "";

    $: if (email) {
        runRolesCheck();
    }

    async function runRolesCheck() {
        loadingChecks.update(v => ({ ...v, user: true }));
        if (!email) return;

        try {
            const res = await fetch(`/api/users/roles?email=${email}`);
            const data = await res.json();

            addCheck("user", {
                id: crypto.randomUUID(),
                title: "Roles Check",
                status: data.status,
                message: data.message,
                detail: data.detail
            });

        } catch (error) {
            addCheck("user", {
                id: crypto.randomUUID(),
                title: "Roles Check",
                status: "error",
                message: "Failed to fetch roles",
                detail: error.message
            });
        }
        loadingChecks.update(v => ({ ...v, user: false }));
    }

</script>

