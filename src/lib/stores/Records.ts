import { createListStore } from "./ListStore";

let storedRecords = localStorage.records;

if (storedRecords) {
  console.log("origin", storedRecords);
  console.log("par", JSON.parse(storedRecords));
  storedRecords = JSON.parse(storedRecords);
}

export const records = createListStore<string[]>(storedRecords || []);
