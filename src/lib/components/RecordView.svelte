<script lang="ts">
  import { records } from "../stores/Records";
  import CellData from "./CellData.svelte";
  const headers = [
    "fdicCert",
    "bankAccount",
    "stmtDate",
    "intPaidDate",
    "balance",
    "interestPaid",
    "apy",
    "user",
    "updated",
    "dateAdj",
    "FromMe",
  ];

  let dlEl: HTMLAnchorElement;

  function exportCsv(records: string[][]) {
    let csvContent = "data:text/csv;charset=utf-8,";
    records.forEach((rowArray) => {
      let val = "(";
      rowArray.forEach((r, i) => {
        val += "'" + r + "'";
        if (i != rowArray.length - 1) {
          val += ",";
        } else {
          val += ")" + "\r\n";
        }
        console.log("val", val);
      });
      csvContent += val;
    });
    var encodedUri = encodeURI(csvContent);
    dlEl.setAttribute("href", encodedUri);
    dlEl.setAttribute("download", "upload.csv");
  }

  function downloadCsv() {
    dlEl.click();
    records.reset();
  }

  $: {
    if (dlEl) {
      exportCsv($records);
    }
    localStorage.records = JSON.stringify($records);
  }
</script>

<div>
  <div
    class="border-solid border-2 border-black-600 min-w-full w-full mx-4 rounded-lg capitalize"
  >
    <div class="row-header flex">
      {#each headers as header}
        <div class="cell">
          <CellData data={header} key={header} />
        </div>
      {/each}
      <button on:click={downloadCsv}>
        <a bind:this={dlEl} />

        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            opacity="0.4"
            d="M20.5 10.19H17.61C15.24 10.19 13.31 8.26 13.31 5.89V3C13.31 2.45 12.86 2 12.31 2H8.07C4.99 2 2.5 4 2.5 7.57V16.43C2.5 20 4.99 22 8.07 22H15.93C19.01 22 21.5 20 21.5 16.43V11.19C21.5 10.64 21.05 10.19 20.5 10.19Z"
            fill="#292D32"
          />
          <path
            d="M15.7999 2.20999C15.3899 1.79999 14.6799 2.07999 14.6799 2.64999V6.13999C14.6799 7.59999 15.9199 8.80999 17.4299 8.80999C18.3799 8.81999 19.6999 8.81999 20.8299 8.81999C21.3999 8.81999 21.6999 8.14999 21.2999 7.74999C19.8599 6.29999 17.2799 3.68999 15.7999 2.20999Z"
            fill="#292D32"
          />
          <path
            d="M12.2799 14.72C11.9899 14.43 11.5099 14.43 11.2199 14.72L10.4999 15.44V11.25C10.4999 10.84 10.1599 10.5 9.74994 10.5C9.33994 10.5 8.99994 10.84 8.99994 11.25V15.44L8.27994 14.72C7.98994 14.43 7.50994 14.43 7.21994 14.72C6.92994 15.01 6.92994 15.49 7.21994 15.78L9.21994 17.78C9.22994 17.79 9.23994 17.79 9.23994 17.8C9.29994 17.86 9.37994 17.91 9.45994 17.95C9.55994 17.98 9.64994 18 9.74994 18C9.84994 18 9.93994 17.98 10.0299 17.94C10.1199 17.9 10.1999 17.85 10.2799 17.78L12.2799 15.78C12.5699 15.49 12.5699 15.01 12.2799 14.72Z"
            fill="#292D32"
          />
        </svg>
      </button>
    </div>
    {#if $records.length}
      {#each $records as record, idx}
        <div class="flex">
          <div class="flex row">
            <div class="w-11/12 flex">
              {#each record as cell}
                <div class="cell">
                  <CellData data={cell} key={headers[idx]} />
                </div>
              {/each}
            </div>
          </div>
          <button
            class="w-1/12 content-center flex"
            on:click={() => records.removeIndex(idx)}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.97 1H3.03C1.76 1 1 1.76 1 3.03V5.97C1 7.24 1.76 8 3.03 8H5.97C7.24 8 8 7.24 8 5.97V3.03C8 1.76 7.24 1 5.97 1ZM6.47 5.56C6.72 5.81 6.72 6.22 6.47 6.47C6.34 6.59 6.17 6.65 6.01 6.65C5.85 6.65 5.69 6.59 5.56 6.47L4.49 5.41L3.45 6.47C3.32 6.59 3.16 6.65 2.98 6.65C2.82 6.65 2.66 6.59 2.53 6.47C2.28 6.22 2.28 5.81 2.53 5.56L3.6 4.5L2.54 3.45C2.29 3.2 2.29 2.79 2.54 2.54C2.79 2.29 3.2 2.29 3.45 2.54L4.49 3.6L5.55 2.54C5.8 2.29 6.21 2.29 6.46 2.54C6.71 2.79 6.71 3.2 6.46 3.45L5.41 4.5L6.47 5.56Z"
                fill="#292D32"
              />
              <path
                opacity="0.4"
                d="M16.63 2H7.78C7.92 2.29 8 2.63 8 3.03V5.97C8 7.24 7.24 8 5.97 8H3.03C2.84 8 2.67 7.98 2.5 7.94V17.13C2.5 19.82 4.68 22 7.37 22H15.34C15.51 22 15.68 21.94 15.81 21.8C17.29 20.31 19.87 17.71 21.32 16.25C21.45 16.12 21.5 15.97 21.5 15.82V6.87C21.5 4.18 19.32 2 16.63 2Z"
                fill="#292D32"
              />
              <path
                d="M21.4999 15.82C21.4999 15.97 21.4499 16.12 21.3199 16.25C19.8699 17.71 17.2899 20.31 15.8099 21.8C15.6799 21.94 15.5099 22 15.3399 22C15.0099 22 14.6899 21.74 14.6899 21.36V17.86C14.6899 16.4 15.9299 15.19 17.4499 15.19C18.3999 15.18 19.7199 15.18 20.8499 15.18C21.2399 15.18 21.4999 15.49 21.4999 15.82Z"
                fill="#292D32"
              />
              <path
                d="M14.7801 12.71H7.36011C6.94011 12.71 6.61011 12.37 6.61011 11.96C6.61011 11.55 6.95011 11.21 7.36011 11.21H14.7801C15.2001 11.21 15.5301 11.55 15.5301 11.96C15.5301 12.37 15.2001 12.71 14.7801 12.71Z"
                fill="#292D32"
              />
              <path
                d="M12.0001 16.42H7.36011C6.94011 16.42 6.61011 16.08 6.61011 15.67C6.61011 15.25 6.95011 14.92 7.36011 14.92H12.0001C12.4201 14.92 12.7501 15.26 12.7501 15.67C12.7501 16.08 12.4201 16.42 12.0001 16.42Z"
                fill="#292D32"
              />
            </svg>
          </button>
        </div>
      {/each}
    {/if}
  </div>
</div>

<style>
  .row-header {
    background: yellow;
    font-weight: bold;
  }
  .row {
  }
  .cell {
    font-size: small;
    --cell-width: 75px;
    --cell-height: 30px;
    --header-width: 40px;
    --header-height: 30px;
  }
</style>
