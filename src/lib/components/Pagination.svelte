<script lang="ts">
  import { cursor, output, pageSize, totalPages } from "../stores/FileData";
  import { state } from "../stores/UploadState";
  import { FileState } from "../utils/FileState";

  $: {
    $totalPages = Math.floor($output.length / $pageSize);
  }

  function goPrev() {
    if ($cursor - 1 < 0) {
      $cursor = $totalPages;
    } else {
      $cursor -= 1;
    }
  }

  function goNext() {
    if ($cursor == $totalPages) {
      $cursor = 0;
    } else {
      $cursor += 1;
    }
  }
</script>

{#if $state == FileState.waiting}
  <div />
{:else if $state == FileState.loaded}
  <div class="join flex justify-center px-5">
    <button class="join-item btn" on:click={goPrev}>«</button>
    <button class="join-item btn">{$cursor}</button>
    <button class="join-item btn" on:click={goNext}>»</button>
  </div>
{/if}
