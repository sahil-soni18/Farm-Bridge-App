import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { getToken } from '../Utils/secureStore.js';

const baseUrl = 'http://localhost:3000';

const CartScreen = () => {
  interface CartItem {
    _id: string;
    Product: {
      image: string;
      name: string;
      price: number;
    };
    quantity: number;
  }
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch Cart Items
  const fetchCart = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const response = await axios.get(`${baseUrl}/cart/get-cart`, {
        headers: { 'Authorization': token ? `Bearer ${token}` : '' }
      });
      setCart(response.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
      Alert.alert("Error", "Could not load cart items.");
    }
    setLoading(false);
  };

  // Add to Cart
  const addToCart = async (productId: String) => {
    try {
      const token = await getToken();
      const response = await axios.post(`${baseUrl}/cart/add-to-cart`, { productId, quantity: 1 }, {
        headers: { 'Authorization': token ? `Bearer ${token}` : '' }
      });
      setCart(response.data);
      Alert.alert("Success", "Item added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      Alert.alert("Error", "Failed to add item.");
    }
  };

  // Update Quantity
  const updateQuantity = async (cartId: String, quantity: number) => {
    if (quantity < 1) return;
    try {
      const token = await getToken();
      const response = await axios.put(`${baseUrl}/cart/update-cart/${cartId}`, { quantity }, {
        headers: { 'Authorization': token ? `Bearer ${token}` : '' }
      });
      setCart(response.data);
    } catch (error) {
      console.error("Error updating quantity:", error);
      Alert.alert("Error", "Failed to update quantity.");
    }
  };

  // Remove Item
  const removeItem = async (cartId: String) => {
    try {
      const token = await getToken();
      const response = await axios.delete(`${baseUrl}/cart/delete-cart/${cartId}`, {
        headers: { 'Authorization': token ? `Bearer ${token}` : '' }
      });
      setCart(response.data);
    } catch (error) {
      console.error("Error removing item:", error);
      Alert.alert("Error", "Failed to remove item.");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cart</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : (
        <FlatList
          data={cart}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.cartItem}>
              <Image source={{ uri: item.Product.image }} style={styles.productImage} />
              <View style={styles.detailsContainer}>
                <Text style={styles.productName}>{item.Product.name}</Text>
                <Text style={styles.productPrice}>${item.Product.price}</Text>
                <View style={styles.quantityControls}>
                  <TouchableOpacity onPress={() => updateQuantity(item._id, item.quantity - 1)} style={styles.quantityButton}>
                    <Text style={styles.quantityButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <TouchableOpacity onPress={() => updateQuantity(item._id, item.quantity + 1)} style={styles.quantityButton}>
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => removeItem(item._id)} style={styles.removeButton}>
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>Your cart is empty.</Text>}
        />
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
    color: '#4CAF50',
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
