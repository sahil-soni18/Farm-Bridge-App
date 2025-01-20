import React, { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: any; // For local images, use `require`. For remote, use `{ uri: 'url' }`
};

const initialCart: CartItem[] = [
  {
    id: '1',
    name: 'Apple',
    price: 3,
    quantity: 2,
    image: require('../../assets/images/apple.jpg'),
  },
  {
    id: '2',
    name: 'Banana',
    price: 1,
    quantity: 5,
    image: require('../../assets/images/banana.jpg'),
  },
];

const CartScreen: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>(initialCart);

  const updateQuantity = (id: string, increment: boolean) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + (increment ? 1 : -1) }
          : item
      ).filter((item) => item.quantity > 0) // Remove items with zero quantity
    );
  };

  const removeItem = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const handleCheckout = () => {
    Alert.alert('Checkout', 'Proceeding to checkout!');
  };

  const calculateTotal = (): number => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cart</Text>

      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Image source={item.image} style={styles.productImage} />
            <View style={styles.detailsContainer}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>${item.price}</Text>
              <View style={styles.quantityControls}>
                <TouchableOpacity
                  onPress={() => updateQuantity(item.id, false)}
                  style={styles.quantityButton}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{item.quantity}</Text>
                <TouchableOpacity
                  onPress={() => updateQuantity(item.id, true)}
                  style={styles.quantityButton}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => removeItem(item.id)}
                style={styles.removeButton}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Your cart is empty.</Text>
        }
      />

      {cart.length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.totalText}>Total: ${calculateTotal()}</Text>
          <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
            <Text style={styles.checkoutButtonText}>Checkout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1c', // Dark theme
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#2c2c2c',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  productImage: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
    borderRadius: 8,
    marginRight: 16,
  },
  detailsContainer: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 8,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  quantityButton: {
    backgroundColor: '#ffaa00',
    borderRadius: 4,
    padding: 8,
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  quantityText: {
    fontSize: 16,
    color: '#fff',
    marginHorizontal: 8,
  },
  removeButton: {
    marginTop: 8,
  },
  removeButtonText: {
    color: '#ff6666',
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#aaa',
    marginTop: 20,
  },
  footer: {
    backgroundColor: '#2c2c2c',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  checkoutButton: {
    backgroundColor: '#00cc66',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default CartScreen;
