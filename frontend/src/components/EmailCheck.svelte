<script>
    import { checks } from "../stores/checksStore.js";
    let email = "";
    let loading = false;

    async function runCheck() {
        loading = true;

        try {
            const res = await fetch(`http://localhost:8080/check-user?email=${email}`);
            const data = await res.json();
            checks.set(
                {
                    id: crypto.randomUUID(),
                    title: "Email Check",
                    status: data.exists ? "success" : "fail",
                    message: data.exists
                        ? `User found: ${data.email}`
                        : `User does not exist`,
                    collection: data.collection    
                }
            );
        } catch (error) {
            console.error(error);
        }
        loading = false;
    }

    function clearCheck() {
        checks.set(null);
        email = "";

    }
</script>

<div class="email-check">
    <input
    type="email"
    bind:value={email}
    placeholder="Enter email..."
    />

    <button on:click={runCheck} disabled={loading || email.length === 0}>
        {loading ? "Validating..." : "Validate"}
    </button>

    <button on:click={clearCheck} disabled={loading}>
        Clear
    </button>
</div>

<style>
.email-check {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

input {
  flex: 1;
  padding: 0.5rem;
}
button {
  padding: 0.5rem 1rem;
}
</style>