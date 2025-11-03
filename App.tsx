import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>OrderFlow</Text>
      <Text style={styles.subtitle}>Welcome to OrderFlow!</Text>
      <Text style={styles.info}>Order Management System</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#006D77',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '400',
    color: '#2D3748',
    marginBottom: 4,
  },
  info: {
    fontSize: 14,
    fontWeight: '300',
    color: '#718096',
  },
});