import React, { useContext } from 'react';
import { StyleSheet, View, Text, FlatList, Image, Dimensions } from 'react-native';
import { ProductContext } from '../(tabs)/context/ProductContext'; // Adjust the path as needed

const screenWidth = Dimensions.get('window').width;

const FruitsScreen = () => {
  const { products } = useContext(ProductContext); // Access products from context

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fruits</Text>
      <FlatList
        data={products.Fruits} // Display fruits from the global state
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            {item.image ? (
              <Image
                source={{ uri: item.image }} // Ensure image is passed as an object with a `uri` key
                style={styles.productImage}
              />
            ) : (
              <Image
                source={require('../../assets/images/apple.jpg')} // Use a local placeholder image
                style={styles.productImage}
              />
            )}
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>{item.price}</Text>
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

export default FruitsScreen;
