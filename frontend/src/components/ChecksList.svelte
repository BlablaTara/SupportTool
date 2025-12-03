<script>
    import { checks } from "../stores/checksStore.js";
    import ResultItem from "./ResultItem.svelte";
    import ResultItemWithTable from "./ResultItemWithTable.svelte";

    export let section;

    $: sectionChecks = $checks[section] || [];
</script>

{#each sectionChecks as check (check.id)}
    {#if check.title === "Service Check"}
        <ResultItemWithTable {...check} />
    {:else}
        <ResultItem {...check} />
    {/if}
{/each}