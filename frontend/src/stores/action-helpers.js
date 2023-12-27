import { notifError } from "src/util/notify";
import { messages } from "./messages";

export const catchError = (error) => {
  let message = messages.default;
  if (!error.response) message = messages.noConn;
  if (error.message) message = error.message;
  if (error?.response?.data?.message) message = error.response.data.message;
  notifError(message, "warning");
  return {
    status: "error",
    message,
  };
};

export const sendMessage = (status, message, load = null) => {
  return { status, message, load };
};
