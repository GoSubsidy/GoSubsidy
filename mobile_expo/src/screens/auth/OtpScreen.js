import * as SecureStore from "expo-secure-store";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const { setToken } = useContext(AuthContext);

const onVerifyOtp = async () => {
  // after backend OTP success
  const token = response.token;

  await SecureStore.setItemAsync("token", token);
  setToken(token); // ✅ THIS TRIGGERS APP TABS
};
