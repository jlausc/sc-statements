<script lang="ts">
  import {
    cursor,
    filter,
    headers,
    output,
    pageSize,
  } from "../stores/FileData";
  import AutoClipboard from "../utils/clipboard/AutoClipboard.svelte";
  import Clipboard from "../utils/clipboard/Clipboard.svelte";
  import Modal from "../utils/modal/Modal.svelte";
  import CellData from "./CellData.svelte";

  const unwantedHeaders = [
    "BankABA",
    // "BankAccount",
    "wdmax",
    "ACHType",
    "maxamount",
    "minamount",
    "savings_formula",
    "wdcount",
    "csvscript",
    "wireaccount",
    "wireaba",
    "wireinstructions2",
    "wireinstructions3",
    "wireinstructions4",
    "wireinstructions",
    "program",
    "IsMoneyCenter",
    "Entity",
    "ThirdPartyFee",
    "IntuitTier",
    "IntuitWorking",
    "insuranceType",
    "item",
    "max_savings_rate",
    "macro",
    "RecFile",
    "vard1",
    "vard2",
    "var1",
    "recerror",
    "lastdownload",
    "ofxmacro",
    // "vars", // sec pws

    "Approved",
    "Active",
    "lastdateactive",
  ];
</script>

<div class="container">
  <div class="header">
    <div class="row">
      {#if $headers.length}
        {#each $headers as header}
          {#if !unwantedHeaders.includes(header)}
            <button
              class="cell-header"
              on:click={() => {
                navigator.clipboard.writeText(header);
              }}>{header}</button
            >
          {/if}
        {/each}
      {/if}
    </div>
  </div>
  <div class="body">
    {#if $output.length}
      {#each $output.slice($cursor * $pageSize, $cursor * $pageSize + $pageSize) as row}
        {#if $filter}
          {#if $filter == row["FDICCert"]}
            <div class="row">
              {#each Object.keys(row) as key}
                {#if !unwantedHeaders.includes(key)}
                  <CellData data={row[key]} {key} />
                {/if}
              {/each}
            </div>
          {/if}
        {:else if !$filter}
          <div class="row">
            {#each Object.keys(row) as key}
              {#if !unwantedHeaders.includes(key)}
                <CellData data={row[key]} {key} />
              {/if}
            {/each}
          </div>
        {/if}
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
    --cell-width: 140px;
    --cell-height: 60px;
    --header-width: 140px;
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
