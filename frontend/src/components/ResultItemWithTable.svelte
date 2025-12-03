<script>
  import "../css/resultItem.css";

  export let title;
  export let status;
  export let message;
  export let detail;
  export let table = [];

  let open = false;
  function toggle() {
    open = !open;
        console.log("DEBUG toggle clicked, open =", open);
  }
</script>

<div class="result-item {status}">
  <div class="result-header">
    <h4>{title}</h4>


    {#if table && table.length > 0}
      <button
        class="toggle-btn"
        on:click={toggle}
        type="button"
        aria-expanded={open}
      >
        <span class="msg">{message}</span>

        <svg
          class="chevron {open ? 'rotated' : ''}"
          viewBox="0 0 24 24"
          width="16"
          height="16"
        >
          <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" />
        </svg>
      </button>
    {:else}
      <p>{message}</p>
    {/if}
  </div>

  <small>{detail}</small>
</div>

{#if open && table && table.length > 0}
  <div class="item-table-wrapper">
    <table class="item-table">
      <thead>
        <tr>
          <th>Service</th>
          <th>Dev</th>
          <th>Test</th>
          <th>Prod</th>
        </tr>
      </thead>
      <tbody>
        {#each table as row}
          <tr>
            <td>{row.service}</td>
            <td>{row.dev}</td>
            <td>{row.test}</td>
            <td>{row.prod}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}

<style>
  .result-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .toggle-btn {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    border: 1px solid #ccc;
    background: #f8f8f8;
    padding: 4px 8px;
    border-radius: 6px;
    cursor: pointer;
  }
  

  .toggle-btn:hover {
    background: #eee;
  }

  .chevron {
    transition: transform 0.2s ease;
  }

  .chevron.rotated {
    transform: rotate(180deg);
  }

  .item-table-wrapper {
    margin-top: 10px;
  }
</style>
