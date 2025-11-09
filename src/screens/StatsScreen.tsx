// Statistics screen showing order analytics
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import { auth, db } from '../config/firebase';

// Interface for statistics data structure
interface Stats {
  totalOrders: number;
  newOrders: number;
  processingOrders: number;
  readyOrders: number;
  collectedOrders: number;
}

export default function StatsScreen() {
  // State for statistics and loading
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    newOrders: 0,
    processingOrders: 0,
    readyOrders: 0,
    collectedOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch stats if user is authenticated
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    // Set up real-time listener for calculating stats
    const ordersQuery = query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      ordersQuery,
      (querySnapshot) => {
        const orders = querySnapshot.docs.map(doc => doc.data());

        // Calculate order statistics by status
        const newStats: Stats = {
          totalOrders: orders.length,
          newOrders: orders.filter(order => order.status === 'new').length,
          processingOrders: orders.filter(order => order.status === 'processing').length,
          readyOrders: orders.filter(order => order.status === 'ready').length,
          collectedOrders: orders.filter(order => order.status === 'collected').length,
        };

        setStats(newStats);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching stats:', error);
        setLoading(false);
      }
    );

    // Clean up listener when component unmounts
    return () => unsubscribe();
  }, []);

  // Auto-refresh when screen comes into focus (listener handles updates)
  useFocusEffect(
    React.useCallback(() => {
      // Stats will automatically update via the real-time listener
      return () => {};
    }, [])
  );

  // Reusable component for individual stat cards
  const StatCard = ({ title, count, color }: { title: string; count: number; color: string }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Text style={styles.statCount}>{count}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  // Show loading while calculating stats
  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#006D77" />
        <Text style={styles.loadingText}>Loading statistics...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.pageTitle}>Order Statistics</Text>
        
        {/* Total Orders Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{stats.totalOrders}</Text>
          <Text style={styles.summaryLabel}>Total Orders</Text>
        </View>

        {/* Status Breakdown Cards */}
        <View style={styles.statsGrid}>
          <StatCard 
            title="New Orders" 
            count={stats.newOrders} 
            color="#BEE3F8" 
          />
          <StatCard 
            title="Processing" 
            count={stats.processingOrders} 
            color="#FED7AA" 
          />
          <StatCard 
            title="Ready" 
            count={stats.readyOrders} 
            color="#9AE6B4" 
          />
          <StatCard 
            title="Collected" 
            count={stats.collectedOrders} 
            color="#E2E8F0" 
          />
        </View>

        {/* Completion Rate Calculator */}
        <View style={styles.rateCard}>
          <Text style={styles.rateTitle}>Completion Rate</Text>
          <Text style={styles.rateValue}>
            {stats.totalOrders > 0 
              ? Math.round((stats.collectedOrders / stats.totalOrders) * 100)
              : 0
            }%
          </Text>
          <Text style={styles.rateSubtext}>
            {stats.collectedOrders} of {stats.totalOrders} orders completed
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#718096',
  },
  summaryCard: {
    backgroundColor: '#006D77',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
  },
  summaryNumber: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
    opacity: 0.9,
  },
  statsGrid: {
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statCount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2D3748',
  },
  statTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4A5568',
  },
  rateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  rateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 8,
  },
  rateValue: {
    fontSize: 36,
    fontWeight: '700',
    color: '#006D77',
    marginBottom: 4,
  },
  rateSubtext: {
    fontSize: 14,
    color: '#718096',
  },
});