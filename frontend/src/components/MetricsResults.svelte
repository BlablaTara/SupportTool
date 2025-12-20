<script>
    import "../css/resultItem.css";
    import MetricsBar from "./sections/dbChecks/MetricsBar.svelte";

    export let title;
    export let status;
    export let message;
    export let detail;
    export let metrics = {};

    let open = false;

    function toggle() {
        open = !open;
    }
</script>

<div class="result-item {status}">
    <div class="result-header">
        <h4>{title}</h4>
        <button class="toggle-btn" on:click={toggle} type="button" aria-expanded={open}>
                <span class="msg">{message}</span>

                <svg class="chevron {open ? 'rotated' : ''}" viewBox="0 0 24 24">
                    <path d="M6 9l6 6 6-6" />
                </svg>
            </button>
        {#if detail}
            <small>{detail}</small>
        {/if}
    </div>
    {#if open}
        <div class="metrics-grid">
        {#each Object.entries(metrics) as [, metric]}
            <MetricsBar {...metric} />
        {/each}
        </div>
    {/if}

        <!-- <div class="metrics-grid">
            {#each Object.entries(metrics) as [key, metric]}
                <MetricsBar
                {...metric}
                />
            {/each}
        </div> -->
</div>

<style>
.metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
}
</style>
