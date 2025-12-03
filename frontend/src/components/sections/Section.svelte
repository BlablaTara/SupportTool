<script>
  import '../../css/section.css'
  import ChecksList from '../ChecksList.svelte';
  import Summary from './Summary.svelte';

    export let title = "Section Title";
    export let section; // user, db, system

</script>

<section class="section">
    <h2 class="section-title">{title}</h2>

    <div class="section-content">
        <slot></slot>

        <div class="section-summary">
          <Summary section={section} />
        </div>

        <ChecksList {section}/>
    </div>

</section>
