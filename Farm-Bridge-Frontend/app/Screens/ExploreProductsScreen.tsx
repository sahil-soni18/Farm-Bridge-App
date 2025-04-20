// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   TextInput,
//   Image,
// } from 'react-native';


// type Product = {
//   id: string;
//   name: string;
//   price: number;
//   category: string;
//   image: string; // URL for the product image
// };

// const PRODUCTS: Product[] = [
//   { id: '1', name: 'Apple', price: 3, category: 'Fruits', image: require('../../assets/images/Fruits.jpeg') },
//   { id: '2', name: 'Banana', price: 1, category: 'Fruits', image: require('../../assets/images/Fruits.jpeg')},
//   { id: '3', name: 'Rice', price: 10, category: 'Grains', image: 'https://example.com/rice.png' },
//   { id: '4', name: 'Wheat', price: 12, category: 'Grains', image: 'https://example.com/wheat.png' },
//   { id: '5', name: 'Carrot', price: 2, category: 'Vegetables', image: require('../../assets/images/Vegies.jpeg') },
//   { id: '6', name: 'Broccoli', price: 4, category: 'Vegetables', image: 'https://example.com/broccoli.png' },
//   { id: '7', name: 'Milk', price: 5, category: 'Dairy', image: 'https://example.com/milk.png' },
//   { id: '8', name: 'Cheese', price: 8, category: 'Dairy', image: 'https://example.com/cheese.png' },
// ];

// const ExploreProductsScreen: React.FC = () => {
//   const [search, setSearch] = useState<string>('');
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
//   const [sortOption, setSortOption] = useState<'priceAsc' | 'priceDesc' | null>(null);

//   const categories = Array.from(
//     new Set(PRODUCTS.map((product) => product.category))
//   );

//   const filterAndSortProducts = (): Product[] => {
//     let filteredProducts = PRODUCTS;

//     if (search) {
//       filteredProducts = filteredProducts.filter((product) =>
//         product.name.toLowerCase().includes(search.toLowerCase())
//       );
//     }

//     if (selectedCategory) {
//       filteredProducts = filteredProducts.filter(
//         (product) => product.category === selectedCategory
//       );
//     }

//     if (sortOption === 'priceAsc') {
//       filteredProducts.sort((a, b) => a.price - b.price);
//     } else if (sortOption === 'priceDesc') {
//       filteredProducts.sort((a, b) => b.price - a.price);
//     }

//     return filteredProducts;
//   };

//   const handleCategorySelect = (category: string | null) => {
//     setSelectedCategory(category);
//   };

//   const handleSort = (option: 'priceAsc' | 'priceDesc') => {
//     setSortOption(option);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Explore Farm Products</Text>

//       {/* Search Bar */}
//       <TextInput
//         style={styles.searchInput}
//         placeholder="Search products..."
//         placeholderTextColor="#888"
//         value={search}
//         onChangeText={setSearch}
//       />

//       {/* Filters */}
//       <View style={styles.filters}>
//         <View style={styles.categoryFilter}>
//           <Text style={styles.filterTitle}>Categories:</Text>
//           <FlatList
//             horizontal
//             data={categories}
//             keyExtractor={(item) => item}
//             renderItem={({ item }) => (
//               <TouchableOpacity
//                 style={[
//                   styles.filterButton,
//                   selectedCategory === item && styles.activeFilterButton,
//                 ]}
//                 onPress={() =>
//                   handleCategorySelect(selectedCategory === item ? null : item)
//                 }
//               >
//                 <Text
//                   style={[
//                     styles.filterButtonText,
//                     selectedCategory === item && styles.activeFilterButtonText,
//                   ]}
//                 >
//                   {item}
//                 </Text>
//               </TouchableOpacity>
//             )}
//           />
//         </View>

//         <View style={styles.sortFilter}>
//           <Text style={styles.filterTitle}>Sort by:</Text>
//           <TouchableOpacity
//             style={[
//               styles.filterButton,
//               sortOption === 'priceAsc' && styles.activeFilterButton,
//             ]}
//             onPress={() => handleSort('priceAsc')}
//           >
//             <Text
//               style={[
//                 styles.filterButtonText,
//                 sortOption === 'priceAsc' && styles.activeFilterButtonText,
//               ]}
//             >
//               Price ↑
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[
//               styles.filterButton,
//               sortOption === 'priceDesc' && styles.activeFilterButton,
//             ]}
//             onPress={() => handleSort('priceDesc')}
//           >
//             <Text
//               style={[
//                 styles.filterButtonText,
//                 sortOption === 'priceDesc' && styles.activeFilterButtonText,
//               ]}
//             >
//               Price ↓
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Product List */}
//       <FlatList
//         data={filterAndSortProducts()}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <View style={styles.productItem}>
//             <Image source={{ uri: item.image }} style={styles.productImage} />
//             {/* <Image source={item.image} style={styles.productImage} /> */}
//             <View>
//               <Text style={styles.productName}>{item.name}</Text>
//               <Text style={styles.productPrice}>${item.price}</Text>
//               <Text style={styles.productCategory}>{item.category}</Text>
//             </View>
//           </View>
//         )}
//         ListEmptyComponent={
//           <Text style={styles.emptyText}>No products found.</Text>
//         }
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16, backgroundColor: '#121212' },
//   title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#fff' },
//   searchInput: {
//     backgroundColor: '#1E1E1E',
//     padding: 10,
//     borderRadius: 8,
//     marginBottom: 16,
//     fontSize: 16,
//     borderWidth: 1,
//     borderColor: '#333',
//     color: '#fff',
//   },
//   filters: { marginBottom: 16 },
//   filterTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#fff' },
//   categoryFilter: {
//     flexDirection: 'row',
//     marginBottom: 16,
//   },
//   sortFilter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   filterButton: {
//     padding: 8,
//     backgroundColor: '#333',
//     borderRadius: 8,
//     marginRight: 8,
//   },
//   activeFilterButton: { backgroundColor: '#007BFF' },
//   filterButtonText: { fontSize: 14, color: '#ccc' },
//   activeFilterButtonText: { color: '#fff' },
//   productItem: {
//     padding: 16,
//     backgroundColor: '#1E1E1E',
//     borderRadius: 8,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: '#333',
//   },
//   productName: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
//   productPrice: { fontSize: 16, color: '#007BFF' },
//   productCategory: { fontSize: 14, color: '#aaa' },
//   productImage: { width: '100%', height: 150, borderRadius: 8, marginBottom: 8 },
//   emptyText: { fontSize: 16, textAlign: 'center', color: '#888' },
// });


// export default ExploreProductsScreen;

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

const baseUrl = 'http://192.168.29.189:3000';
    // const baseUrl = 'http://192.168.5.147:3000'


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
