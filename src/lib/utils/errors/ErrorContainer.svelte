<script lang="ts">
  import { errorMessages } from "../../stores/ErrorMessage";
  import ErrorToast from "../errors/ErrorToast.svelte";
</script>

<div class="toast toast-top toast-end">
  {#each $errorMessages as err}
    {#if err.show}
      <ErrorToast {err} />
    {/if}
  {/each}
</div>
