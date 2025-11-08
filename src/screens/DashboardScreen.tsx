import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet,
  Alert 
} from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

// Mock order data for now
const mockOrders = [
  {
    id: '1',
    customerName: 'John Smith',
    phone: '0412345678',
    notes: 'Regular coffee, no sugar',
    status: 'new',
    createdAt: new Date().toLocaleDateString(),
  },
  {
    id: '2', 
    customerName: 'Sarah Wilson',
    phone: '0498765432',
    notes: 'Latte with oat milk',
    status: 'processing',
    createdAt: new Date().toLocaleDateString(),
  }
];

const statusColors = {
  new: '#BEE3F8',
  processing: '#FED7AA', 
  ready: '#9AE6B4',
  collected: '#E2E8F0'
};

export default function DashboardScreen({ navigation }: any) {
  const [orders, setOrders] = useState(mockOrders);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth);
              // Navigation will happen automatically via AuthContext
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          }
        }
      ]
    );
  };

  const OrderCard = ({ item }: any) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.customerName}>{item.customerName}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColors[item.status] }]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>
      <Text style={styles.phoneNumber}>{item.phone}</Text>
      <Text style={styles.notes}>{item.notes}</Text>
      <Text style={styles.date}>{item.createdAt}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Orders</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {orders.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No orders yet</Text>
          <Text style={styles.emptySubtext}>Orders will appear here when created</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={OrderCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.ordersList}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#006D77',
  },
  logoutButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#E53E3E',
    borderRadius: 6,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  ordersList: {
    padding: 20,
    paddingTop: 0,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  orderHeader: {
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
  },
  date: {
    fontSize: 12,
    color: '#A0AEC0',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
  },
});