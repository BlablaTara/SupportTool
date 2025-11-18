<script>
    import { checks } from "../stores/checksStore.js";
    import ResultItem from "./ResultItem.svelte";
</script>

<h2>Results</h2>

{#each $checks as check}
    <ResultItem {...check} />
{/each}