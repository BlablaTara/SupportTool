<script>
  import { createEventDispatcher, onMount, onDestroy } from "svelte";
  import "../css/helpModal.css"

  // has 'what' and 'when' included
  export let content; 

  const dispatch = createEventDispatcher();

  function close() {
    dispatch("close");
  }

  function handleKey(e) {
    if (e.key === "Escape") {
      close();
    }
  }

  onMount(() => {
    document.addEventListener("keydown", handleKey);
  });

  onDestroy(() => {
    document.removeEventListener("keydown", handleKey);
  });
</script>

<div class="help-backdrop" role="presentation" on:click={close}>
  <div
  class="help-modal"
  role="dialog"
  aria-modal="true"
  tabindex="0"
>
    <header>
      <h3>{content?.title}</h3>
      <button class="close" on:click={close} aria-label="Close help">
        ✕
      </button>
    </header>

    <div class="help-content">
        <section>
            <h4>This metrics shows:</h4>
            <p>{@html content?.what?.replace(/\n/g, "<br>")}</p>
        </section>

        <section>
        <h4>Pay attention when:</h4>
        <p>{@html content?.when?.replace(/\n/g, "<br>")}</p>
        </section>
    </div>
  </div>
</div>

