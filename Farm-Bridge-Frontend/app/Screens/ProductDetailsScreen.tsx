import React from 'react';
import { View, Text, Image, Button, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  seller: string;
  image: any; // For local images, use `require`. For remote, use `{ uri: 'url' }`
};

const product: Product = {
  id: '1',
  name: 'Apple',
  description: 'Fresh and organic apples directly from the farm.',
  price: 3,
  quantity: 50,
  seller: 'John Doe Farms',
  image: require('../../assets/images/Fruits.jpeg'), // Replace with your image
};

const ProductDetailsScreen: React.FC = () => {
  const handleNegotiate = () => {
    alert('Negotiation process started!');
  };

  const handleOrder = () => {
    alert('Order placed successfully!');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Product Image */}
      <Image source={product.image} style={styles.productImage} />

      {/* Product Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productDescription}>{product.description}</Text>

        <View style={styles.priceQuantity}>
          <Text style={styles.productPrice}>Price: ${product.price}</Text>
          <Text style={styles.productQuantity}>Quantity: {product.quantity}</Text>
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
    backgroundColor: '#1c1c1c', // Dark theme
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
});

export default ProductDetailsScreen;
