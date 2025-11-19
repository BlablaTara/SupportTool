<script>
import Section from "./components/sections/Section.svelte";
  import EmailCheck from "./components/EmailCheck.svelte";
  import ResultItem from "./components/ResultItem.svelte";
  import { checks } from "./stores/checksStore.js";
  import Header from "./components/header/Header.svelte";

  let environment = "Loading...";
</script>


<Header />

<div class="section-container">
    <Section title="User Validation">
    <EmailCheck />
        {#if $checks}
        <ResultItem {...$checks} />
        {/if}
    </Section>

    <Section title="DB Validation">
    </Section>

    <Section title="BTP Service Validation">
    </Section>
</div>

