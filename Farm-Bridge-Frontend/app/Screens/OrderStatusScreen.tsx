import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  Alert,
  ScrollView,
  TouchableOpacity,
  TextInput
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { RootStackParamList } from '../types';
import { getToken } from "../Utils/secureStore";
import BASE_URI from '../../Environment';

type OrderDetailsRouteProp = RouteProp<RootStackParamList, 'OrderDetails'>;

interface OrderItem {
  _id: string;
  orderId?: string;
  product_id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  createdAt: string;
  items: OrderItem[];
  total_price: number;
  status: string;
}

const statusSequence = ["ordered", "shipped", "out_for_delivery", "delivered"];
const validStatuses = [...statusSequence, "cancelled", "returned"];

const OrderDetails: React.FC = () => {
  const route = useRoute<RouteProp<{ params: { orderId: string } }, 'params'>>();
  const orderId = route.params?.orderId;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [returnReason, setReturnReason] = useState('');
  const [showReturnForm, setShowReturnForm] = useState(false);

  const fetchOrderDetails = async () => {
    try {
      const token = await getToken();
      setLoading(true);
      const response = await axios.get(`${BASE_URI}/orders/user/orders`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      if (response.status === 200 && orderId !== undefined) {
        const orderData = response.data.orders.find(
          (order: Order) => order?._id === orderId
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

  const updateOrderStatus = async (newStatus: string) => {
    if (!order || !validStatuses.includes(newStatus)) return;

    try {
      setUpdating(true);
      const token = await getToken();
      const response = await axios.patch(
        `${BASE_URI}/orders/${orderId}`,
        { status: newStatus },
        {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
          },
        }
      );

      if (response.status === 200) {
        setOrder({ ...order, status: newStatus });
        Alert.alert('Success', 'Order status updated successfully');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      Alert.alert('Error', 'Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const handleReturn = async () => {
    if (!returnReason.trim()) {
      Alert.alert('Error', 'Please provide a return reason');
      return;
    }

    try {
      setUpdating(true);
      const token = await getToken();
      const response = await axios.post(
        `${BASE_URI}/orders/${orderId}/return`,
        { reason: returnReason },
        {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
          },
        }
      );

      if (response.status === 200) {
        setOrder({ ...order!, status: 'returned' });
        setReturnReason('');
        setShowReturnForm(false);
        Alert.alert('Success', 'Return initiated successfully');
      }
    } catch (error) {
      console.error('Error initiating return:', error);
      Alert.alert('Error', 'Failed to initiate return');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'delivered': return '#4CAF50';
      case 'returned': return '#FF9800';
      case 'cancelled': return '#F44336';
      case 'out_for_delivery': return '#2196F3';
      case 'shipped': return '#673AB7';
      default: return '#9E9E9E';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const canAdvanceStatus = () => {
    if (!order) return false;
    const currentIndex = statusSequence.indexOf(order.status.toLowerCase());
    return currentIndex < statusSequence.length - 1;
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Order details not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Order Details</Text>

      <View style={styles.card}>
        <Text style={styles.text}>Order ID: {order._id}</Text>
        <Text style={styles.text}>Date: {new Date(order.createdAt).toLocaleString()}</Text>
        <Text style={styles.text}>Total: ₹{order.total_price.toFixed(2)}</Text>
        
        <View style={styles.statusContainer}>
          <Text style={styles.text}>Status: </Text>
          <View style={[
            styles.statusBadge, 
            { backgroundColor: getStatusColor(order.status) }
          ]}>
            <Text style={styles.statusText}>{getStatusLabel(order.status)}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Items</Text>
      {order.items.map((item) => (
        <View key={item._id} style={styles.itemCard}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDetail}>Quantity: {item.quantity}</Text>
          <Text style={styles.itemDetail}>Price: ₹{item.price.toFixed(2)}</Text>
          <Text style={styles.itemDetail}>Subtotal: ₹{(item.price * item.quantity).toFixed(2)}</Text>
        </View>
      ))}

      {order.status.toLowerCase() === 'delivered' && !showReturnForm && (
        <TouchableOpacity
          style={styles.returnButton}
          onPress={() => setShowReturnForm(true)}
          disabled={updating}
        >
          <Text style={styles.buttonText}>Initiate Return</Text>
        </TouchableOpacity>
      )}

      {showReturnForm && (
        <View style={styles.returnForm}>
          <TextInput
            style={styles.input}
            placeholder="Reason for return"
            value={returnReason}
            onChangeText={setReturnReason}
            multiline
            numberOfLines={3}
          />
          <View style={styles.formButtons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                setShowReturnForm(false);
                setReturnReason('');
              }}
              disabled={updating}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleReturn}
              disabled={updating || !returnReason.trim()}
            >
              <Text style={styles.buttonText}>
                {updating ? 'Processing...' : 'Submit Return'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {order.status.toLowerCase() !== 'delivered' && 
       order.status.toLowerCase() !== 'cancelled' && 
       order.status.toLowerCase() !== 'returned' && (
        <View style={styles.statusControls}>
          {canAdvanceStatus() && (
            <TouchableOpacity
              style={[styles.button, styles.nextStatusButton]}
              onPress={() => {
                const currentIndex = statusSequence.indexOf(order.status.toLowerCase());
                updateOrderStatus(statusSequence[currentIndex + 1]);
              }}
              disabled={updating}
            >
              <Text style={styles.buttonText}>
                {updating ? 'Updating...' : 'Mark as ' + 
                 getStatusLabel(statusSequence[statusSequence.indexOf(order.status.toLowerCase()) + 1])}
              </Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[styles.button, styles.cancelOrderButton]}
            onPress={() => updateOrderStatus('cancelled')}
            disabled={updating}
          >
            <Text style={styles.buttonText}>
              {updating ? 'Processing...' : 'Cancel Order'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {order.status.toLowerCase() === 'returned' && (
        <View style={styles.returnNotice}>
          <Text style={styles.returnNoticeText}>This order has been returned</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  text: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  loader: {
    marginTop: 32,
  },
  errorText: {
    fontSize: 16,
    color: '#F44336',
    textAlign: 'center',
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginVertical: 12,
  },
  itemCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  itemDetail: {
    fontSize: 14,
    color: '#BDBDBD',
    marginBottom: 4,
  },
  statusControls: {
    marginTop: 16,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  nextStatusButton: {
    backgroundColor: '#2196F3',
  },
  cancelOrderButton: {
    backgroundColor: '#F44336',
  },
  returnButton: {
    backgroundColor: '#FF9800',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  returnForm: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#2D2D2D',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    marginBottom: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    flex: 1,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#757575',
    flex: 1,
    marginRight: 8,
  },
  returnNotice: {
    backgroundColor: '#FF9800',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    alignItems: 'center',
  },
  returnNoticeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default OrderDetails;