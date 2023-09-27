<script lang="ts">
  import CellData from "../../components/CellData.svelte";
  import { output, headers } from "../../stores/FileData";
  import ClipButton from "../clipboard/ClipButton.svelte";
  import { parseCustomHeader, unwantedHeaders } from "../unwantedHeaders";

  export let bankDetail: BankDetail;

  function parseVars(vars: string) {
    let result: any = {};
    let t1 = false;
    let storeDesc = false;
    let num = "";
    let desc = "";
    let text = "";
    let storeText = false;

    for (let i = 0; i < vars.length; i++) {
      const l = vars[i];
      if (l == "<") {
        t1 = true;
        storeDesc = false;
        storeText = false;
        if (desc) {
          result[num] = { ...result[num], desc: desc };
        }
        if (text && text != desc) {
          result[num] = { ...result[num], text: text };
        }
        desc = "";
        text = "";
        num = "";
      }
      if (!t1 && storeDesc) {
        desc += l;
      }
      if (storeText) {
        text += l;
      }
      if (l == ">") {
        t1 = false;
        storeText = true;
        // if (num.length == 1) {
        //   num = "0" + num;
        // }

        if (!result[num]) {
          result[num] = { desc: "", text: "" };
        }
      }
      if (t1) {
        if (l == "r") {
          if (vars[i + 1] == "d") {
            // if tagged with d, store a desc
            storeDesc = true;
            desc = "";
          }
        }
        if (!isNaN(Number(l))) {
          num += String(l);
        }
      }
    }

    return result;
  }

  let additionalVars: any = {};

  $: {
    additionalVars = parseVars(bankDetail["vars"]);
  }
</script>

<div class="overflow-auto flex h-1/2">
  <div class="row-header">
    {#if $headers.length}
      {#each $headers as header}
        {#if parseCustomHeader(header, $output[0]) && !header.includes("vars")}
          <button
            class="cell-header cell header"
            on:click={() => {
              navigator.clipboard.writeText(header);
            }}>{parseCustomHeader(header, $output[0])}</button
          >
        {/if}
      {/each}
    {/if}
  </div>
  <div class="row-data">
    {#each $headers as key}
      {#if !key.includes("vard") && !key.includes("vars")}
        <div class="cell">
          <ClipButton data={bankDetail[key]} />
        </div>
      {/if}
    {/each}
  </div>
</div>
<div class="vars-container h-1/2">
  {#each Object.keys(additionalVars) as key}
    <div class="flex w-full">
      <div class=" cell header desc">
        <ClipButton
          data={additionalVars[key].desc ? additionalVars[key].desc : "N/A"}
        />
      </div>
      <div class="w-5/6">
        <ClipButton data={additionalVars[key].text} />
      </div>
    </div>
  {/each}
</div>

<style>
  .row-header {
    display: flex;
    flex-direction: column;
    width: 22%;
  }
  .row-data {
    width: 100%;
  }

  .desc {
    width: 18%;
  }

  .header {
    background: yellow;
  }

  .cell {
    height: 30px;
    max-height: 30px;
  }
</style>
