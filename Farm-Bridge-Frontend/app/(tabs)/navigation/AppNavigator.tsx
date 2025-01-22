import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types'; // Adjust the path as needed
import HomeScreen from '../../Screens/home'; // Adjust the path as needed
import AdminScreen from '../../Screens/AdminScreen'; // Adjust the path as needed
import ProductScreen from '../../Screens/ProductScreen'; // Adjust the path as needed
import ExploreProductsScreen from '@/app/Screens/ExploreProductsScreen';
import ProfileScreen from '../../Screens/ProfileScreen';
import OrderHistory from '../../Screens/OrderHistoryScreen';
import OrderDetails from '../../Screens/OrderDetailsScreen'; // Import the OrderDetails screen

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
    </Stack.Navigator>
  );
};

export default AppNavigator;