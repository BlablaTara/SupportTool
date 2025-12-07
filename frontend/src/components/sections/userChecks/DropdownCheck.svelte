<script>
    import { addCheck } from "../../../stores/checksStore.js";

    export let email = "";
    let loading = false;

    $: if (email) {
        runDropdownCheck();
    }


    async function runDropdownCheck() {
        if (!email) return;

        loading = true;

        try {
            const res = await fetch(`http://localhost:8080/api/users/dropdown?email=${email}`);
            const data = await res.json();

            for (const check of data) {
                addCheck("user", {
                    id: crypto.randomUUID(),
                    title: check.title,
                    status: check.status,
                    message: check.message,
                    items: check.detail,
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

        loading = false;
    }
</script>