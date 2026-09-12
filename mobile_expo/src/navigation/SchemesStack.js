import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SchemeListScreen from "../screens/SchemeListScreen";
import SchemeDetailsScreen from "../screens/SchemeDetailsScreen";

const Stack = createNativeStackNavigator();

export default function SchemesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SchemesList"
        component={SchemeListScreen}
        options={{ title: "Schemes" }}
      />
      <Stack.Screen
        name="SchemeDetails"
        component={SchemeDetailsScreen}
        options={{ title: "Scheme Details" }}
      />
    </Stack.Navigator>
  );
}
