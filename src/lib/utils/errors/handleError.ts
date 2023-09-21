import { get } from "svelte/store";
import { errorMessages, type ErrorData } from "../../stores/ErrorMessage";

export function handleError(ev?: ErrorEvent, message?: string) {
  const errorMessage = message ? message : ev?.message.split(":")[1];

  const newError: ErrorData = {
    msg: errorMessage ? errorMessage : "Unknown Error",
    show: true,
  };
  errorMessages.append(newError);
}
