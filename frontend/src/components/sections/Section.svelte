<script>
  import '../../css/section.css'
  import { checks } from '../../stores/checksStore.js';
  import ResultItem from '../ResultItem.svelte';
  import Summary from './Summary.svelte';

    export let title = "Section Title";
    export let section; // user, db, btp
</script>

<section class="section">
    <h2 class="section-title">{title}</h2>

    <div class="section-content">
        <slot></slot>

        <div class="section-summary">
          <Summary section={section} />
        </div>

        {#each $checks[section] as check}
          <ResultItem {...check} />
        {/each}  
    </div>

</section>
