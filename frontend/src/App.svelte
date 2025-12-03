<script>
import Section from "./components/sections/Section.svelte";
  import EmailCheck from "./components/EmailCheck.svelte";
  import Header from "./components/header/Header.svelte";
  import RolesCheck from "./components/RolesCheck.svelte";
  import CountCheck from "./components/CountCheck.svelte";
  
  import PingCheck from "./components/PingCheck.svelte";

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
      <PingCheck />
    </Section>

    <Section title="System Service Validation" section="system">
    </Section>
</div>

