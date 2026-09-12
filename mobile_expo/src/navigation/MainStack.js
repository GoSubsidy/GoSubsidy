import React, { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import AuthStack from "./AuthStack";
import AppTabs from "./AppTabs";

export default function MainStack() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      const savedToken = await SecureStore.getItemAsync("token");
      setToken(savedToken);
      setLoading(false);
    };
    loadToken();
  }, []);

  if (loading) return null;

  return token ? <AppTabs /> : <AuthStack />;
}
