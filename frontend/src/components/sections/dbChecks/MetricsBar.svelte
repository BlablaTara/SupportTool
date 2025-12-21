<script>

    export let title;
    export let value;
    export let min = 0;
    export let max;
    export let rawPercent;
    export let percent;
    export let status;
    export let message;

    $: color =
        status === "success" ? "#28a745" :
        status === "warning" ? "#ff9100" :
        "#dc3545";

</script>

<div class="metric {status}">
    <h5>{title}</h5>
    <p class="message">{message}</p>

    <div class="bar" title="{`Current: ${value} / Max: ${max}`}">
        <div
            class="fill"
            style="width:{percent}%; background:{color}"
        ></div>
    </div>
    <div class="range">
        <span>{min}</span>
        <span>{rawPercent}%</span>
        <span>{max}</span>

    </div>

</div>

<style>
/* .title {
    font-size: 0.85rem;
    margin-bottom: 0.25rem;
} */

.metric {
    background: #fafafaa5;
    padding: 0.75rem;
    border-radius: 6px;
}

.metric.fail {
  background: #ffedee7d;
  border-left: 3px solid #dc3545;
}

.metric.warning {
  background: #fbf2eb84;
  border-left: 3px solid #ff9100;
}

.metric.success {
    background: #f0fdf387;
  border-left: 3px solid #28a745;
}


.bar {
    background: #e0e0e0;
    height: 10px;
    border-radius: 6px;
    margin: 0.5rem 0;
    position: relative;
}

.fill {
  height: 100%;
  border-radius: 6px;
  transition: width 0.3s ease;
}

.range {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #555;
}

.message {
  font-size: 0.85rem;
  margin-bottom: 0.25rem;
}
</style>
