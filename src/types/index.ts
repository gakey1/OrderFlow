// OrderFlow App Types

export type OrderStatus = 'new' | 'processing' | 'ready' | 'collected';

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  notes?: string;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  history: OrderHistoryEntry[];
}

export interface OrderHistoryEntry {
  status: OrderStatus;
  timestamp: Date;
  userId: string;
}

export interface User {
  id: string;
  email: string;
  displayName?: string;
}

// Navigation Types
export type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  OrderDetail: { orderId: string };
  AddOrder: undefined;
  EditOrder: { orderId: string };
  Profile: undefined;
};

// Component Props Types
export interface OrderCardProps {
  order: Order;
  onPress: (orderId: string) => void;
}

// Form Types
export interface AddOrderFormData {
  customerName: string;
  phone: string;
  notes: string;
  status: OrderStatus;
  pickupTime?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}