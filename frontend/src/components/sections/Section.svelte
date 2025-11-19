<script>
  import '../../../public/css/section.css'
    export let title = "Section Title";
</script>

<section class="section">
    <h2 class="section-title">{title}</h2>

    <div class="section-content">
        <slot></slot>
    </div>

    <!-- <div class="section-summary">
    <Summary ... />
    </div> -->

</section>
