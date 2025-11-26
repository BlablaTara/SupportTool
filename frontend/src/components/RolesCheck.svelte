<script>
    import { addCheck } from "../stores/checksStore";

    let email = "";
    // parent component can bind email
    export { email as email }; 

    let loading = false;

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

<div class="roles-check">
    <button on:click={runRolesCheck} disabled={loading || !email}>
        {loading ? "Checking..." : "Check Roles"}
    </button>
</div>


<style>
.roles-check {
  margin-top: 0.5rem;
}

button {
  padding: 0.5rem 1rem;
}
</style>