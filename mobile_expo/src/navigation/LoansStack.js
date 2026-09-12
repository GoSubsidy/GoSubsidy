import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoansHomeScreen from "../screens/LoansHomeScreen";
import LoanCalculatorScreen from "../screens/LoanCalculatorScreen";

const Stack = createNativeStackNavigator();

export default function LoansStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="LoansHome"
        component={LoansHomeScreen}
        options={{ title: "Loans" }}
      />
      <Stack.Screen
        name="LoanCalculator"
        component={LoanCalculatorScreen}
        options={{ title: "Loan EMI Calculator" }}
      />
    </Stack.Navigator>
  );
}
