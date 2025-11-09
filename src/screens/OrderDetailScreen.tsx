// Screen for viewing and updating individual orders
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Linking,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { doc, updateDoc, getDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { Order, OrderStatus } from '../types';

// Color scheme for different order statuses
const statusColors = {
  new: '#BEE3F8',
  processing: '#FED7AA',
  ready: '#9AE6B4',
  collected: '#E2E8F0'
};

// Define the order status progression flow
const statusFlow = {
  new: 'processing',
  processing: 'ready',
  ready: 'collected',
  collected: null // Final status - no next step
};

// Button labels for status progression
const statusLabels = {
  new: 'Mark as Processing',
  processing: 'Mark as Ready',
  ready: 'Mark as Collected',
  collected: 'Completed'
};

export default function OrderDetailScreen({ route, navigation }: any) {
  const { orderId } = route.params;
  // Component state
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  // Fetch order details from Firebase
  const fetchOrder = async () => {
    try {
      const orderDoc = await getDoc(doc(db, 'orders', orderId));
      if (orderDoc.exists()) {
        const data = orderDoc.data();
        // Convert Firebase data to Order object
        setOrder({
          id: orderDoc.id,
          customerName: data.customerName,
          phone: data.phone,
          notes: data.notes,
          status: data.status,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          createdBy: data.createdBy,
          history: data.history?.map((entry: any) => ({
            ...entry,
            timestamp: entry.timestamp?.toDate() || new Date() // Convert timestamps
          })) || []
        });
      } else {
        Alert.alert('Error', 'Order not found');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      Alert.alert('Error', 'Failed to load order details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  // Update order to next status in the workflow
  const updateOrderStatus = async () => {
    if (!order) return;

    const nextStatus = statusFlow[order.status as keyof typeof statusFlow];
    if (!nextStatus) return; // Already at final status

    setUpdating(true);

    try {
      // Check authentication
      const currentUser = auth.currentUser;
      if (!currentUser) {
        Alert.alert('Error', 'You must be logged in to update orders');
        navigation.navigate('Login');
        return;
      }

      // Create history entry for status change
      const newHistoryEntry = {
        status: nextStatus,
        timestamp: Timestamp.now(),
        userId: currentUser.uid
      };

      // Update order in Firebase
      await updateDoc(doc(db, 'orders', orderId), {
        status: nextStatus,
        updatedAt: Timestamp.now(),
        history: [...order.history, newHistoryEntry] // Add to history
      });

      // Update local state to reflect changes
      setOrder({
        ...order,
        status: nextStatus as OrderStatus,
        updatedAt: new Date(),
        history: [...order.history, {
          status: nextStatus as OrderStatus,
          timestamp: new Date(),
          userId: currentUser.uid
        }]
      });

      Alert.alert('Success', `Order marked as ${nextStatus}!`);
    } catch (error) {
      console.error('Error updating order:', error);
      Alert.alert('Error', 'Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  // Open phone dialer to call customer
  const handleCallCustomer = () => {
    if (order?.phone) {
      Linking.openURL(`tel:${order.phone}`);
    }
  };

  // Format date for display in Australian format
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#006D77" />
        <Text style={styles.loadingText}>Loading order...</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Order not found</Text>
      </View>
    );
  }

  const nextStatus = statusFlow[order.status as keyof typeof statusFlow];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Status Badge */}
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: statusColors[order.status] }]}>
            <Text style={styles.statusText}>{order.status.toUpperCase()}</Text>
          </View>
        </View>

        {/* Customer Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <Text style={styles.customerName}>{order.customerName}</Text>
          
          <TouchableOpacity style={styles.phoneButton} onPress={handleCallCustomer}>
            <View style={styles.phoneRow}>
              <Ionicons name="call-outline" size={16} color="#006D77" />
              <Text style={styles.phoneNumber}>{order.phone}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Order Details */}
        {order.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Notes</Text>
            <Text style={styles.notes}>{order.notes}</Text>
          </View>
        )}

        {/* Order Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Information</Text>
          <Text style={styles.infoText}>Created: {formatDate(order.createdAt)}</Text>
          <Text style={styles.infoText}>Last Updated: {formatDate(order.updatedAt)}</Text>
          <Text style={styles.infoText}>Order ID: {order.id}</Text>
        </View>

        {/* Status Update Button */}
        {nextStatus && (
          <TouchableOpacity
            style={[styles.updateButton, updating && styles.updateButtonDisabled]}
            onPress={updateOrderStatus}
            disabled={updating}
          >
            {updating ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.updateButtonText}>
                {statusLabels[order.status as keyof typeof statusLabels]}
              </Text>
            )}
          </TouchableOpacity>
        )}

        {order.status === 'collected' && (
          <View style={styles.completedContainer}>
            <Text style={styles.completedText}>✅ Order Completed</Text>
          </View>
        )}
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
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#718096',
  },
  errorText: {
    fontSize: 16,
    color: '#E53E3E',
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  statusBadge: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2D3748',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 12,
  },
  customerName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#006D77',
    marginBottom: 8,
  },
  phoneButton: {
    alignSelf: 'flex-start',
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  phoneNumber: {
    fontSize: 16,
    color: '#006D77',
    fontWeight: '500',
  },
  notes: {
    fontSize: 16,
    color: '#4A5568',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  infoText: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 4,
  },
  updateButton: {
    backgroundColor: '#006D77',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  updateButtonDisabled: {
    backgroundColor: '#A0AEC0',
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  completedContainer: {
    backgroundColor: '#9AE6B4',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  completedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
  },
});