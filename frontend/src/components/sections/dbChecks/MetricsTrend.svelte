<script>
  import "../../../css/metrics.css";
  import { createEventDispatcher } from "svelte";

  export let title;
  export let helpKey;
  export let message;
  export let status;
  export let data = []; // [{ ts, value }]
  export let height = 48;

  export let warning = 0.7; // fx 0.7
  export let critical = 0.9; // fx 0.9

  export let windowSize = 50;

  const dispatch = createEventDispatcher();

  let hover = null;
  let scaleMax = 1;

  let mouseX = 0;
  let mouseY = 0;

  const tooltipWidth = 15;
  const tooltipHeight = 8;
  const tooltipYOffset = 10;

  function openHelp() {
    dispatch("help", { key: helpKey });
  }

  $: visibleData = data.slice(-windowSize);

  //Highest observed value in viewbox
  $: observedMax = Math.max(...visibleData.map((d) => d.value), 0);

  $: {
    const hardMax = Math.max(observedMax, warning, critical, 0.05);

    if (hardMax > scaleMax) {
      scaleMax = hardMax * 1.3;
    } else {
      scaleMax = scaleMax * 0.98;
      if (scaleMax < hardMax * 1.3) {
        scaleMax = hardMax * 1.3;
      }
    }
  }

  $: points = visibleData
    .map((d, i) => {
      const x = (i / Math.max(visibleData.length - 1, 1)) * 100;
      const y = height - (d.value / scaleMax) * height;
      return `${x},${y}`;
    })
    .join(" ");


  $: hoverIndex =
  hover && visibleData.length > 1
    ? visibleData.indexOf(hover)
    : null;

$: cx =
  hoverIndex !== null
    ? (hoverIndex / (visibleData.length - 1)) * 100
    : 0;


  function formatValue(v) {
    if (v < 1) return v.toFixed(2);
    if (v < 10) return v.toFixed(1);
    return Math.round(v).toString();
  }
</script>

<div class="metric {status}">
  <h5>{title}</h5>
  <button class="help" on:click={openHelp}>?</button>

  <p class="message">{message}</p>

  <svg
    viewBox={`0 0 100 ${height}`}
    class="trend"
    role="img"
    aria-label={`Trend for ${title}`}
    on:mousemove={(e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;

      const index = Math.round(
        (mouseX / rect.width) * (visibleData.length - 1)
      );

      hover = visibleData[index];
    }}
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
      <text
        x="98"
        y={height - (warning / scaleMax) * height - 1}
        font-size="3"
        fill="#f5a623"
        text-anchor="end"
      >
        {formatValue(warning)}
      </text>
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
      <text
        x="98"
        y={height - (critical / scaleMax) * height - 1}
        font-size="3"
        fill="#d0021b"
        text-anchor="end"
      >
        {formatValue(critical)}
      </text>
    {/if}

    {#if hover}
      <g>
        <circle
          cx={cx}
          cy={height - (hover.value / scaleMax) * height}
          r="2"
          fill="currentColor"
        />

        <rect
      x={cx - tooltipWidth / 2}
      y={height - (hover.value / scaleMax) * height - tooltipYOffset}
      width={tooltipWidth}
      height={tooltipHeight}
      rx="2"
      fill="#000"
      opacity="0.8"
    />

    <text
      x={cx}
      y={height - (hover.value / scaleMax) * height - tooltipYOffset / 2}
      fill="#fff"
      font-size="4"
      text-anchor="middle"
      dominant-baseline="middle"
    >
          {hover.value.toFixed(1)}
        </text>
      </g>
    {/if}
  </svg>
  <!-- <div class="meta">
    <span>Peak: {globalMax.toFixed(2)}</span>
  </div> -->

  <!-- 📊 Seneste målinger -->
  <!-- <div class="values">
    {#each visibleData.slice(-) as d}
      <span>{d.value.toFixed(2)}</span>
    {/each}
  </div> -->

  <!-- {#if hover}
    <div class="tooltip">
      <strong>{hover.value.toFixed(2)}</strong>
      <small>{new Date(hover.ts).toLocaleTimeString()}</small>
    </div>
  {/if} -->
</div>
