import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: { uri: string } | number; // Supports both remote and local images
};

const CartScreen: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Fetch Cart Items
const fetchCart = async () => {
  try {
    const response = await axios.get("http://localhost:3000/cart/get-cart", {
      withCredentials: true, // Sends cookies with the request
    });

    // Update the cart state with the fetched items
    setCart(response.data); // Backend sends `cartItems` directly
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching cart:", error.response?.data || error.message);
    } else {
      console.error("Error fetching cart:", error);
    }
    Alert.alert("Error", "Could not load cart items. Please try again.");
  }
};


// Update Quantity
const updateQuantity = async (cartId: string, quantity: number) => {
  try {
      const response = await axios.put(
          `http://localhost:3000/cart/update-cart/${cartId}`,
          { quantity },
          { withCredentials: true }
      );

      if (response.status !== 200) {
        Alert.alert('Error', 'Failed to update quantity. Please try again.');
        return;
      }

      // Assuming the backend returns all cart items
      setCart((prevCart) =>
          prevCart.map((item) =>
              item.id === cartId ? { ...item, quantity } : item
          )
      );

      Alert.alert('Success', 'Item quantity updated.');
  } catch (error) {
      console.error('Error updating quantity:', error);
      Alert.alert('Error', 'Failed to update item quantity.');
  }
};

const handleUpdateQuantity = async (cartId: string, increment: boolean) => {
  const newQuantity = (cart.find((item) => item.id === cartId)?.quantity ?? 0) + (increment ? 1 : -1);
  if (newQuantity < 1) {
      Alert.alert('Error', 'Quantity cannot be less than 1.');
      return;
  }
  await updateQuantity(cartId, newQuantity);
};



  // Remove Item
  const removeItem = async (cartId: string) => {
    try {
        const response = await axios.delete(
            `http://localhost:3000/cart/delete-cart/${cartId}`,
            { withCredentials: true }
        );

        // Update cart state with updated items from the backend
        setCart(response.data.cartItems);

        Alert.alert('Success', 'Item removed from cart.');
    } catch (error) {
        console.error('Error removing item:', error);

        const errorMessage = axios.isAxiosError(error) ? error.response?.data?.message || 'Failed to remove item.' : 'Failed to remove item.';
        Alert.alert('Error', errorMessage);
    }
};


  // Handle Checkout
  const handleCheckout = () => {
    Alert.alert('Checkout', 'Proceeding to checkout!');
  };

  // Calculate Total
  const calculateTotal = (): number => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  useEffect(() => {
    fetchCart();
  }, []);

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
              <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
              <View style={styles.quantityControls}>
              <TouchableOpacity
    onPress={() => handleUpdateQuantity(item.id, false)}
    style={styles.quantityButton}
>
    <Text style={styles.quantityButtonText}>-</Text>
</TouchableOpacity>
<Text style={styles.quantityText}>{item.quantity}</Text>
<TouchableOpacity
    onPress={() => handleUpdateQuantity(item.id, true)}
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
        ListEmptyComponent={<Text style={styles.emptyText}>Your cart is empty.</Text>}
      />
      {cart.length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.totalText}>Total: ${calculateTotal().toFixed(2)}</Text>
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
