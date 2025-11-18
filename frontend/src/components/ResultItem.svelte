<script>
    export let title;
    export let status;
    export let message;
    export let collection;
</script>

<div class="result-item {status}">
    <h3>{title}</h3>
    <p>{message}</p>
    <small>Collection: {collection}</small>
</div>

<style>
.result-item {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
}

.result-item.success {
  background: #e0ffe0;
  border-color: #6abe6a;
}

.result-item.fail {
  background: #ffe0e0;
  border-color: #d96c6c;
}
</style>