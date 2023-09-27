import { writable } from "svelte/store";
import { FileState } from "../utils/FileState";

export const state = writable(FileState.waiting);
