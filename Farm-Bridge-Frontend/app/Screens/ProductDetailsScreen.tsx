import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { getToken } from '../Utils/secureStore.js';

import BASE_URI from '../../Environment';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  seller: string;
  image: string;
};


const ProductDetailsScreen: React.FC = () => {
  const route = useRoute<RouteProp<{ params: { productId: string } }, 'params'>>();
  const productId = route.params.productId;
  console.log( `ProductId: ${productId}` );
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState<number>(1); // Default to 1

  // Fetch Product Details
  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await axios.get(`${BASE_URI}/produce/products/${productId}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      console.log(`Response: ${JSON.stringify(response)}`)

      if (response.status === 200) {
        setProduct(response.data);
      } else {
        Alert.alert('Error', 'Failed to load product details.');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      Alert.alert('Error', 'Could not fetch product details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const handleNegotiate = () => {
    Alert.alert('Negotiation', 'Negotiation process started!');
  };

  const handleOrder = async () => {
    try {
      setLoading(true);
      const token = await getToken();

      // Create the order data using the selected quantity
      const orderData = {
        items: [
          {
            product_id: productId,
            name: product?.name,
            quantity: quantity, 
            price: product?.price,
          },
        ],
        total_price: product ? product.price * quantity : 0, // Multiply price by quantity
      };

      const response = await axios.post(`${BASE_URI}/orders/create-order`, orderData, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      if (response.status === 201) {
        Alert.alert('Success', 'Order placed successfully!');
      } else {
        Alert.alert('Error', 'Failed to place order.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Error', 'Could not place order.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />;
  }

  if (!product) {
    return <Text style={styles.errorText}>Product not found.</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      {/* Product Image */}
      <Image source={product.image ? { uri: product.image } : require('../../assets/images/Placeholder.jpg')} style={styles.productImage} />

      {/* Product Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productDescription}>{product.description}</Text>

        <View style={styles.priceQuantity}>
          <Text style={styles.productPrice}>Price: ₹{product.price}</Text>
          <Text style={styles.productQuantity}>Available: {product.quantity}</Text>
        </View>

        <Text style={styles.sellerDetails}>Seller: {product.seller}</Text>
      </View>

      {/* Quantity Selector */}
      <View style={styles.quantityContainer}>
        <TouchableOpacity 
          onPress={() => setQuantity(prev => prev > 1 ? prev - 1 : 1)} // Decrease quantity
          style={styles.quantityButton}>
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        
        <Text style={styles.quantityText}>{quantity}</Text>
        
        <TouchableOpacity 
          onPress={() => setQuantity(prev => prev + 1)} // Increase quantity
          style={styles.quantityButton}>
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.negotiateButton} onPress={handleNegotiate}>
          <Text style={styles.buttonText}>Negotiate Price</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.orderButton} onPress={handleOrder}>
          <Text style={styles.buttonText}>Order Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1c',
    padding: 16,
  },
  productImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 16,
  },
  detailsContainer: {
    backgroundColor: '#2c2c2c',
    padding: 16,
    borderRadius: 8,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 16,
  },
  priceQuantity: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  productQuantity: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  sellerDetails: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  negotiateButton: {
    backgroundColor: '#ffaa00',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  orderButton: {
    backgroundColor: '#00cc66',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  quantityButton: {
    backgroundColor: '#444',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginHorizontal: 10,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  loader: {
    marginTop: 50,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default ProductDetailsScreen;
