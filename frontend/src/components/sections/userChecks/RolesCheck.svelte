<script>
    import { addCheck } from "../../../stores/checksStore";
    
    export let email = "";
    let loading = false;

    $: if (email) {
        runRolesCheck();
        
    }

    async function runRolesCheck() {
        if (!email) return;

        loading = true;

        try {
            const res = await fetch(`http://localhost:8080/api/users/roles?email=${email}`);
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
        loading = false;
    }

</script>

