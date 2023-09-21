<script lang="ts">
  import { clickOutside } from "../clickOutside";
  export let show = false;
  export let key: string;
  export let data: string;

  function handleClickOutside() {
    show = false;
  }
</script>

{#if show}
  <div
    class="custom-modal"
    use:clickOutside
    on:click_outside={handleClickOutside}
  >
    <div class="container">
      {data}
    </div>
  </div>
{/if}

<style>
  .custom-modal {
    position: absolute;
    left: 50%;
    top: 50%;
    translate: -50% -50%;
    width: 600px;
    height: 600px;
    z-index: 10;
    border: 5px solid black;
    border-radius: 15px;
    background: white;
  }
  .container {
    position: relative;
    text-wrap: wrap;
  }
</style>
