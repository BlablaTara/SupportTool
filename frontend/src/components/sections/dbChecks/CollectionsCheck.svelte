<script>
    import { addCheck } from "../../../stores/checksStore.js";

    export let loading = false;

    $: if (loading) {
        runCollectionsCheck();
    }

    async function runCollectionsCheck() {
        try {
            const res = await fetch("http://localhost")
        }
        
    }
</script>