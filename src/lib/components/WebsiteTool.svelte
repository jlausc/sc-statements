<script lang="ts" style="sass">
  import { onDecrypt, onEncrypt } from "../encryption/enc";
  import { masterPassword } from "../stores/MasterPassword";
  import Clipboard from "../utils/clipboard/Clipboard.svelte";

  let websiteInput: string = "";

  let checked = false;

  function decrypt() {
    if (!$masterPassword) {
      throw new Error("No master password was entered");
    }
    const res = onDecrypt(websiteInput, $masterPassword);
    websiteInput = res ? (res as string) : "error";
  }

  function encrypt() {
    if (!$masterPassword) {
      throw new Error("No master password was entered");
    }
    websiteInput = onEncrypt(websiteInput, $masterPassword);
  }

  function copy() {
    checked = true;
    setTimeout(() => {
      if (checked) {
        checked = false;
      }
    }, 3000);

    navigator.clipboard.writeText(websiteInput);
  }
</script>

<div class="form-control w-full min-w-xs flex-row">
  <label class="label min-w-fit">
    <span class="label-text px-5">Website Password</span>
  </label>
  <div class="rounded-lg border-2">
    <input
      type="text"
      placeholder="Enter text"
      size="40"
      class="px-5 w-5/6 h-full max-w-xs rounded-lg"
      bind:value={websiteInput}
    />
    <button class="btn w-1/6 float-right" on:click={copy}>
      <Clipboard bind:checked />
    </button>
  </div>
  <button class="btn mx-2" on:click={decrypt}>Decrypt</button>
  <!-- <button class="btn mx-2" on:click={encrypt}>Encrypt</button> -->
</div>
