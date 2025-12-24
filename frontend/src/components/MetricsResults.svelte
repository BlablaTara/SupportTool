<script>
    import "../css/resultItem.css";
    import MetricsBar from "./sections/dbChecks/MetricsBar.svelte";
    import MetricTrend from "./sections/dbChecks/MetricsTrend.svelte";
    import { metricsHistory } from "../stores/metricsHistoryStore.js";


    export let openHelpModal;
    export let title;
    export let status;
    export let message;
    export let detail;
    export let metrics = {};

    let open = false;

    function toggle() {
        open = !open;
    }
    

    $: overallStatus = (() => {
        if (status === "error") return "error";
        
        if (!metrics || Object.keys(metrics).length === 0) {
            return status ?? "neutral";
        }

        const statuses = Object.values(metrics).map(m => mapStatus(m.status));

        if (statuses.includes("error")) return "error";
        if (statuses.includes("fail")) return "fail";
        if (statuses.includes("warning")) return "warning";
        if (statuses.includes("success")) return "success";

        return "neutral";
    })();


    function mapStatus(raw) {
        if (!raw) return "neutral";

        const s = String(raw).toLowerCase();

        if (s === "error") return "error";
        if (s === "fail" || s === "critical") return "fail";
        if (s === "warning") return "warning";
        if (s === "success" || s === "ok") return "success";

        return "neutral";
    }


</script>

<!-- <pre>{JSON.stringify($metricsHistory, null, 2)}</pre>
<pre>{JSON.stringify(metrics, null, 2)}</pre> -->

<div class="result-item {overallStatus}">
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
                {#if metric.render === "bar"}
                    <MetricsBar
                    {...metric}
                    on:help={(e) => openHelpModal(metric.helpKey)}
                    />
                {/if}

                {#if metric.render === "trend"}
                    <MetricTrend
                        title={metric.title}
                        helpKey={metric.helpKey}
                        message={metric.message}
                        data={$metricsHistory[metric.metric]}
                        max={metric.metric === "network" ? 2000 : 1}
                        windowSize={50}
                        warning={2}
                        critical={3}
                        on:help={() => openHelpModal(metric.helpKey)}
                    />
                {/if}
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

