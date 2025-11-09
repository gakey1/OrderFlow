// Main dashboard screen for viewing and filtering orders
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet,
  Alert,
  ActivityIndicator,
  TextInput,
  ScrollView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { Order } from '../types';
import OrderCard from '../components/OrderCard';

// Define order status types for tab filtering
type OrderStatus = 'new' | 'processing' | 'ready' | 'collected';

export default function DashboardScreen({ navigation }: any) {
  // State for orders and UI
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<OrderStatus>('new'); // Default to 'new' orders

  useEffect(() => {
    // Redirect to login if user not authenticated
    const currentUser = auth.currentUser;
    if (!currentUser) {
      navigation.navigate('Login');
      return;
    }

    // Set up real-time listener for orders from Firebase
    const ordersQuery = query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc') // Newest orders first
    );

    const unsubscribe = onSnapshot(
      ordersQuery,
      (querySnapshot) => {
        // Convert Firebase documents to Order objects
        const ordersData: Order[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          ordersData.push({
            id: doc.id,
            customerName: data.customerName,
            phone: data.phone,
            notes: data.notes || '',
            status: data.status,
            createdAt: data.createdAt?.toDate() || new Date(), // Convert Firebase timestamp
            updatedAt: data.updatedAt?.toDate() || new Date(),
            createdBy: data.createdBy,
            history: data.history || []
          });
        });
        setOrders(ordersData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching orders:', error);
        Alert.alert('Error', 'Failed to load orders');
        setLoading(false);
      }
    );

    // Clean up listener when component unmounts
    return () => unsubscribe();
  }, [navigation]);

  // Filter orders based on search or selected tab
  const filteredOrders = orders.filter(order => {
    // Search mode: look through all orders by name or phone
    if (searchQuery.trim()) {
      return order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
             order.phone.includes(searchQuery);
    }
    
    // Tab mode: show only orders matching selected status
    return order.status === activeTab;
  });

  // Navigate to order detail screen
  const handleOrderPress = (orderId: string) => {
    navigation.navigate('OrderDetail', { orderId });
  };

  // Show loading spinner while fetching orders
  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#006D77" />
        <Text style={styles.loadingText}>Loading orders...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar - searches both name and phone */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#A0AEC0" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or phone..."
          placeholderTextColor="#A0AEC0"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Status Filter Tabs */}
      <View style={styles.tabsContainer}>
        {/* New Orders Tab */}
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'new' && styles.activeTab]}
          onPress={() => setActiveTab('new')}
        >
          <Text style={[styles.tabText, activeTab === 'new' && styles.activeTabText]}>
            New
          </Text>
        </TouchableOpacity>
        
        {/* Processing Orders Tab */}
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'processing' && styles.activeTab]}
          onPress={() => setActiveTab('processing')}
        >
          <Text style={[styles.tabText, activeTab === 'processing' && styles.activeTabText]}>
            Processing
          </Text>
        </TouchableOpacity>
        
        {/* Ready Orders Tab */}
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'ready' && styles.activeTab]}
          onPress={() => setActiveTab('ready')}
        >
          <Text style={[styles.tabText, activeTab === 'ready' && styles.activeTabText]}>
            Ready
          </Text>
        </TouchableOpacity>
        
        {/* Collected Orders Tab */}
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'collected' && styles.activeTab]}
          onPress={() => setActiveTab('collected')}
        >
          <Text style={[styles.tabText, activeTab === 'collected' && styles.activeTabText]}>
            Collected
          </Text>
        </TouchableOpacity>
      </View>

      {/* Orders List or Empty State */}
      {filteredOrders.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            {searchQuery ? 'No orders found' : `No ${activeTab} orders`}
          </Text>
          <Text style={styles.emptySubtext}>
            {searchQuery 
              ? 'Try adjusting your search or switch to a different tab'
              : `No orders with ${activeTab} status yet`
            }
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          renderItem={({ item }) => (
            <OrderCard 
              order={item} 
              onPress={handleOrderPress}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.ordersList}
          showsVerticalScrollIndicator={false}
        />
      )}
      
      {/* Floating Action Button - creates new order */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddOrder')}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2D3748',
  },
  tabsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F7FAFC',
    borderWidth: 0,
    marginRight: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#006D77',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#718096',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#718096',
  },
  ordersList: {
    padding: 20,
    paddingTop: 0,
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
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E07A5F',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  fabText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 28,
  },
});