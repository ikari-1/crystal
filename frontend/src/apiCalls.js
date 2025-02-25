import axios from "axios";
import { LoginStart, LoginSuccess, LoginError } from "./context/AuthActions"

export const loginCall = async (user, dispatch) => {
  dispatch({ type: "LOGIN_START" });
  try {
    const res = await axios.post("/api/auth/login", user);
    dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
  } catch (err) {
    dispatch({ type: "LOGIN_ERROR", payload: err });
  }
};