import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';

const API_BASE_URL = "http://localhost:3000/cart";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: any; // Adjust the type according to your image source
}

const CartScreen: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch Cart Items
  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/cart/get-cart`, { withCredentials: true });
      setCart(response.data.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
      Alert.alert("Error", "Could not load cart items.");
    }
    setLoading(false);
  };

  // Add to Cart
  interface AddToCartResponse {
    data: CartItem[];
  }

  const addToCart = async (productId: string): Promise<void> => {
    try {
      const response = await axios.post<AddToCartResponse>(`http://localhost:3000/cart//add-to-cart`, { productId, quantity: 1 }, { withCredentials: true });
      setCart(response.data.data);
      Alert.alert("Success", "Item added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      Alert.alert("Error", "Failed to add item.");
    }
  };

  // Update Quantity
  interface UpdateQuantityResponse {
    data: CartItem[];
  }

  const updateQuantity = async (cartId: string, quantity: number): Promise<void> => {
    if (quantity < 1) return;
    try {
      const response = await axios.put<UpdateQuantityResponse>(`http://localhost:3000/cart/update-cart/${cartId}`, { quantity }, { withCredentials: true });
      setCart(response.data.data);
    } catch (error) {
      console.error("Error updating quantity:", error);
      Alert.alert("Error", "Failed to update quantity.");
    }
  };

  // Remove Item
  const removeItem = async (cartId: string): Promise<void> => {
    try {
      const response = await axios.delete<{ data: CartItem[] }>(`http://localhost:3000/cart/delete-cart/${cartId}`, { withCredentials: true });
      setCart(response.data.data);
    } catch (error) {
      console.error("Error removing item:", error);
      Alert.alert("Error", "Failed to remove item.");
    }
  };

  // Checkout
  const handleCheckout = async () => {
    try {
      const response = await axios.post(`http://localhost:3000/cart/checkout`, {}, { withCredentials: true });
      Alert.alert("Success", "Checkout completed!");
      setCart([]);
    } catch (error) {
      console.error("Error during checkout:", error);
      Alert.alert("Error", "Checkout failed.");
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
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.cartItem}>
              <Image source={item.image} style={styles.productImage} />
              <View style={styles.detailsContainer}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
                <View style={styles.quantityControls}>
                  <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity - 1)} style={styles.quantityButton}>
                    <Text style={styles.quantityButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity + 1)} style={styles.quantityButton}>
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.removeButton}>
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>Your cart is empty.</Text>}
        />
      )}
      {cart.length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.totalText}>Total: ${cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</Text>
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
