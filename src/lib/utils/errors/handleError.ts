import { get } from "svelte/store";
import { errorMessages, type ErrorData } from "../../stores/ErrorMessage";

export function handleError(ev: ErrorEvent) {
  const newError: ErrorData = {
    msg: ev.message.split(":")[1],
    show: true,
  };
  console.log("ORIG", ev, ev.message);
  console.log("split msg", newError.msg);
  // const errList = get(errorMessages);
  errorMessages.append(newError);
}
