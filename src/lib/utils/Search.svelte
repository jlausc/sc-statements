<script lang="ts">
  import { FileState } from "./FileState";
  import { filter } from "../stores/FileData";
  import { state } from "../stores/UploadState";

  let searchInput: string;
  function clearFilter() {
    $filter = "";
    searchInput = "";
  }
  function setFilter() {
    $filter = searchInput;
  }
  function handleKey(e: KeyboardEvent) {
    if (e.key == "Enter") {
      setFilter();
    }
  }
</script>

{#if $state == FileState.waiting}
  <div />
{:else if $state == FileState.loaded}
  <div class="place-self-center flex px-5">
    <input
      type="text"
      placeholder="Enter Cert or Bank Acct #"
      class="input input-bordered w-full max-w-s mx-3"
      on:keydown={handleKey}
      bind:value={searchInput}
    />
    <button class="btn mx-2" on:click={setFilter}>Search</button>
    <button class="btn" on:click={clearFilter}>Clear</button>
  </div>
{/if}
