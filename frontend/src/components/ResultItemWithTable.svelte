<script>
  import "../css/resultItem.css";

  export let title;
  export let status;
  export let message;
  export let table = [];

  let open = false;

  function toggle() { 
    open = !open;
    }

    function getBadgeClass(value) {
        if (!value || value === "error") return "error";
        if (value === "down") return "fail";
        if (value.startsWith("HTTP")) return "fail";
        if (value === "Unknown") return "fail";
        return "success";
    }

</script>

<div class="result-item {status}">
  <div class="result-header">
    <h4>{title}</h4>

    {#if table && table.length > 0}
        <button class="toggle-btn" on:click={toggle} type="button" aria-expanded={open}>
            <span class="msg">{message}</span>

            <svg class="chevron {open ? 'rotated' : ''}" viewBox="0 0 24 24">
                <path d="M6 9l6 6 6-6" />
            </svg>
        </button>
    {:else}
        <p>{message}</p>
    {/if}
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
                <td><span class="badge {getBadgeClass(row.dev)}">{row.dev}</span></td>
                <td><span class="badge {getBadgeClass(row.test)}">{row.test}</span></td>
                <td><span class="badge {getBadgeClass(row.prod)}">{row.prod}</span></td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>
