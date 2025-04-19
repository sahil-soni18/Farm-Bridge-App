
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios';

type Product = {
  id: string;
  name: string;
  price: number;
  image?: string;
  category: string;
};

const baseUrl = 'http://localhost:3000';

const ExploreProductsScreen: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<'priceAsc' | 'priceDesc' | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sortOption]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${baseUrl}/produce/get-all`);
      if (response.data && Array.isArray(response.data)) {
        setProducts(
          response.data.map((product) => ({
            id: product._id,
            name: product.name,
            price: parseFloat(product.price),
            category: product.category,
            image: product.image || 'https://via.placeholder.com/150', // Placeholder if no image
          }))
        );
      } else {
        throw new Error('Invalid data format received');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = useCallback(() => {
    let filteredProducts = [...products];

    if (search) {
      filteredProducts = filteredProducts.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedCategory) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (sortOption) {
      filteredProducts = filteredProducts.slice().sort((a, b) =>
        sortOption === 'priceAsc' ? a.price - b.price : b.price - a.price
      );
    }

    return filteredProducts;
  }, [products, search, selectedCategory, sortOption]);

  if (loading) {
    return <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 50 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore Farm Products</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search products..."
        placeholderTextColor="#888"
        value={search}
        onChangeText={setSearch}
      />

      {error && <Text style={styles.errorText}>{error}</Text>}

      <FlatList
        data={filterAndSortProducts()}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>${item.price}</Text>
            <Text style={styles.productCategory}>{item.category}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No products found.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#121212' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#4CAF50' },
  searchInput: {
    backgroundColor: '#1E1E1E',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
    color: '#fff',
  },
  productItem: {
    padding: 16,
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  productName: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  productPrice: { fontSize: 16, color: '#007BFF' },
  productCategory: { fontSize: 14, color: '#aaa' },
  productImage: { width: '100%', height: 150, borderRadius: 8, marginBottom: 8 },
  emptyText: { fontSize: 16, textAlign: 'center', color: '#888' },
  errorText: { fontSize: 16, color: 'red', textAlign: 'center', marginBottom: 16 },
});

export default ExploreProductsScreen;
