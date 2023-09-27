<script lang="ts">
  export let data: string;
</script>

<button
  on:click={(e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(data);
  }}
>
  {data}
</button>
