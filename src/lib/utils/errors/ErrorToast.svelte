<script lang="ts">
  import { errorMessages, type ErrorData } from "../../stores/ErrorMessage";

  export let err: ErrorData;

  function toggleError(err: ErrorData) {
    err.show = false;
    errorMessages.update((cur) => cur);
  }
</script>

<div class="alert alert-error flex justify-end">
  <span>{err.msg}</span>
  <button
    class="btn btn-circle btn-outline btn-xs"
    on:click={(_e) => toggleError(err)}
  >
    <!-- SVG of an X -->
    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"
      ><path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M6 18L18 6M6 6l12 12"
      /></svg
    >
  </button>
</div>
