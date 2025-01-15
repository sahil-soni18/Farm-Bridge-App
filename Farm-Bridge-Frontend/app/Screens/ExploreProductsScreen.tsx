import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';

type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
};

const PRODUCTS: Product[] = [
  { id: '1', name: 'Laptop', price: 1200, category: 'Electronics' },
  { id: '2', name: 'Smartphone', price: 800, category: 'Electronics' },
  { id: '3', name: 'Shoes', price: 150, category: 'Fashion' },
  { id: '4', name: 'T-shirt', price: 30, category: 'Fashion' },
  { id: '5', name: 'Blender', price: 100, category: 'Home Appliances' },
];

const ExploreProductsScreen: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<'priceAsc' | 'priceDesc' | null>(
    null
  );

  const categories = Array.from(
    new Set(PRODUCTS.map((product) => product.category))
  );

  const filterAndSortProducts = (): Product[] => {
    let filteredProducts = PRODUCTS;

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

    if (sortOption === 'priceAsc') {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'priceDesc') {
      filteredProducts.sort((a, b) => b.price - a.price);
    }

    return filteredProducts;
  };

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
  };

  const handleSort = (option: 'priceAsc' | 'priceDesc') => {
    setSortOption(option);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore Products</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search products..."
        value={search}
        onChangeText={setSearch}
      />

      {/* Filters */}
      <View style={styles.filters}>
        <View style={styles.categoryFilter}>
          <Text style={styles.filterTitle}>Categories:</Text>
          <FlatList
            horizontal
            data={categories}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  selectedCategory === item && styles.activeFilterButton,
                ]}
                onPress={() =>
                  handleCategorySelect(selectedCategory === item ? null : item)
                }
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    selectedCategory === item && styles.activeFilterButtonText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        <View style={styles.sortFilter}>
          <Text style={styles.filterTitle}>Sort by:</Text>
          <TouchableOpacity
            style={[
              styles.filterButton,
              sortOption === 'priceAsc' && styles.activeFilterButton,
            ]}
            onPress={() => handleSort('priceAsc')}
          >
            <Text
              style={[
                styles.filterButtonText,
                sortOption === 'priceAsc' && styles.activeFilterButtonText,
              ]}
            >
              Price ↑
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              sortOption === 'priceDesc' && styles.activeFilterButton,
            ]}
            onPress={() => handleSort('priceDesc')}
          >
            <Text
              style={[
                styles.filterButtonText,
                sortOption === 'priceDesc' && styles.activeFilterButtonText,
              ]}
            >
              Price ↓
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Product List */}
      <FlatList
        data={filterAndSortProducts()}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
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
    container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
    searchInput: {
      backgroundColor: '#fff',
      padding: 10,
      borderRadius: 8,
      marginBottom: 16,
      fontSize: 16,
      borderWidth: 1,
      borderColor: '#ddd',
    },
    filters: { marginBottom: 16 },
    filterTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
    categoryFilter: {
      marginBottom: 16,
    },
    sortFilter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 8,
    },
    filterButton: {
      padding: 8,
      backgroundColor: '#ddd',
      borderRadius: 8,
      marginRight: 8,
    },
    activeFilterButton: { backgroundColor: '#007BFF' },
    filterButtonText: { fontSize: 14, color: '#000' },
    activeFilterButtonText: { color: '#fff' },
    productItem: {
      padding: 16,
      backgroundColor: '#fff',
      borderRadius: 8,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: '#ddd',
    },
    productName: { fontSize: 18, fontWeight: 'bold' },
    productPrice: { fontSize: 16, color: '#007BFF' },
    productCategory: { fontSize: 14, color: '#555' },
    emptyText: { fontSize: 16, textAlign: 'center', color: '#888' },
  });
  

export default ExploreProductsScreen;
