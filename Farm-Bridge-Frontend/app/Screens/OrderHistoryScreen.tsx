import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { RootStackParamList } from '../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getToken } from '../Utils/secureStore.js';

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


const OrderHistory = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Order History from Backend
  const fetchOrders = async () => {
    try {
      const token = await getToken();
      setLoading(true);
      const response = await axios.get(`${process.env.BASE_URI}/orders/user/orders`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      if (response.status === 200) {
        setOrders(response.data.orders); // Assuming backend sends orders in { orders: [...] }
      } else {
        Alert.alert('Error', 'Failed to load orders. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      Alert.alert('Error', 'Could not fetch order history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const renderOrderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => navigation.navigate('OrderDetails', { orderId: item._id })}
    >
      <Text style={styles.orderDate}>{new Date(item.createdAt).toLocaleString()}</Text>
      <Text style={styles.orderItems}>{item.items.map((i) => i.name).join(', ')}</Text>
      <Text style={styles.orderTotal}>Total: ₹{item.total_price}</Text>
      <Text style={[styles.orderStatus, { color: item.status === 'Delivered' ? '#4CAF50' : '#ff4444' }]}>
        {item.status}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Order History</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
      ) : orders.length === 0 ? (
        <Text style={styles.emptyText}>No orders found.</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          renderItem={renderOrderItem}
          contentContainerStyle={styles.orderList}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  orderList: {
    paddingBottom: 20,
  },
  orderCard: {
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  orderDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  orderItems: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 5,
  },
  orderTotal: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 5,
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  loader: {
    marginTop: 50,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#aaa',
    marginTop: 20,
  },
});

export default OrderHistory;
