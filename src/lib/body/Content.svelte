<script lang="ts">
  import BankDashboard from "../components/BankDashboard.svelte";
  import InputDashboard from "../components/InputDashboard.svelte";
  import { TabNames, tabs } from "../stores/Tab";
  import ErrorContainer from "../utils/errors/ErrorContainer.svelte";
</script>

<ErrorContainer />

{#if $tabs == TabNames.bankInfo}
  <BankDashboard />
{:else if $tabs == TabNames.input}
  <InputDashboard />
{/if}
