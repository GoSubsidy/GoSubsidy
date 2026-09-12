import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeStack from "./HomeStack";
import SchemesStack from "./SchemesStack";
import LoansStack from "./LoansStack";
import InsuranceStack from "./InsuranceStack";

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,   // ✅ CRITICAL: prevents duplicate headers
      }}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Schemes" component={SchemesStack} />
      <Tab.Screen name="Loans" component={LoansStack} />
      <Tab.Screen name="Insurance" component={InsuranceStack} />
    </Tab.Navigator>
  );
}
