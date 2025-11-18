<script>
  import EmailCheck from "./components/EmailCheck.svelte";
  import ResultItem from "./components/ResultItem.svelte";
  import { checks } from "./stores/checksStore.js";
</script>

<h1>Support Tool</h1>

<EmailCheck />

{#if $checks}
    <ResultItem {...$checks} />
{/if}