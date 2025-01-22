import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const orders = [
  { id: '1', date: '2023-10-01', items: ['Apples', 'Bananas'], total: 25.0, status: 'Delivered' },
  { id: '2', date: '2023-09-28', items: ['Carrots', 'Potatoes'], total: 15.0, status: 'Cancelled' },
  { id: '3', date: '2023-09-25', items: ['Milk', 'Cheese'], total: 20.0, status: 'Pending' },
];

const OrderHistory = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const renderOrderItem = ({ item }: { item: typeof orders[0] }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => navigation.navigate('OrderDetails', { orderId: item.id })}
    >
      <Text style={styles.orderDate}>{item.date}</Text>
      <Text style={styles.orderItems}>{item.items.join(', ')}</Text>
      <Text style={styles.orderTotal}>Total: ${item.total.toFixed(2)}</Text>
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

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrderItem}
        contentContainerStyle={styles.orderList}
      />
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
});

export default OrderHistory;