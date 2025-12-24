<script>
  import { createEventDispatcher } from "svelte";

  export let title;
  export let helpKey;
  export let message;
  export let data = []; // [{ ts, value }]
  export let max = 100;
  export let height = 48;

  const dispatch = createEventDispatcher();

  let hover = null;

  function onHelp() {
    dispatch("help", { key: helpKey });
  }

  $: points = data
    .map((d, i) => {
      const x = (i / Math.max(data.length - 1, 1)) * 100;
      const y = height - (Math.min(d.value, max) / max) * height;
      return `${x},${y}`;
    })
    .join(" ");
</script>

<div class="trend-card">
    <h5>{title}</h5>
    <button class="help" on:click={onHelp}>?</button>


  <p class="message">{message}</p>

  <svg
    viewBox={`0 0 100 ${height}`}
    class="trend"
    role="img"
    aria-label={`Trend for ${title}`}
    on:mousemove={(e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const index = Math.round((x / rect.width) * (data.length - 1));
      hover = data[index];
    }}
    on:mouseleave={() => (hover = null)}
  >
    <polyline
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      {points}
    />

    {#if hover}
      <circle
        cx={(data.indexOf(hover) / (data.length - 1)) * 100}
        cy={height - (hover.value / max) * height}
        r="2"
        fill="currentColor"
      />
    {/if}
  </svg>

  {#if hover}
    <div class="tooltip">
      <strong>{hover.value.toFixed(2)}</strong>
      <small>{new Date(hover.ts).toLocaleTimeString()}</small>
    </div>
  {/if}
</div>

<style>
  .trend-card {
    background: #fafafaa5;
    padding: 0.75rem;
    border-radius: 6px;
    border-left: 3px solid #888;
  }

  .message {
    font-size: 0.8rem;
    color: #555;
    margin-bottom: 0.25rem;
  }

  .trend {
    /* width: 100%;
    height: 48px; */
    color: #555;
    background: #ffffffc4;
    border-radius: 6px;
  }

  .tooltip {
    font-size: 0.7rem;
    color: #333;
    margin-top: 0.25rem;
  }

  .help {
    background: none;
    border: none;
    cursor: pointer;
  }
</style>
