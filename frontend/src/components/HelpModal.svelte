<script>
  import { createEventDispatcher, onMount, onDestroy } from "svelte";

  export let content; 
  // forventer:
  // {
  //   title: string,
  //   what: string,
  //   when: string
  // }

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

    <section>
      <h4>What does this show?</h4>
      <p>{@html content?.what?.replace(/\n/g, "<br>")}</p>
    </section>

    <section>
      <h4>When should I care?</h4>
      <p>{@html content?.when?.replace(/\n/g, "<br>")}</p>
    </section>
  </div>
</div>

<style>
  .help-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.55);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .help-modal {
    background: #111;
    color: #fff;
    width: 90%;
    max-width: 420px;
    border-radius: 8px;
    padding: 16px 18px 18px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  h3 {
    margin: 0;
    font-size: 16px;
  }

  .close {
    background: none;
    border: none;
    color: #aaa;
    font-size: 18px;
    cursor: pointer;
  }

  .close:hover {
    color: #fff;
  }

  section {
    margin-top: 12px;
  }

  h4 {
    margin: 0 0 4px;
    font-size: 13px;
    color: #bbb;
  }

  p {
    margin: 0;
    font-size: 13px;
    line-height: 1.4;
    color: #ddd;
  }
</style>
