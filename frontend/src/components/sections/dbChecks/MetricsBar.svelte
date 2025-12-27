<script>
  import "../../../css/metrics.css"
  import { createEventDispatcher } from "svelte";


    export let title;
    export let value;
    export let min = 0;
    export let max;
    export let rawPercent;
    export let percent;
    export let status;
    export let message;
    //export let type;
    export let helpKey;

    const dispatch = createEventDispatcher();

    function openHelp() {
        dispatch("help", { type: helpKey });
    }

    $: color =
        status === "success" ? "#28a745" :
        status === "warning" ? "#ff9100" :
        "#dc3545";

</script>

<div class="metric {status}">
    <h5>{title}</h5>
    <button class="help" on:click={openHelp}>?</button>

    <p class="message">{message}</p>

    <div class="bar" title="{`Current: ${value} / Max: ${max}`}">
        <div
            class="fill"
            style="width:{percent}%; background:{color}"
        ></div>
    </div>
    <div class="range">
        <span>Min: {min}</span>
        <span>Current: {rawPercent}%</span>
        <span>Max: {max}</span>

    </div>

</div>

