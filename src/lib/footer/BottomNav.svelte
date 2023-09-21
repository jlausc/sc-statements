<script lang="ts">
  import { tabs, TabNames } from "../stores/Tab";

  function navBankInfo() {
    $tabs = TabNames.bankInfo;
  }

  function navInput() {
    $tabs = TabNames.input;
  }
</script>

<div class="btm-nav">
  <button
    class={$tabs == TabNames.bankInfo ? "active" : ""}
    on:click={navBankInfo}
  >
    <div>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 22.78C11.31 22.78 10.66 22.43 10.2 21.82L8.70001 19.82C8.67001 19.78 8.54999 19.72 8.48999 19.72H8C3.83 19.72 1.25 18.59 1.25 12.97V7.96997C1.25 3.54997 3.58 1.21997 8 1.21997H16C20.42 1.21997 22.75 3.54997 22.75 7.96997V12.97C22.75 13.38 22.41 13.72 22 13.72C21.59 13.72 21.25 13.38 21.25 12.97V7.96997C21.25 4.38997 19.58 2.71997 16 2.71997H8C4.42 2.71997 2.75 4.38997 2.75 7.96997V12.97C2.75 17.49 4.3 18.22 8 18.22H8.5C9.01 18.22 9.59999 18.51 9.89999 18.92L11.4 20.92C11.75 21.38 12.25 21.38 12.6 20.92C12.85 20.59 13.32 20.52 13.65 20.77C13.98 21.02 14.05 21.49 13.8 21.82C13.34 22.43 12.69 22.78 12 22.78Z"
          fill="#292D32"
        />
        <path
          d="M12 11.97C11.44 11.97 11 11.52 11 10.97C11 10.42 11.45 9.96997 12 9.96997C12.55 9.96997 13 10.42 13 10.97C13 11.52 12.56 11.97 12 11.97Z"
          fill="#292D32"
        />
        <path
          d="M16 11.97C15.44 11.97 15 11.52 15 10.97C15 10.42 15.45 9.96997 16 9.96997C16.55 9.96997 17 10.42 17 10.97C17 11.52 16.56 11.97 16 11.97Z"
          fill="#292D32"
        />
        <path
          d="M8 11.97C7.44 11.97 7 11.52 7 10.97C7 10.42 7.45 9.96997 8 9.96997C8.55 9.96997 9 10.42 9 10.97C9 11.52 8.56 11.97 8 11.97Z"
          fill="#292D32"
        />
        <path
          d="M18.2 22.15C16.02 22.15 14.25 20.38 14.25 18.2C14.25 16.02 16.02 14.25 18.2 14.25C20.38 14.25 22.15 16.02 22.15 18.2C22.15 20.38 20.38 22.15 18.2 22.15ZM18.2 15.75C16.85 15.75 15.75 16.85 15.75 18.2C15.75 19.55 16.85 20.65 18.2 20.65C19.55 20.65 20.65 19.55 20.65 18.2C20.65 16.85 19.55 15.75 18.2 15.75Z"
          fill="#292D32"
        />
        <path
          d="M21.9999 22.75C21.8099 22.75 21.6199 22.68 21.4699 22.53L20.4699 21.53C20.1799 21.24 20.1799 20.76 20.4699 20.47C20.7599 20.18 21.2399 20.18 21.5299 20.47L22.5299 21.47C22.8199 21.76 22.8199 22.24 22.5299 22.53C22.3799 22.68 22.1899 22.75 21.9999 22.75Z"
          fill="#292D32"
        />
      </svg>
    </div>

    <span class="btm-nav-label">Bank Info</span>
  </button>
  <button class={$tabs == TabNames.input ? "active" : ""} on:click={navInput}>
    <div>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16 2H8C4 2 2 4 2 8V21C2 21.55 2.45 22 3 22H16C20 22 22 20 22 16V8C22 4 20 2 16 2Z"
          stroke="#292D32"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M12.91 7.84L7.72004 13.03C7.52004 13.23 7.33004 13.62 7.29004 13.9L7.01004 15.88C6.91004 16.6 7.41004 17.1 8.13004 17L10.11 16.72C10.39 16.68 10.78 16.49 10.98 16.29L16.17 11.1C17.06 10.21 17.49 9.17 16.17 7.85C14.85 6.52 13.81 6.94 12.91 7.84Z"
          stroke="#292D32"
          stroke-width="1.5"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M12.1699 8.58C12.6099 10.15 13.8399 11.39 15.4199 11.83"
          stroke="#292D32"
          stroke-width="1.5"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>

    <span class="btm-nav-label">Input</span>
  </button>
  <!-- <button>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      ><path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      /></svg
    >
    <span class="btm-nav-label">Statistics</span>
  </button> -->
</div>
