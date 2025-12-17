<script>
    export let label;
    export let value = 0;
    export let status = "ok";
    export let unit = "%";

    $: color =
        status === "ok" ? "#4caf50" :
        status === "warning" ? "#ff9800" :
        "#f44336";
</script>

<div class="gauge">
    <div class="label">{label}</div>

    <div class="bar">
        <div
            class="fill"
            style="width: {Math.min(value,100)}%; background:{color}"
        ></div>
    </div>

    <div class="value">{value}{unit}</div>
</div>

<style>
.gauge {
    background: #fafafa;
    padding: 0.75rem;
    border-radius: 6px;
}

.label {
    font-size: 0.85rem;
    margin-bottom: 0.25rem;
}

.bar {
    background: #e0e0e0;
    height: 8px;
    border-radius: 4px;
}

.fill {
    height: 100%;
    border-radius: 4px;
    transition: width 0.3s;
}

.value {
    font-size: 0.8rem;
    margin-top: 0.25rem;
}
</style>
