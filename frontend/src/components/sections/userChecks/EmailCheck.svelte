<script>
  import '../../../css/emailInput.css'
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";
  import { addCheck, clearSection, loadingChecks } from "../../../stores/checksStore.js";
  
  //let email = "test@test.dk";
  let email = "";
  let emailEnding = "";
  const dispatch = createEventDispatcher();

  $: loading = $loadingChecks.user;

  onMount(async () => {
    const res = await fetch("http://localhost:8080/api/users/email-ending");
    const data = await res.json();
    emailEnding = data.ending || "";
  })

  async function runCheck() {
    loadingChecks.update(v => ({ ...v, user: true }));

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
          detail: data.detail 
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
    loadingChecks.update(v => ({ ...v, user: false }));
  }

  function clearCheck() {
    clearSection("user");
    email = "";

    dispatch("validate", { email: "" });
  }
</script>

<div class="email-check">
    <input
    type="text"
    bind:value={email}
    placeholder={`Enter email... ${emailEnding ? `(${emailEnding})` : ""}`}
    />

    <button class="validate-btn" on:click={runCheck} disabled={loading || email.length === 0}>
        {loading ? "Validating..." : "Validate"}
    </button>

    <button class="validate-btn" on:click={clearCheck} disabled={loading}>
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

