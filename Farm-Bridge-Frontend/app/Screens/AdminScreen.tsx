import React, { useState, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ImageSourcePropType,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { ProductContext } from '../(tabs)/context/ProductContext';
import { ImageLibraryOptions, launchImageLibrary } from 'react-native-image-picker';

type Category = 'Fruits' | 'Vegetables' | 'Grains' | 'Dairy';

const AdminScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { addProduct } = useContext(ProductContext);

  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productQuantity, setProductQuantity] = useState('');
  const [productCategory, setProductCategory] = useState<Category>('Fruits');
  const [productImage, setProductImage] = useState<ImageSourcePropType | null>(null);

  const categories: Category[] = ['Fruits', 'Vegetables', 'Grains', 'Dairy'];

  const handleAddProduct = () => {
    if (!productName || !productDescription || !productPrice || !productQuantity || !productCategory) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
  
    const imageUri = productImage && typeof productImage === 'object' && 'uri' in productImage
      ? productImage.uri
      : null;
  
    const newProduct = {
      id: Math.random().toString(),
      name: productName,
      description: productDescription,
      price: productPrice,
      quantity: productQuantity,
      image: imageUri || null, // Ensure it's string or null
    };
  
    addProduct(productCategory, newProduct);
  
    setProductName('');
    setProductDescription('');
    setProductPrice('');
    setProductQuantity('');
    setProductCategory('Fruits');
    setProductImage(null);
  
    Alert.alert('Success', 'Product added successfully!');
  };
  

  const options: ImageLibraryOptions = {
    mediaType: 'photo', // Use a specific value from the MediaType union type
    quality: 0.8,       // A number between 0 (lowest) and 1 (highest)
  };
  
  const handleImageUpload = () => {
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const imageUri = response.assets[0].uri;
        console.log('Selected Image URI:', imageUri);
      }
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Kisan Dwar</Text>

      {/* Product Name Input */}
      <Text style={styles.label}>Product Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter product name"
        value={productName}
        onChangeText={setProductName}
      />

      {/* Product Description Input */}
      <Text style={styles.label}>Product Description</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter product description"
        value={productDescription}
        onChangeText={setProductDescription}
        multiline
      />

      {/* Product Price Input */}
      <Text style={styles.label}>Product Price</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter product price"
        value={productPrice}
        onChangeText={setProductPrice}
        keyboardType="numeric"
      />

      {/* Product Quantity Input */}
      <Text style={styles.label}>Product Quantity</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter product quantity"
        value={productQuantity}
        onChangeText={setProductQuantity}
        keyboardType="numeric"
      />

      {/* Product Category Section */}
      <Text style={styles.label}>Product Category</Text>
      <View style={styles.categoryContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              productCategory === category && styles.selectedCategoryButton,
            ]}
            onPress={() => setProductCategory(category)}
          >
            <Text
              style={[
                styles.categoryButtonText,
                productCategory === category && styles.selectedCategoryButtonText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Product Image Upload */}
      <Text style={styles.label}>Product Image</Text>
      <TouchableOpacity style={styles.imageUpload} onPress={handleImageUpload}>
        <Text style={styles.imageUploadText}>Upload Image</Text>
      </TouchableOpacity>

      {/* Display the Selected Image */}
      {productImage && (
        <Image
          source={productImage}
          style={styles.productImage}
        />
      )}

      {/* Add Product Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
        <Text style={styles.buttonText}>Add Product</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 40,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  backButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  categoryButton: {
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    padding: 10,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCategoryButton: {
    backgroundColor: '#4CAF50',
  },
  categoryButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  selectedCategoryButtonText: {
    color: '#121212',
  },
  imageUpload: {
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  imageUploadText: {
    color: '#4CAF50',
    fontSize: 16,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdminScreen;
