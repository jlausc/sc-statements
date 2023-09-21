import { writable } from "svelte/store";

// let storedHeaders = localStorage.headers;
// let storedOutput = localStorage.output;

// if (storedHeaders) {
//   storedHeaders = JSON.parse(storedHeaders);
// }
// if (storedOutput) {
//   storedOutput = JSON.parse(storedOutput);
// }

export const headers = writable<string[]>([]);
export const output = writable<any[]>([]);

export const filter = writable("");

export const cursor = writable(0);
export const pageSize = writable(10);
export const totalPages = writable(25);
