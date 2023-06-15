import { message } from "antd";
import axios from "axios";

const HOST = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

export function fetchJWT(userId: string, accessToken: string) {
  return new Promise((resolve) => {
    HOST.get(
      "/JWT?userId=" +
        encodeURIComponent(userId) +
        "&accessToken=" +
        encodeURIComponent(accessToken)
    )
      .then((res) => {
        localStorage.setItem("ihp_jwt", res.data);
        localStorage.setItem("ihp_user_id", userId);
        resolve(true);
      })
      .catch(() => {
        message.error("Failed to exchange access token for a JWT");
        resolve(false);
      });
  });
}
