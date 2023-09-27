<script lang="ts">
  import { clickOutside } from "../clickOutside";
  import BankDetailModal from "./BankDetailModal.svelte";
  export let show = false;
  export let key: string;
  export let data: string;

  export let row: any;

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
    <div>
      {#if row}
        <BankDetailModal bankDetail={row} />
      {:else}
        {data}
      {/if}
    </div>
  </div>
{/if}

<style>
  .custom-modal {
    position: absolute;
    left: 50%;
    top: 50%;
    translate: -50% -45%;
    width: min(800px, 80vh);
    height: min(850px, 80vh);
    z-index: 10;
    border: 5px solid black;
    border-radius: 15px;
    background: white;
    overflow: auto;
  }
</style>
