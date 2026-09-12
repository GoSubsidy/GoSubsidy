import { createNativeStackNavigator } from "@react-navigation/native-stack";
import InsuranceHomeScreen from "../screens/InsuranceHomeScreen";
import InsuranceDetailsScreen from "../screens/InsuranceDetailsScreen";

const Stack = createNativeStackNavigator();

export default function InsuranceStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="InsuranceHome"
        component={InsuranceHomeScreen}
        options={{ title: "Insurance" }}
      />
      <Stack.Screen
        name="InsuranceDetails"
        component={InsuranceDetailsScreen}
        options={{ title: "Insurance Details" }}
      />
    </Stack.Navigator>
  );
}
