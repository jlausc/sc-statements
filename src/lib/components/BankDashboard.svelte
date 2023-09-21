<script lang="ts">
  import { FileState } from "../utils/FileState";
  import FileUpload from "../utils/FileUpload.svelte";
  import BankTable from "./BankTable.svelte";
  import { cursor, headers, output, pageSize } from "../stores/FileData";
  import Search from "../utils/Search.svelte";
  import Pagination from "./Pagination.svelte";

  let state =
    $headers.length && $output.length ? FileState.loaded : FileState.waiting;

  $: {
    console.log(
      "sliced",
      $output.slice($cursor * $pageSize, $cursor * $pageSize + $pageSize)
    );
  }
</script>

<div class="flex flex-row justify-center p-3">
  <Search bind:state />
  <FileUpload bind:state />
  <Pagination bind:state />
</div>

{#if state == FileState.waiting}
  <div class="alert my-5">
    <svg fill="none" viewBox="0 0 24 24" class="stroke-info shrink-0 w-6 h-6"
      ><path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      /></svg
    >
    <span>Upload an export of bank accounts to start</span>
  </div>
{:else if state == FileState.loading}
  <div class="flex items-center justify-center">
    <span class="font-bold">Loading...</span>
  </div>
{:else if state == FileState.loaded}
  <div class="w-full h-full">
    <BankTable />
  </div>
{/if}
