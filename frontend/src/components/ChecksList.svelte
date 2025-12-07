<script>
    import { checks } from "../stores/checksStore.js";
    import ResultItem from "./ResultItem.svelte";
    import ResultItemWithTable from "./ResultItemWithTable.svelte";
    import ResultItemWithDropdown from "./ResultItemWithDropdown.svelte";

    export let section;

    $: sectionChecks = $checks[section] || [];

    function pickComponentType(check) {
        if (check.renderType === "table") return ResultItemWithTable;
        if (check.renderType === "dropdown") return ResultItemWithDropdown;
        return ResultItem;
    }
</script>

{#each sectionChecks as check (check.id)}
    <svelte:component this={pickComponentType(check)} {...check} />
{/each}