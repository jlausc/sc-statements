<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import Content from "./lib/body/Content.svelte";
  import BottomNav from "./lib/footer/BottomNav.svelte";
  import Navbar from "./lib/header/Navbar.svelte";
  import { handleError } from "./lib/utils/errors/handleError";

  onMount(() => {
    window.addEventListener("error", handleError, true);
    throw new Error("TEST");
  });

  onDestroy(() => {
    window.removeEventListener("error", handleError);
  });
</script>

<main>
  <Navbar />
  <Content />
  <BottomNav />
</main>

<style>
  P {
    min-width: 35px;
    min-height: 35px;
  }
</style>
