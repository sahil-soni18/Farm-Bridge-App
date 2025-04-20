import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import axios from 'axios';
import { RootStackParamList } from '../types';
import { getToken } from "../Utils/secureStore.js";

type OrderDetailsRouteProp = RouteProp<RootStackParamList, 'OrderDetails'>;

interface OrderDetailsProps {
  route: OrderDetailsRouteProp;
}

type OrderItem = {
  _id: string;
  order_id: string;
  product_id: string;
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  _id: string;
  createdAt: string;
  items: OrderItem[];
  total_price: number;
  status: string;
};


const OrderDetails = ({ route }: OrderDetailsProps) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch Order Details from Backend
  const fetchOrderDetails = async () => {
    try {
      const token = await getToken();
      setLoading(true);
      const response = await axios.get(`${process.env.BASE_URI}/orders/user/orders`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      if (response.status === 200) {
        // Find the order matching the orderId
        const orderData = response.data.orders.find(
          (order: Order) => order._id === orderId
        );
        if (orderData) {
          setOrder(orderData);
        } else {
          Alert.alert('Error', 'Order not found.');
        }
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
  }, [orderId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Details</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
      ) : order ? (
        <>
          <Text style={styles.text}>Order ID: {order._id}</Text>
          <Text style={styles.text}>Date: {new Date(order.createdAt).toLocaleString()}</Text>
          <Text style={styles.text}>Total: ₹{order.total_price}</Text>
          <Text
            style={[
              styles.text,
              { color: order.status === 'Delivered' ? '#4CAF50' : '#ff4444' },
            ]}
          >
            Status: {order.status}
          </Text>

          <Text style={styles.subtitle}>Items:</Text>
          {order.items.map((item) => (
            <View key={item._id} style={styles.itemContainer}>
              <Text style={styles.text}>Name: {item.name}</Text>
              <Text style={styles.text}>Quantity: {item.quantity}</Text>
              <Text style={styles.text}>Price: ₹{item.price}</Text>
            </View>
          ))}
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
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  itemContainer: {
    backgroundColor: '#1e1e1e',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
});

export default OrderDetails;
