// Main app entry point with navigation setup
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';

// Import all app screens
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import AddOrderScreen from './src/screens/AddOrderScreen';
import OrderDetailScreen from './src/screens/OrderDetailScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import StatsScreen from './src/screens/StatsScreen';

// Import authentication context for user management
import { AuthProvider } from './src/context/AuthContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Main tab navigator - shows after user logs in
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        // Custom header styling
        headerStyle: {
          backgroundColor: '#006D77',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '600',
        },
        // Tab bar styling with platform-specific adjustments
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E2E8F0',
          borderTopWidth: 1,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10, // iOS needs extra bottom padding
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 85 : 70,
          elevation: 8, // Android shadow
          shadowColor: '#000', // iOS shadow
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        },
        // Tab bar colors for active/inactive states
        tabBarActiveTintColor: '#006D77',
        tabBarInactiveTintColor: '#A0AEC0',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
      }}
    >
      {/* Orders tab - main dashboard */}
      <Tab.Screen 
        name="Orders" 
        component={DashboardScreen}
        options={{
          title: 'Orders',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? 'clipboard' : 'clipboard-outline'} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
      {/* Stats tab - order analytics */}
      <Tab.Screen 
        name="Stats" 
        component={StatsScreen}
        options={{
          title: 'Stats',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? 'stats-chart' : 'stats-chart-outline'} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
      {/* Profile tab - user account management */}
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? 'person-circle' : 'person-circle-outline'} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Main app component
export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        {/* Stack navigator for screen transitions */}
        <Stack.Navigator 
          initialRouteName="Login"
          screenOptions={{
            // Global header styling
            headerStyle: {
              backgroundColor: '#006D77',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: '600',
            },
            // Platform-specific animations
            animation: Platform.OS === 'android' ? 'slide_from_right' : 'default',
          }}
        >
          {/* Login screen - no header */}
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          {/* Main tabs container - no header */}
          <Stack.Screen 
            name="Main" 
            component={MainTabs}
            options={{ headerShown: false }}
          />
          {/* Add order screen - modal style */}
          <Stack.Screen 
            name="AddOrder" 
            component={AddOrderScreen}
            options={{ title: 'Create Order' }}
          />
          {/* Order detail screen */}
          <Stack.Screen 
            name="OrderDetail" 
            component={OrderDetailScreen}
            options={{ title: 'Order Details' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </AuthProvider>
  );
}