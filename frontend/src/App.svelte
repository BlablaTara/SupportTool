<script>
import Section from "./components/sections/Section.svelte";
  import EmailCheck from "./components/sections/userChecks/EmailCheck.svelte";
  import Header from "./components/header/Header.svelte";
  import RolesCheck from "./components/sections/userChecks/RolesCheck.svelte";
  import CountCheck from "./components/sections/userChecks/CountCheck.svelte";
  
  import PingCheck from "./components/sections/systemChecks/PingCheck.svelte";
  import ServiceCheck from "./components/sections/systemChecks/ServiceCheck.svelte";
  import CollectionsCheck from "./components/sections/dbChecks/CollectionsCheck.svelte";

  let email = "";
</script>


<Header />

<div class="section-container">
    <Section title="User Validation" section="user">
        <EmailCheck on:validate={(e) => email = e.detail.email }/>
        <RolesCheck {email} />
        <CountCheck {email} />
    </Section>

    <Section title="DB Validation" section="db">
      <CollectionsCheck />
    </Section>

    <Section title="System Service Validation" section="system">
      <PingCheck />
      <ServiceCheck />
    </Section>
</div>

