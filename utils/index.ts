export const errorResponse = (err: never | any) => {
  let msg = "";

  if (err.response) {
    if (err.response.data?.message) {
      msg = err.response.data?.message;
    } else if (err.response?.data) {
      msg = err.response.data;
    } else if (err.response?.status) {
      msg = err.response.status;
    }
  } else if (typeof err === "string") {
    msg = err;
  }
  return msg;
};

export function safeObject<T>(obj: any, defaultValue = {}) {
  if (!!obj && typeof obj === "object") {
    return obj as T;
  }
  return defaultValue as T;
}
