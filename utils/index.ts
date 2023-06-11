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

export function fileToBase64(eFile: File | null | undefined) {
  return new Promise((resolve) => {
    if (!eFile) {
      resolve("");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(eFile);
  });
}
