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

    {#if open && items && items.length > 0}
        <div class="dropdown-content">
            {#each items as item (item.id)}
                <div class="dropdown-item">
                    <p><strong>{item.field}</strong></p>
                    <p>Status: {item.status}</p>
                    <p>{item.message}</p>

                    {#if item.values && item.values.length > 0}
                        <ul>
                            {#each item.values as val}
                                <li>{val}</li> 
                            {/each}
                        </ul>
                    {/if}
                </div>
            {/each}
        </div>
    {/if}
</div>