import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

const PaymentScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  const paymentMethods = ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Wallet'];

  const handlePayment = () => {
    if (!selectedMethod) {
      Alert.alert('Select Payment Method', 'Please select a payment method to proceed.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Payment Successful', `Your payment via ${selectedMethod} was successful!`);
      navigation.navigate('OrderHistory');
    }, 2000);
  };

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.header}>Choose Payment Method</Text>

      {paymentMethods.map((method) => (
        <TouchableOpacity
          key={method}
          style={[
            styles.methodCard,
            selectedMethod === method && styles.selectedCard,
          ]}
          onPress={() => setSelectedMethod(method)}
          activeOpacity={0.8}
        >
          <Text style={styles.methodText}>{method}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[styles.payButton, loading && { opacity: 0.7 }]}
        onPress={handlePayment}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.payText}>Pay Now</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
    paddingTop: 50,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
    textAlign: 'center',
  },
  methodCard: {
    backgroundColor: '#1e1e1e',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  selectedCard: {
    borderColor: '#4CAF50',
    borderWidth: 2,
    backgroundColor: '#2c2c2c',
  },
  methodText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  payButton: {
    marginTop: 30,
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  payText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PaymentScreen;
