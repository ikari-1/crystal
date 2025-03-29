import axios from "axios";
import { LoginStart, LoginSuccess, LoginError } from "./context/AuthActions"

export const loginCall = async (user, dispatch) => {
  dispatch(LoginStart());
  try {
    const res = await axios.post("/api/auth/login", user);
    dispatch(LoginSuccess(res.data));
  } catch (err) {
    dispatch(LoginError(err));
  }
};