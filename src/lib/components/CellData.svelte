<script lang="ts">
  import Tooltip from "../utils/Tooltip.svelte";
  import Modal from "../utils/modal/Modal.svelte";
  export let data: string;
  export let key: string;
  export let row: any = undefined;

  let waiting = false;
  let timeout: number = 0;
  let delay = 300;
  const defaultTooltip = "Click to copy. Double click to expand";

  let tooltip = defaultTooltip;
  let showModal = false;

  function handleClickType() {
    if (waiting) {
      clearTimeout(timeout);
      openModal();
      waiting = false;
      return;
    }
    waiting = true;
    timeout = setTimeout(() => {
      copyClipboard();
      waiting = false;
    }, delay);
  }

  function copyClipboard() {
    navigator.clipboard.writeText(data);
    tooltip = "Copied!";
    setTimeout(() => {
      tooltip = defaultTooltip;
    }, 2000);
  }
  function openModal() {
    showModal = true;
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="cell" on:click={handleClickType}>
  <Tooltip title={tooltip}>
    <div class="data">
      <button>
        {data}
      </button>
    </div>
  </Tooltip>

  <Modal bind:show={showModal} {data} {key} {row} />
</div>

<style>
  .cell {
    text-align: center;
    width: var(--cell-width);
    height: var(--cell-height);
    min-width: var(--cell-width);
    min-height: var(--cell-height);
    max-width: var(--cell-width);
    max-height: var(--cell-height);
    border: 1px solid black;
    overflow: hidden;
  }

  .data {
    height: 100%;
    width: 100%;
  }
</style>
