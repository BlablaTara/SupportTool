<script>
    import { checks, loadingChecks } from "../stores/checksStore.js";
    import ResultItem from "./ResultItem.svelte";
    import ResultItemWithTable from "./ResultItemWithTable.svelte";
    import ResultItemWithDropdown from "./ResultItemWithDropdown.svelte";
    import MetricsResults from "./MetricsResults.svelte";

    export let section;

    $: sectionChecks = $checks[section] || [];
    $: sectionLoading = $loadingChecks[section];

    function pickComponentType(check) {
        if (check.renderType === "table") return ResultItemWithTable;
        if (check.renderType === "dropdown") return ResultItemWithDropdown;
        if (check.renderType === "metrics") return MetricsResults;
        return ResultItem;
    }

</script>

{#if sectionLoading}
    <p>Running checks...</p>
{/if}

{#each sectionChecks as check (check.id)}
    <svelte:component this={pickComponentType(check)} {...check} />
{/each}