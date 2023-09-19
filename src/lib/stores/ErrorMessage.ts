import { writable } from "svelte/store";
import { createListStore } from "./ListStore";

export interface ErrorData {
  msg: string;
  show: boolean;
}

export const errorMessages = createListStore<ErrorData>([]);
