<script lang="ts">
  import { records } from "../stores/Records";
  import { constraints, type Constraints } from "../utils/constraints/regex";
  import RecordView from "./RecordView.svelte";
  const users = ["script", "kdawa", "vagnello", "jnieves"];

  let fdicCert: string;
  let bankAccount: string;
  let statementDate: string;
  let interestPaidDate: string;
  let balance: string;
  let interestPaid: string;
  let apy: string;
  let selectedUser: string;
  const dateObj = new Date();
  let day = dateObj.getDate().toString();
  let month = dateObj.getMonth().toString();
  month = month.length < 2 ? "0" + month : month;
  let year = dateObj.getFullYear().toString();
  const updatedAt = year + "-" + month + "-" + day;
  let dateAdjFactor: string = "0";
  const daysFromMe = "0";

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
    key: keyof Constraints
  ) {
    const el = ev.currentTarget;
    const reg = new RegExp(constraints[key][0], "");
    console.log("checkin val: ", el.value);
    if (reg.test(el.value)) {
      el.setCustomValidity("");
    } else {
      el.setCustomValidity(constraints[key][1]);
      console.log("Invalid");
    }
  }

  function handleSubmit(
    ev: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }
  ) {
    ev.preventDefault();
    records.append(makeRecord());
  }
</script>

<div class="flex w-full">
  <form
    class="border-solid border-2 border-black-600 max-w-lg m-4 rounded-lg"
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
          />
        </label>
      </div>

      <div class="form-control max-w-xs m-4">
        <label class="input-group input-group-vertical">
          <span>Bank Account</span>
          <input
            type="text"
            placeholder="Enter text"
            class="input input-bordered"
            required
            bind:value={bankAccount}
          />
        </label>
      </div>
    </div>
    <div class="flex m-4">
      <div class="form-control small">
        <label class="input-group input-group-vertical">
          <span>Statement Date</span>
          <input
            on:change={(ev) => checkData(ev, "date")}
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
            on:change={(ev) => checkData(ev, "date")}
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
            on:change={(ev) => checkData(ev, "twoDecimal")}
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
            on:change={(ev) => checkData(ev, "twoDecimal")}
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

    <div class="form-control small m-4">
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

    <button class="btn mx-8 my-2" type="submit">Submit</button>
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
</style>
