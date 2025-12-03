<script>
    import { checks } from "../../stores/checksStore.js";

    export let section;

    // getting all checks for the section
    $: allChecks = $checks[section] || [];
    $: total = allChecks.length;
    $: successCount = allChecks.filter(c => c.status === "success").length;
    $: failCount = allChecks.filter(c => c.status === "fail").length;

</script>

<div class="summary-container">
    <strong>Summary:</strong>
    <p>{successCount} passed, {failCount} failed out of {total} total checks</p>
</div>