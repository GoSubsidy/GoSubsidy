// mobile_expo/src/toastConfig.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SubsidyToast = ({ text1, text2 }) => (
  <View style={styles.box}>
    <Text style={styles.title}>{text1}</Text>
    {text2 ? <Text style={styles.subtitle}>{text2}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  box: {
    backgroundColor: '#4c51bf',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  title: { color: 'white', fontWeight: 'bold' },
  subtitle: { color: '#e0e7ff', marginTop: 4 },
});

export default {
  subsidy: (props) => <SubsidyToast {...props} />,
};
