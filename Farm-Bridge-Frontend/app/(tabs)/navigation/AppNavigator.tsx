import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types'; // Adjust the path as needed
import HomeScreen from '../../Screens/home'; // Adjust the path as needed
import AdminScreen from '../../Screens/AdminScreen'; // Adjust the path as needed
import ProductScreen from '../../Screens/ProductScreen'; // Adjust the path as needed

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Admin" component={AdminScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Product" component={ProductScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default AppNavigator;