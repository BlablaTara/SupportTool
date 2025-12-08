<script>
    import "../css/resultItem.css";

    export let title;
    export let status;
    export let message;
    export let items = [];

    let open = false;

    function toggle() {
        open = !open;
    }

    function format(value) {
        if (typeof value === "object") {
            return JSON.stringify(value, null, 2);
        }
        return value;
    }

</script>

<div class="result-item {status}">
    <div class="result-header">
        <h4>{title}</h4>

        {#if items && items.length > 0}
            <button class="toggle-btn" on:click={toggle} type="button" aria-expanded={open}>
                <span class="msg">{message}</span>

                <svg class="chevron {open ? 'rotated' : ''}" viewBox="0 0 24 24">
                    <path d="M6 9l6 6 6-6" />
                </svg>
            </button>
        {:else}
            <p>{message}</p>
        {/if}
    </div>

</div>

{#if open && items && items.length > 0}
    <div class="dropdown-content">
        {#each items as item (item.id)}
            <div class="dropdown-item-wrapper result-item {status}">
                <div class="result-header small"></div>
                <pre>{format(item.value)}</pre>
            </div>
        {/each}
    </div>
{/if}