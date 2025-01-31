import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import axios from 'axios';

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

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch Product Details
  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/product/id/update/:productId/myProducts/get-all/get-product/category/:category`, { withCredentials: true });

      if (response.status === 200) {
        setProduct(response.data.product);
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
      const response = await axios.post(`http://localhost:3000/api/orders`, {
        productId: product?.id,
        quantity: 1, // You can allow the user to select quantity
      });

      if (response.status === 201) {
        Alert.alert('Success', 'Order placed successfully!');
      } else {
        Alert.alert('Error', 'Failed to place order.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Error', 'Could not place order.');
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
