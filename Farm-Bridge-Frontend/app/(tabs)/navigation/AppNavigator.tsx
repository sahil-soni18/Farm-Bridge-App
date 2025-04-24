import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types'; // Adjust the path as needed
import HomeScreen from '../../Screens/home'; // Adjust the path as needed
import AdminScreen from '../../Screens/AdminScreen'; // Adjust the path as needed
import ProductScreen from '../../Screens/ProductScreen'; 
import ExploreProductsScreen from '@/app/Screens/ExploreProductsScreen';
import ProfileScreen from '../../Screens/ProfileScreen';
import OrderHistory from '../../Screens/OrderHistoryScreen';
import OrderDetails from '../../Screens/OrderDetailsScreen';
import OrderStatus from '../../Screens/OrderStatusScreen';
import ChatScreen from '@/app/Screens/ChatScreen';
import PaymentScreen from '@/app/Screens/PaymentScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Admin" component={AdminScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Product" component={ProductScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ExploreProducts" component={ExploreProductsScreen} options={{ headerTitle: 'Explore Products' }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
      <Stack.Screen name="OrderHistory" component={OrderHistory} />
      <Stack.Screen name="OrderDetails" component={OrderDetails} /> {/* Add this line */}
      <Stack.Screen name="OrderStatus" component={OrderStatus} /> {/* Add this line */}
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} options={{ headerTitle: 'Payment' }} />
    </Stack.Navigator>
  );
};

export default AppNavigator;