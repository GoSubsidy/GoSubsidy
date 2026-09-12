import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

export default function LoanCalculator() {
  const [projectCost, setProjectCost] = useState("");
  const [ownContribution, setOwnContribution] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [tenureYears, setTenureYears] = useState("");
  const [moratoriumMonths, setMoratoriumMonths] = useState("");
  const [subsidyPercent, setSubsidyPercent] = useState("");

  const [frequency, setFrequency] = useState("MONTHLY");
  const [showAmortization, setShowAmortization] = useState(false);

  const freqMap = {
    MONTHLY: 12,
    QUARTERLY: 4,
    YEARLY: 1,
  };

  const result = useMemo(() => {
    const pc = Number(projectCost);
    const own = Number(ownContribution);
    const rate = Number(interestRate);
    const years = Number(tenureYears);
    const moratorium = Number(moratoriumMonths);
    const subsidyPct = Number(subsidyPercent);

    if (!pc || !rate || !years) return null;

    const subsidyAmount = pc * (subsidyPct / 100);
    const loanAmount = pc - own - subsidyAmount;

    if (loanAmount <= 0) return null;

    const periodsPerYear = freqMap[frequency];
    const totalPeriods = years * periodsPerYear;
    const r = rate / 100 / periodsPerYear;

    // Moratorium interest accumulation
    let outstanding = loanAmount;
    for (let i = 0; i < moratorium; i++) {
      outstanding += outstanding * r;
    }

    const emi =
      (outstanding * r * Math.pow(1 + r, totalPeriods)) /
      (Math.pow(1 + r, totalPeriods) - 1);

    // Amortization
    let balance = outstanding;
    const schedule = [];

    for (let i = 1; i <= totalPeriods; i++) {
      const interest = balance * r;
      const principal = emi - interest;
      balance -= principal;

      schedule.push({
        period: i,
        opening: balance + principal,
        emi,
        interest,
        principal,
        closing: balance > 0 ? balance : 0,
      });
    }

    return {
      subsidyAmount,
      loanAmount,
      effectiveLoan: outstanding,
      emi,
      schedule,
    };
  }, [
    projectCost,
    ownContribution,
    interestRate,
    tenureYears,
    moratoriumMonths,
    subsidyPercent,
    frequency,
  ]);

  return (
    <ScrollView style={styles.card}>
      <Text style={styles.title}>Loan Calculator</Text>

      <TextInput
        style={styles.input}
        placeholder="Project Cost (₹)"
        keyboardType="numeric"
        value={projectCost}
        onChangeText={setProjectCost}
      />

      <TextInput
        style={styles.input}
        placeholder="Own Contribution (₹)"
        keyboardType="numeric"
        value={ownContribution}
        onChangeText={setOwnContribution}
      />

      <TextInput
        style={styles.input}
        placeholder="Project Subsidy (%)"
        keyboardType="numeric"
        value={subsidyPercent}
        onChangeText={setSubsidyPercent}
      />

      <TextInput
        style={styles.input}
        placeholder="Bank Interest (%)"
        keyboardType="numeric"
        value={interestRate}
        onChangeText={setInterestRate}
      />

      <TextInput
        style={styles.input}
        placeholder="Tenure (Years)"
        keyboardType="numeric"
        value={tenureYears}
        onChangeText={setTenureYears}
      />

      <TextInput
        style={styles.input}
        placeholder="Moratorium (Months)"
        keyboardType="numeric"
        value={moratoriumMonths}
        onChangeText={setMoratoriumMonths}
      />

      <View style={styles.freqRow}>
        {Object.keys(freqMap).map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.freqBtn,
              frequency === f && styles.freqActive,
            ]}
            onPress={() => setFrequency(f)}
          >
            <Text
              style={[
                styles.freqText,
                frequency === f && styles.freqTextActive,
              ]}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {result && (
        <>
          <Text style={styles.result}>
            Project Subsidy: ₹ {result.subsidyAmount.toFixed(0)}
          </Text>

          <Text style={styles.result}>
            Bank Loan: ₹ {result.loanAmount.toFixed(0)}
          </Text>

          <Text style={styles.resultBold}>
            EMI ({frequency.toLowerCase()}): ₹ {result.emi.toFixed(0)}
          </Text>

          <TouchableOpacity
            style={styles.amortBtn}
            onPress={() => setShowAmortization(!showAmortization)}
          >
            <Text style={styles.amortBtnText}>
              {showAmortization ? "Hide" : "Show"} Amortization
            </Text>
          </TouchableOpacity>

          {showAmortization &&
            result.schedule.map((row) => (
              <Text key={row.period} style={styles.row}>
                {row.period} | ₹{row.opening.toFixed(0)} | ₹
                {row.emi.toFixed(0)} | ₹{row.interest.toFixed(0)} | ₹
                {row.principal.toFixed(0)} | ₹
                {row.closing.toFixed(0)}
              </Text>
            ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginTop: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  freqRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  freqBtn: {
    flex: 1,
    padding: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: "#eee",
    alignItems: "center",
  },
  freqActive: {
    backgroundColor: "#2563eb",
  },
  freqText: {
    color: "#333",
    fontWeight: "600",
  },
  freqTextActive: {
    color: "#fff",
  },
  result: {
    fontSize: 15,
    marginTop: 6,
  },
  resultBold: {
    fontSize: 17,
    fontWeight: "700",
    marginTop: 8,
  },
  amortBtn: {
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
    alignItems: "center",
  },
  amortBtnText: {
    color: "#fff",
    fontWeight: "700",
  },
  row: {
    fontSize: 12,
    marginTop: 4,
  },
});
