import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Image, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import axios from 'axios';

const screenWidth = Dimensions.get('window').width;

type Product = {
  id: string;
  name: string;
  price: number;
  image?: string;
};

const ProductScreen = () => {
  const route = useRoute<RouteProp<{ params: { category: string } }, 'params'>>();
  const category = route.params.category;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Products from Backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/product/id/update/:productId/myProducts/get-all/get-product/category/:category`, { withCredentials: true });

      if (response.status === 200) {
        setProducts(response.data.products); // Assuming backend sends { products: [...] }
      } else {
        Alert.alert('Error', 'Failed to load products.');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      Alert.alert('Error', 'Could not fetch products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{category}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item: Product) => item.id}
          renderItem={({ item }: { item: Product }) => (
            <View style={styles.productCard}>
              <Image
                source={item.image ? { uri: item.image } : require('../../assets/images/Placeholder.jpg')}
                style={styles.productImage}
              />
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>₹{item.price}</Text>
            </View>
          )}
          numColumns={2}
          contentContainerStyle={styles.productList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
    textAlign: 'center',
  },
  productCard: {
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    margin: 5,
    padding: 15,
    alignItems: 'center',
    width: (screenWidth - 40) / 2 - 10,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 14,
    color: '#4CAF50',
    marginTop: 5,
  },
  productQuantity: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 5,
  },
  productList: {
    justifyContent: 'space-between',
  },
  loader: {
    marginTop: 50,
  },
});

export default ProductScreen;
