import React, { useContext, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Image, Dimensions } from 'react-native';
import { ProductContext } from '../(tabs)/context/ProductContext'; // Adjust the path as needed
import { RouteProp, useRoute } from '@react-navigation/native';
import { imageMapping } from './AdminScreen'; // Adjust the path as needed

const screenWidth = Dimensions.get('window').width;

const ProductScreen = () => {
  const { products } = useContext(ProductContext);
  const route = useRoute<RouteProp<{ params: { category: string } }, 'params'>>();
  const category = route.params.category;

  const categoryProducts = products[category] || []; // Safely access the products of the selected category
  useEffect(() => {
    console.log("Category Products: " + JSON.stringify(categoryProducts));
    console.log("Image URI: " , "../../assets/images/apple.jpg")
  }, [products])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{category}</Text>
      <FlatList
        data={categoryProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            {item.image ? (
              <Image
                source={imageMapping[item.image]}
                style={styles.productImage}
              />
            ) : (
              <Image
                source={require('../../assets/images/Placeholder.jpg')} // Use a placeholder image
                style={styles.productImage}
              />
            )}
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>₹{item.price}</Text>
            <Text style={styles.productQuantity}>{item.quantity}</Text>
          </View>
        )}
        numColumns={2}
        contentContainerStyle={styles.productList}
      />
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
});

export default ProductScreen;
