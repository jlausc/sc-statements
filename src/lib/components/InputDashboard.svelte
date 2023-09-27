<script lang="ts">
  import { output } from "../stores/FileData";
  import { records } from "../stores/Records";
  import { constraints, type Constraints } from "../utils/constraints/regex";
  import RecordView from "./RecordView.svelte";
  const users = ["script", "kdawa", "vagnello", "jnieves", "dsamuel"];

  let bankAccountList: string[] = [""];

  let fdicCert: string = "";
  let bankAccount: string;
  let statementDate: string = "";
  let interestPaidDate: string = "";
  let balance: string;
  let interestPaid: string;
  let apy: string = "-1.00000";
  let selectedUser: string;
  const dateObj = new Date();
  let day = dateObj.getDate().toString();
  let month = String(dateObj.getMonth() + 1);
  month = month.length < 2 ? "0" + month : month;
  let year = dateObj.getFullYear().toString();
  const updatedAt = year + "-" + month + "-" + day;
  let dateAdjFactor: string = "0";
  const daysFromMe = "0";

  function lookupBankAccount(cert: string) {
    bankAccountList = [""];
    let match = false;

    $output.forEach((data) => {
      if (data["FDICCert"] == cert) {
        match = true;
        const acctNum = data["BankAccount"];
        bankAccountList.push(acctNum);
      }
    });
    if (match) bankAccountList.splice(0, 1);
  }

  let defaulted = false;

  $: {
    if (bankAccountList[0] && !defaulted) {
      defaulted = true;
      bankAccount = bankAccountList[0];
    }
  }

  function makeRecord() {
    return [
      fdicCert,
      bankAccount,
      statementDate,
      interestPaidDate,
      balance,
      interestPaid,
      apy,
      selectedUser,
      updatedAt,
      dateAdjFactor,
      daysFromMe,
    ];
  }

  function checkData(
    ev: Event & { currentTarget: EventTarget & HTMLInputElement },
    key: keyof Constraints,
    str?: string | null
  ) {
    const el = ev.currentTarget;
    const reg = new RegExp(constraints[key][0], "");
    console.log("checkin val: ", el.value);

    if (!str) {
      if (reg.test(el.value)) {
        el.setCustomValidity("");
      } else {
        el.setCustomValidity(constraints[key][1]);
      }
    } else {
      if (reg.test(str)) {
        el.setCustomValidity("");
      } else {
        el.setCustomValidity(constraints[key][1]);
      }
    }
  }

  function handleSubmit(
    ev: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }
  ) {
    ev.preventDefault();
    records.append(makeRecord());
  }

  function addDashes(dateStr: string) {
    if (dateStr.length > 3 && dateStr[4] != "-") {
      dateStr = dateStr.slice(0, 4) + "-" + dateStr.slice(4);
    }
    if (dateStr.length > 7 && dateStr[7] != "-") {
      dateStr = dateStr.slice(0, 7) + "-" + dateStr.slice(7);
    }
    return dateStr;
  }

  function removeCommas(amount: string) {
    amount = amount.replaceAll(",", "");
    return amount;
  }
</script>

<div class="flex w-full">
  <form
    class="border-solid border-2 border-black-600 max-w-lg m-2 rounded-lg"
    on:submit={handleSubmit}
  >
    <div class="flex m-4">
      <div class="form-control tiny">
        <label class="input-group input-group-vertical">
          <span>FDIC Cert</span>
          <input
            type="text"
            placeholder="Enter text"
            class="input input-bordered"
            required
            bind:value={fdicCert}
            on:change={(_ev) => {
              defaulted = false;
              bankAccount = "";
              lookupBankAccount(fdicCert);
            }}
          />
        </label>
      </div>

      <div class="form-control acct-form m-4">
        <label class="input-group input-group-vertical">
          {#if $output.length > 1 && bankAccountList[0]}
            <span>Bank Account</span>
            <select class="rd-bottom med acct-sel" bind:value={bankAccount}>
              {#each bankAccountList as acctNum}
                <option value={acctNum}>
                  {acctNum}
                </option>
              {/each}
            </select>
          {:else}
            <span>Bank Account</span>
            <input
              type="text"
              placeholder={$output.length <= 1
                ? "Upload a file for dropdown"
                : $output.length > 1 && fdicCert
                ? "No matches"
                : "Enter text"}
              class="input input-bordered"
              required
              bind:value={bankAccount}
            />
          {/if}
        </label>
      </div>
    </div>
    <div class="flex m-4">
      <div class="form-control small">
        <label class="input-group input-group-vertical">
          <span>Statement Date</span>
          <input
            on:change={(ev) => {
              statementDate = addDashes(statementDate);
              checkData(ev, "date", statementDate);
            }}
            type="text"
            placeholder="YYYY-MM-DD"
            class="input input-bordered"
            required
            bind:value={statementDate}
          />
        </label>
      </div>

      <div class="form-control small">
        <label class="input-group input-group-vertical">
          <span>Interest Paid Date </span>
          <input
            on:change={(ev) => {
              interestPaidDate = addDashes(interestPaidDate);
              checkData(ev, "date", interestPaidDate);
            }}
            type="text"
            placeholder="YYYY-MM-DD"
            class="input input-bordered"
            required
            bind:value={interestPaidDate}
          />
        </label>
      </div>
      <div />
    </div>

    <div class="flex m-4">
      <div class="form-control small">
        <label class="input-group input-group-vertical">
          <span>Balance</span>
          <input
            on:change={(ev) => {
              balance = removeCommas(balance);
              checkData(ev, "twoDecimal", balance);
            }}
            type="text"
            placeholder="0.00"
            class="input input-bordered"
            required
            bind:value={balance}
          />
        </label>
      </div>

      <div class="form-control small">
        <label class="input-group input-group-vertical">
          <span>Interest Paid</span>
          <input
            on:change={(ev) => {
              interestPaid = removeCommas(interestPaid);
              checkData(ev, "twoDecimal", interestPaid);
            }}
            type="text"
            placeholder="0.00"
            class="input input-bordered"
            required
            bind:value={interestPaid}
          />
        </label>
      </div>
    </div>

    <div class="flex m-4">
      <div class="form-control small">
        <label class="input-group input-group-vertical">
          <span>APY</span>
          <input
            on:change={(ev) => checkData(ev, "apy")}
            type="text"
            placeholder="0.00000"
            class="input input-bordered"
            required
            bind:value={apy}
          />
        </label>
      </div>
      <div class="form-control small">
        <label class="input-group input-group-vertical">
          <span>Date Adj Factor</span>
          <input
            on:change={(ev) => checkData(ev, "dateAdj")}
            bind:value={dateAdjFactor}
            type="text"
            placeholder="0"
            class="input input-bordered"
            required
          />
        </label>
      </div>
    </div>
    <div class="flex m-4">
      <div class="form-control small">
        <label class="input-group input-group-vertical mx-4">
          <span>User</span>
          <select class="rd-bottom med" bind:value={selectedUser}>
            {#each users as user}
              <option value={user}>
                {user}
              </option>
            {/each}
          </select>
        </label>
      </div>
      <button class="btn m-4 flex place-self-center ml-auto" type="submit"
        >Submit</button
      >
    </div>
  </form>
  <RecordView />
</div>

<!-- <form on:submit={handleSubmit}>
  <label for="StatementDate">Statement Date : </label>
  <input type="text" id="StatementDate" on:change={checkDate} />
  <input
    type="submit"
    value="Validate"
    on:click={() => {
      return false;
    }}
  />
</form> -->

<style>
  .tiny {
    max-width: 120px;
    margin: 1rem;
  }
  .small {
    max-width: 200px;
    margin: 1rem;
  }
  .rd-bottom {
    border: 1.5px solid #e5e7eb;
  }
  .med {
    height: 40px;
  }

  .acct-form {
    min-width: 230px;
  }

  .acct-sel {
    min-height: 48px;
  }
</style>
