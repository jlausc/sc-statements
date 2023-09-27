<script lang="ts">
  import { onMount } from "svelte";
  import {
    cursor,
    filter,
    headers,
    output,
    pageSize,
  } from "../stores/FileData";
  import { parseCustomHeader } from "../utils/unwantedHeaders";

  import CellData from "./CellData.svelte";
</script>

<div class="container">
  <div class="header">
    <div class="row">
      {#if $headers.length}
        {#each $headers as header}
          {#if parseCustomHeader(header, $output[0])}
            <button
              class="cell-header"
              on:click={() => {
                navigator.clipboard.writeText(header);
              }}>{parseCustomHeader(header, $output[0])}</button
            >
          {/if}
        {/each}
      {/if}
    </div>
  </div>
  <div class="body">
    {#if $output.length}
      {#each $filter ? $output.filter((v) => {
            console.log(v);
            return v["FDICCert"].includes($filter) || v["BankAccount"].includes($filter);
          }) : $output.slice($cursor * $pageSize, $cursor * $pageSize + $pageSize) as row}
        <div class="row">
          {#each $headers as key}
            {#if !key.includes("vard")}
              <CellData data={row[key]} {key} {row} />
            {/if}
          {/each}
        </div>
      {/each}
    {/if}
  </div>
</div>

<style>
  .container {
    margin-inline: auto;
    width: min(1500px, 100% - 3rem);
    border: 1px solid grey;
    display: block;
    overflow: scroll;
    --cell-width: 180px;
    --cell-height: 60px;
    --header-width: 180px;
    --header-height: 30px;
  }

  .row {
    display: flex;
    flex-direction: row;
  }
  .cell-header {
    min-width: var(--header-width);
    min-height: var(--header-height);
    max-width: var(--header-width);
    max-height: var(--header-height);
    border: 1px solid black;
    background: yellow;
    font-weight: bold;
    text-align: center;
    position: sticky;
  }
</style>
