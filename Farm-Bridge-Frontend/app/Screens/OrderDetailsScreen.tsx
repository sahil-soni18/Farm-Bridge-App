import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import axios from 'axios';
import { RootStackParamList } from '../types';

type OrderDetailsRouteProp = RouteProp<RootStackParamList, 'OrderDetails'>;

interface OrderDetailsProps {
  route: OrderDetailsRouteProp;
}

type Order = {
  id: string;
  date: string;
  items: string[];
  total: number;
  status: string;
};

const OrderDetails = ({ route }: OrderDetailsProps) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch Order Details from Backend
  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/orders/user/orders`, { withCredentials: true });

      if (response.status === 200) {
        setOrder(response.data.order); // Assuming backend sends { order: {...} }
      } else {
        Alert.alert('Error', 'Failed to load order details.');
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      Alert.alert('Error', 'Could not fetch order details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Details</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
      ) : order ? (
        <>
          <Text style={styles.text}>Order ID: {order.id}</Text>
          <Text style={styles.text}>Date: {order.date}</Text>
          <Text style={styles.text}>Items: {order.items.join(', ')}</Text>
          <Text style={styles.text}>Total: ${order.total.toFixed(2)}</Text>
          <Text
            style={[
              styles.text,
              { color: order.status === 'Delivered' ? '#4CAF50' : '#ff4444' },
            ]}
          >
            Status: {order.status}
          </Text>
        </>
      ) : (
        <Text style={styles.errorText}>Order details not found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
  },
  loader: {
    marginTop: 50,
  },
  errorText: {
    fontSize: 16,
    color: '#ff4444',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default OrderDetails;
