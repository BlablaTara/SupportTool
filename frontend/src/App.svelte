<script>
import Section from "./components/sections/Section.svelte";
  import EmailCheck from "./components/EmailCheck.svelte";
  import Header from "./components/header/Header.svelte";
</script>


<Header />

<div class="section-container">
    <Section title="User Validation" section="user">
        <EmailCheck />
    </Section>

    <Section title="DB Validation" section="db">
    </Section>

    <Section title="BTP Service Validation" section="btp">
    </Section>
</div>

