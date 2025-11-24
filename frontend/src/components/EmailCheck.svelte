<script>
  import { addCheck, clearSection } from "../stores/checksStore.js";
  let email = "test@test.dk";
  let loading = false;

  async function runCheck() {
    loading = true;

    try {
      const res = await fetch(`http://localhost:8080/api/users/email?email=${email}`);
      const data = await res.json();

        addCheck("user", {
          id: crypto.randomUUID(),
          title: "Email Check",
          status: data.status,
          message: data.message,
          detail: "Collection: " + data.detail || ""
        });

    } catch (error) {
        addCheck("user", {
            id: crypto.randomUUID(),
            title: "Email Check",
            status: "error",
            message: error.message,
            detail: ""
        });
    }
    loading = false;
  }

  function clearCheck() {
    clearSection("user");
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