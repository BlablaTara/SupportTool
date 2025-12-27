<script>
  import "../../../css/metrics.css"
  import { createEventDispatcher } from "svelte";

  export let title;
  export let helpKey;
  export let message;
  export let data = []; // [{ ts, value }]
  export let max = 100;
  export let height = 48;

  export let warning = 0.7;   // fx 0.7
  export let critical = 0.9; // fx 0.9

  export let windowSize = 50;

  let globalMax = 0;

  $: {
        for (const d of data) {
            if (d.value > globalMax) {
            globalMax = d.value;
            }
        }
    }

  //let lastScaleMax = max;

  const dispatch = createEventDispatcher();

  let hover = null;
  let lastScaleMax = 1;

  function onHelp() {
    dispatch("help", { key: helpKey });
  }

  $: visibleData = data.slice(-windowSize);

  //Highest observed value in viewbox
    $: observedMax = Math.max(...visibleData.map(d => d.value), 0);

    // gives air above highest value
    $: paddedMax = observedMax * 1.2 || max;

    // Brug aldrig mindre end warning / critical / global max


    $: scaleTarget = Math.max(
        Math.max(observedMax, globalMax) * 1.3,
        warning,
        critical,
        0.05
    );

    $: scaleMax = lastScaleMax = lastScaleMax * 0.8 + scaleTarget * 0.2;

    // 80 % tidligere værdi, 20 % ny → smooth
    // lastScaleMax = lastScaleMax * 0.8 + target * 0.2;
    // return lastScaleMax;
    // })();



  $: points = visibleData
  .map((d, i) => {
    const x = (i / Math.max(visibleData.length - 1, 1)) * 100;
    const y = height - (d.value / scaleMax) * height;
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
      const index = Math.round((x / rect.width) * (visibleData.length - 1));
      hover = visibleData[index];
    }}
    on:mouseleave={() => (hover = null)}
  >
    <polyline
      fill="none"
      stroke="currentColor"
      stroke-width="0.6"
      stroke-linecap="round"
      stroke-linejoin="round"
      {points}
    />

    {#if warning !== null}
        <line
            x1="0"
            x2="100"
            y1={height - (warning / scaleMax) * height}
            y2={height - (warning / scaleMax) * height}
            stroke="#f5a623"
            stroke-width="0.5"
            stroke-dasharray="4 2"
        />
        {/if}

        {#if critical !== null}
        <line
            x1="0"
            x2="100"
            y1={height - (critical / scaleMax) * height}
            y2={height - (critical / scaleMax) * height}
            stroke="#d0021b"
            stroke-width="0.5"
            stroke-dasharray="4 2"
        />
    {/if}


    {#if hover}
      <circle
        cx={(visibleData.indexOf(hover) / (visibleData.length - 1)) * 100}
        cy={height - (hover.value / scaleMax) * height}
        r="2"
        fill="currentColor"
      />
    {/if}
  </svg>
  <div class="meta">
    <span>Peak: {globalMax.toFixed(2)}</span>
    </div>

   <!-- 📊 Seneste målinger -->
  <div class="values">
    {#each visibleData.slice(-5) as d}
      <span>{d.value.toFixed(2)}</span>
    {/each}
  </div>

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

  .values {
  display: flex;
  gap: 0.5rem;
  font-size: 0.7rem;
  color: #555;
  margin-top: 0.25rem;
  font-family: monospace;
}

</style>
