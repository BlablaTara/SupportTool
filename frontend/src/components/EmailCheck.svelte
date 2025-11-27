<script>
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";
  import { addCheck, clearSection } from "../stores/checksStore.js";
  //let email = "test@test.dk";
  let email = "";
  let loading = false;
  let emailEnding = "";

  const dispatch = createEventDispatcher();

  onMount(async () => {
    const res = await fetch("http://localhost:8080/api/users/email-ending");
    const data = await res.json();
    emailEnding = data.ending || "";
  })

  async function runCheck() {
    loading = true;

    let finalEmail =
    emailEnding && !email.includes("@") ? email + emailEnding : email;

    try {
      const res = await fetch(`http://localhost:8080/api/users/email?email=${finalEmail}`);
      const data = await res.json();

        addCheck("user", {
          id: crypto.randomUUID(),
          title: "Email Check",
          status: data.status,
          message: data.message,
          detail: "Looking in '" + data.detail + "' collection."
        });

      // notifying other components:
      dispatch("validate", { email: finalEmail });

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
    type="text"
    bind:value={email}
    placeholder={`Enter email... ${emailEnding ? `(${emailEnding})` : ""}`}
    />

    <button on:click={runCheck} disabled={loading || email.length === 0}>
        {loading ? "Validating..." : "Validate"}
    </button>

    <button on:click={clearCheck} disabled={loading}>
        Clear
    </button>
</div>

<!-- Email Preview -->
{#if emailEnding && email && !email.includes("@")}
  <div class="email-preview">
    Will be checked as:
    <strong>{email}{emailEnding}</strong>
  </div>
{/if}

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
.email-preview {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
}
button {
  padding: 0.5rem 1rem;
}
</style>