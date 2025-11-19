<script>
    import '../../public/css/resultItem.css'
    export let title;
    export let status;
    export let message;
    export let detail;
</script>

<div class="result-item {status}">
    <h3>{title}</h3>
    <p>{message}</p>
    <small>Collection: {detail}</small>
</div>
