<script>
    import '../../css/header.css'
    import Logo from "./Logo.svelte";
    import EnvBadge from "./EnvBadge.svelte";
    import DBBadge from "./DBBadge.svelte";
    import ShowCustomer from './ShowCustomer.svelte';
</script>

<header class="header">
    <Logo />
    <DBBadge />
    <ShowCustomer />
    <EnvBadge />
</header>