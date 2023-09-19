import { writable } from "svelte/store";

export function createListStore<T>(initialValue: T[]) {
  const newStore = writable<T[]>(initialValue);

  function append(newVal: T) {
    newStore.update((previousValue) => [...previousValue, newVal]);
  }

  function reset() {
    newStore.set([]);
  }

  return {
    ...newStore,
    append,
    reset,
  };
}
