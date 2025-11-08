import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Order } from '../types';

interface OrderCardProps {
  order: Order;
  onPress: (orderId: string) => void;
}

const statusColors = {
  new: '#BEE3F8',
  processing: '#FED7AA', 
  ready: '#9AE6B4',
  collected: '#E2E8F0'
};

export default function OrderCard({ order, onPress }: OrderCardProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => onPress(order.id)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.customerName}>{order.customerName}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColors[order.status] }]}>
          <Text style={styles.statusText}>{order.status.toUpperCase()}</Text>
        </View>
      </View>
      
      <Text style={styles.phoneNumber}>{order.phone}</Text>
      
      {order.notes && (
        <Text style={styles.notes} numberOfLines={2}>
          {order.notes}
        </Text>
      )}
      
      <Text style={styles.date}>
        Created: {formatDate(order.createdAt)}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
    marginRight: 8,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2D3748',
  },
  phoneNumber: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 4,
  },
  notes: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  date: {
    fontSize: 12,
    color: '#A0AEC0',
  },
});