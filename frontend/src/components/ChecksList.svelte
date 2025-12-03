<script>
    import { checks } from "../stores/checksStore.js";
    import ResultItem from "./ResultItem.svelte";

    $: all = [
        ...$checks.user,
        ...$checks.db,
        ...$checks.system
    ];
</script>

<h2>Results</h2>

{#each all as check}
    <ResultItem {...check} />
{/each}