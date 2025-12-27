<script>
  import { onMount } from "svelte";
  import Section from "./components/sections/Section.svelte";
  import EmailCheck from "./components/sections/userChecks/EmailCheck.svelte";
  import Header from "./components/header/Header.svelte";
  import RolesCheck from "./components/sections/userChecks/RolesCheck.svelte";
  import CountCheck from "./components/sections/userChecks/CountCheck.svelte";

  import CollectionsCheck from "./components/sections/dbChecks/CollectionsCheck.svelte";
  import MetricsCheck from "./components/sections/dbChecks/MetricsCheck.svelte";
  
  import PingCheck from "./components/sections/systemChecks/PingCheck.svelte";
  import ServiceCheck from "./components/sections/systemChecks/ServiceCheck.svelte";
  import DropdownCheck from "./components/sections/userChecks/DropdownCheck.svelte";

  let enabledChecks = {};
  let email = "";

  onMount(async () => {
    const res = await fetch("/api/config/checks");
    enabledChecks = await res.json();
  });
</script>

<Header />

<div class="section-container">
    <Section title="User Validation" section="user">
        <EmailCheck on:validate={(e) => email = e.detail.email }/>
        {#if enabledChecks.roles === true}
          <RolesCheck {email} />
        {/if}
        {#if enabledChecks.count === true}
          <CountCheck {email} />
        {/if}
        {#if enabledChecks.dropdown === true}
          <DropdownCheck {email}/>
        {/if}
    </Section>

    <Section title="DB Validation" section="db">
      {#if enabledChecks.collections === true}
        <CollectionsCheck />
      {/if}
      {#if enabledChecks.metrics === true}
        <MetricsCheck />
      {/if}
    </Section>

    <Section title="System Service Validation" section="system">
      {#if enabledChecks.ping === true}
        <PingCheck />
      {/if}
      {#if enabledChecks.service === true}
        <ServiceCheck />
      {/if}
    </Section>

</div>

