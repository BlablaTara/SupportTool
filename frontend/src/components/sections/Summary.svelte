<script>
    import { checks } from "../../stores/checksStore.js";

    export let section;

    $: allChecks = $checks[section] || [];
    $: total = allChecks.length;
    $: successCount = allChecks.filter(c => c.status === "success").length;
    $: failCount = allChecks.filter(c => c.status === "fail").length;
</script>

<div class="summary">
    <strong>Summary:</strong>
    <p>Total checks: {total}</p>
    <p>Success: {successCount}</p>
    <p>Failed: {failCount}</p>
</div>