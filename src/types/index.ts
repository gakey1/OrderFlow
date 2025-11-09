// TypeScript type definitions for OrderFlow app

// Order status types - follows the 4-stage workflow
export type OrderStatus = 'new' | 'processing' | 'ready' | 'collected';

// Main order data structure
export interface Order {
  id: string;
  customerName: string;
  phone: string;
  notes?: string; // Optional order details
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // User ID who created the order
  history: OrderHistoryEntry[]; // Track all status changes
}

// History entry for tracking order status changes
export interface OrderHistoryEntry {
  status: OrderStatus;
  timestamp: Date;
  userId: string; // Who made the change
}

// User account information
export interface User {
  id: string;
  email: string;
  displayName?: string;
}

// React Navigation screen parameters
export type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  OrderDetail: { orderId: string };
  AddOrder: undefined;
  EditOrder: { orderId: string };
  Profile: undefined;
};

// Component prop interfaces
export interface OrderCardProps {
  order: Order;
  onPress: (orderId: string) => void;
}

// Form data structures
export interface AddOrderFormData {
  customerName: string;
  phone: string;
  notes: string;
  status: OrderStatus;
  pickupTime?: string; // Future feature
}

// API response wrapper for error handling
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}