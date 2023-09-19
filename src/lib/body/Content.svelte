<script lang="ts">
  import { onDecrypt, onEncrypt } from "../encryption/enc";
  import { masterPassword } from "../stores/MasterPassword";
  import ErrorContainer from "../utils/errors/ErrorContainer.svelte";
  let websiteInput: string = "";
  let encryptedText = "waiting";
  let result: string | any[] = "waiting";

  function decrypt() {
    const res = onDecrypt(websiteInput, $masterPassword);
    result = res ? res : "error";
  }

  function encrypt() {
    encryptedText = onEncrypt(websiteInput, $masterPassword);
  }
</script>

<ErrorContainer />

<div class="form-control w-full min-w-xs flex-row">
  <label class="label">
    <span class="label-text px-5">Website Password</span>
  </label>
  <input
    type="text"
    placeholder="Enter text"
    size="40"
    class="input input-bordered w-s max-w-xs"
    bind:value={websiteInput}
  />
  <button class="btn mx-5" on:click={decrypt}>Decrypt</button>
  <button class="btn mx-5" on:click={encrypt}>Encrypt</button>
</div>
<p>{websiteInput}</p>
<p>{encryptedText}</p>
<p>{result}</p>
