import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Image, ActivityIndicator, Alert, Dimensions, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { getToken } from '../Utils/secureStore.js';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types.js';


const screenWidth = Dimensions.get('window').width;

type Product = {
  id: string;
  name: string;
  price: number;
  image?: string;
  category: string;
};


const ProductScreen = () => {
  const route = useRoute<RouteProp<{ params: { category: string } }, 'params'>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const category = route.params.category;
  console.log(`Category: ${category}`);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Products from Backend
  const fetchProducts = async () => {
    try {
      const token = await getToken();
      console.log(`Sending request with token: ${token}`)
      setLoading(true);
      const response = await axios.get(`${process.env.BASE_URI}/produce/id/myProducts`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });


      if (response.status == 200) {
        // Convert `_id` to `id` and filter by category
        console.log("Inside Response")
        const filteredProducts = response.data
        .map((item: any) => ({
          id: item._id,
          name: item.name,
          price: Number(item.price), // Ensure price is a number
          image: item.image || null,
          category: item.category, // Add this line
        }))
      .filter((item: Product) => item.category === category);

          console.log('Filtered Products:', filteredProducts);
          console.log(`Filtered Response: ${JSON.stringify(filteredProducts)}`)

          // Set the filtered products to the state
          setProducts(filteredProducts);
  

        setProducts(filteredProducts);
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

  const handleProductClick = (productId: string) => {
    navigation.navigate('ProductDetails', { productId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{category}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
      ) : products.length === 0 ? (
        <Text style={styles.noProductsText}>No products found in this category.</Text>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item: Product) => item.id}
          renderItem={({ item }: { item: Product }) => (
<TouchableOpacity onPress={() => handleProductClick(item.id)} style={styles.productCard}>
              <Image
                source={item.image ? { uri: item.image } : require('../../assets/images/Placeholder.jpg')}
                style={styles.productImage}
              />
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>₹{item.price}</Text>
            </TouchableOpacity>
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
  noProductsText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ProductScreen;
