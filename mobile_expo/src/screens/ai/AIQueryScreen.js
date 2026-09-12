// mobile_expo/src/screens/AIQueryScreen.js
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import api from '../api';
import { ENDPOINTS } from '../config';

export default function AIQueryScreen() {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const scrollRef = useRef(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    const t = setTimeout(() => {
      try {
        scrollRef.current.scrollToEnd({ animated: true });
      } catch {}
    }, 120);
    return () => clearTimeout(t);
  }, [answer]);

  async function runQuery(isRetry = false) {
    if (!query.trim()) {
      Alert.alert('Enter a query');
      return;
    }

    setLoading(true);
    if (!isRetry) setAnswer('');

    try {
      const res = await api.aiQuery(query);

      /**
       * Expect backend to return:
       * { success: true, answer: "..." }
       */
      if (res?.success && res.answer) {
        setAnswer(res.answer);
      } else if (res?.answer) {
        setAnswer(res.answer);
      } else {
        setAnswer(JSON.stringify(res, null, 2));
      }

      setAttempts(0); // reset attempts on success
    } catch (err) {
      console.error('AI query failed', err);

      setAttempts(prev => prev + 1);

      // fetch() network error
      if (err instanceof TypeError) {
        setAnswer(
          'Network Error — cannot reach server.\n' +
          '• Check phone & laptop are on same Wi-Fi\n' +
          '• Check API_BASE IP\n' +
          '• Backend must listen on 0.0.0.0'
        );

        if (!isRetry && attempts < 2) {
          setTimeout(() => runQuery(true), 1200);
        }
      } else {
        setAnswer(err.message || 'Unexpected error');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => {
            try { scrollRef.current?.scrollToEnd({ animated: true }); } catch {}
          }}
        >
          <Text style={styles.title}>AI Assistant</Text>
          <Text style={styles.heading}>Ask Subsidy Assistant</Text>

          <TextInput
            style={styles.input}
            placeholder="Ask about a subsidy, e.g. dairy subsidy Telangana"
            value={query}
            onChangeText={setQuery}
            multiline
          />

          <View style={styles.buttons}>
            <Button
              title={loading ? 'Running...' : 'ASK'}
              onPress={() => runQuery(false)}
              disabled={loading}
            />
          </View>

          {loading && <ActivityIndicator style={{ marginTop: 20 }} />}

          <Text style={styles.subtitle}>Answer</Text>

          <View style={styles.answerBox}>
            <Text style={styles.answerText}>
              {answer || (loading ? 'Waiting for answer…' : 'No answer yet')}
            </Text>
          </View>

          <Text style={styles.debug}>Endpoint: {ENDPOINTS.AI_QUERY}</Text>

          <View style={{ height: 64 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f6f8' },
  flex: { flex: 1 },
  container: {
    padding: 16,
    flexGrow: 1,
    backgroundColor: '#f5f6f8',
  },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 6 },
  heading: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  buttons: { marginTop: 12 },
  subtitle: { marginTop: 20, marginBottom: 6, fontWeight: '600' },
  answerBox: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    minHeight: 120,
  },
  answerText: { lineHeight: 20 },
  debug: { color: '#666', marginTop: 12, fontSize: 12 },
});
