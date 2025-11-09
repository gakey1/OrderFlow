// Reusable order card component for displaying order info
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Order } from '../types';

// Props interface for OrderCard component
interface OrderCardProps {
  order: Order;
  onPress: (orderId: string) => void;
}

// Status color mapping for badges
const statusColors = {
  new: '#BEE3F8',
  processing: '#FED7AA', 
  ready: '#9AE6B4',
  collected: '#E2E8F0'
};

export default function OrderCard({ order, onPress }: OrderCardProps) {
  // Calculate time since order creation
  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => onPress(order.id)}
      activeOpacity={0.7}
    >
      {/* Header with customer name and status */}
      <View style={styles.header}>
        <Text style={styles.customerName}>{order.customerName}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColors[order.status] }]}>
          <Text style={styles.statusText}>{order.status.toUpperCase()}</Text>
        </View>
      </View>
      
      {/* Phone number row */}
      <View style={styles.phoneRow}>
        <Ionicons name="call-outline" size={16} color="#006D77" />
        <Text style={styles.phoneNumber}>{order.phone}</Text>
      </View>
      
      {/* Order notes (if any) */}
      {order.notes && (
        <>
          <View style={styles.divider} />
          <Text style={styles.notes} numberOfLines={2}>
            {order.notes}
          </Text>
        </>
      )}
      
      {/* Time since creation */}
      <View style={styles.timeFooter}>
        <Ionicons name="time-outline" size={14} color="#A0AEC0" />
        <Text style={styles.timeAgo}>{getTimeAgo(order.createdAt)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  customerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2D3748',
    letterSpacing: 0.5,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  phoneNumber: {
    fontSize: 15,
    color: '#006D77',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 8,
  },
  notes: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 8,
    lineHeight: 20,
  },
  timeFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  timeAgo: {
    fontSize: 12,
    color: '#A0AEC0',
    fontWeight: '500',
  },
});