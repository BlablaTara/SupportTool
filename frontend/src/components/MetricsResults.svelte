<script>
    import "../css/resultItem.css";
    import MetricsBar from "./sections/dbChecks/MetricsBar.svelte";

    export let title;
    export let status;
    export let message;
    export let detail;
    export let metrics = {};
</script>

<div class="result-item {status}">
    <div class="result-header">
        <h4>{title}</h4>
        <p>{message}</p>
        {#if detail}
            <small>{detail}</small>
        {/if}
    </div>

    <div class="metrics-grid">
        {#each Object.entries(metrics) as [key, metric]}
            <MetricsBar
            {...metric}
            />
        {/each}
    </div>
</div>

<style>
.metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
}
</style>
