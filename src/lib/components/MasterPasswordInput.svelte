<script lang="ts">
  import { masterPassword } from "../stores/MasterPassword";
</script>

<div class="form-control w-full min-w-xs flex-row">
  <label class="label">
    <span class="label-text px-5">Master Password</span>
  </label>
  <input
    type="text"
    placeholder="Enter here"
    class="input input-bordered w-full max-w-xs"
    bind:value={$masterPassword}
  />
</div>
