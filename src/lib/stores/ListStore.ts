import { get, writable } from "svelte/store";

export function createListStore<T>(initialValue: T[]) {
  const newStore = writable<T[]>(initialValue);

  function append(newVal: T) {
    newStore.update((previousValue) => [...previousValue, newVal]);
  }

  function reset() {
    newStore.set([]);
  }

  function removeIndex(idx: number) {
    const cur = get(newStore);
    cur.splice(idx, 1);
    newStore.set(cur);
  }

  return {
    ...newStore,
    append,
    reset,
    removeIndex,
  };
}
