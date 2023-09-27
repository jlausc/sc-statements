<script lang="ts">
  import MasterPasswordInput from "../components/MasterPasswordInput.svelte";
  import WebsiteTool from "../components/WebsiteTool.svelte";
  import FileUpload from "../utils/FileUpload.svelte";
</script>

<div class="navbar bg-stone-100 mb-2">
  <div class="flex-none">
    <FileUpload />
  </div>
  <div class="flex-none">
    <MasterPasswordInput />
  </div>
  <div class="flex-none">
    <WebsiteTool />
  </div>
</div>
