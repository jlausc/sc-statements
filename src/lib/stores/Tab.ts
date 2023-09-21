import { writable } from "svelte/store";

export enum TabNames {
  bankInfo = "bankinfo",
  input = "input",
}

export const tabs = writable<TabNames>(TabNames.bankInfo);
