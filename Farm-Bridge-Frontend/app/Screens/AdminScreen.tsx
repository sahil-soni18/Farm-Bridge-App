import React, { useState, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import { RootStackParamList } from '../types';

const AdminScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productQuantity, setProductQuantity] = useState('');
  const [productCategory, setProductCategory] = useState('Fruits');

  const categories = ['Fruits', 'Vegetables', 'Grains', 'Dairy'];

  const handleAddProduct = async () => {
    if (!productName || !productDescription || !productPrice || !productQuantity || !productCategory) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const newProduct = {
      name: productName,
      description: productDescription,
      price: parseFloat(productPrice),
      quantity: parseInt(productQuantity),
      category: productCategory,
    };

    try {
      const response = await axios.post('http://localhost:3000/products/create', newProduct, {
        withCredentials: true,
      });

      if (response.status === 201) {
        Alert.alert('Success', 'Product added successfully!');
        setProductName('');
        setProductDescription('');
        setProductPrice('');
        setProductQuantity('');
        setProductCategory('Fruits');
      } else {
        Alert.alert('Error', 'Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      Alert.alert('Error', 'Failed to add product. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Kisan Dwar</Text>

      <Text style={styles.label}>Product Name</Text>
      <TextInput style={styles.input} placeholder="Enter product name" value={productName} onChangeText={setProductName} />

      <Text style={styles.label}>Product Description</Text>
      <TextInput style={styles.input} placeholder="Enter product description" value={productDescription} onChangeText={setProductDescription} multiline />

      <Text style={styles.label}>Product Price</Text>
      <TextInput style={styles.input} placeholder="Enter product price" value={productPrice} onChangeText={setProductPrice} keyboardType="numeric" />

      <Text style={styles.label}>Product Quantity</Text>
      <TextInput style={styles.input} placeholder="Enter product quantity" value={productQuantity} onChangeText={setProductQuantity} keyboardType="numeric" />

      <Text style={styles.label}>Product Category</Text>
      <View style={styles.categoryContainer}>
        {categories.map((category) => (
          <TouchableOpacity key={category} style={[styles.categoryButton, productCategory === category && styles.selectedCategoryButton]} onPress={() => setProductCategory(category)}>
            <Text style={[styles.categoryButtonText, productCategory === category && styles.selectedCategoryButtonText]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
        <Text style={styles.buttonText}>Add Product</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#121212', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 40 },
  backButton: { alignSelf: 'flex-start', marginBottom: 20 },
  backButtonText: { color: '#4CAF50', fontSize: 16, fontWeight: 'bold' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#4CAF50', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 16, color: '#fff', marginBottom: 8 },
  input: { backgroundColor: '#1e1e1e', borderRadius: 8, padding: 12, fontSize: 16, color: '#fff', marginBottom: 20 },
  categoryContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  categoryButton: { backgroundColor: '#1e1e1e', borderRadius: 8, padding: 10, margin: 5, alignItems: 'center', justifyContent: 'center' },
  selectedCategoryButton: { backgroundColor: '#4CAF50' },
  categoryButtonText: { color: '#fff', fontSize: 14 },
  selectedCategoryButtonText: { color: '#121212' },
  addButton: { backgroundColor: '#4CAF50', borderRadius: 8, padding: 15, alignItems: 'center', marginBottom: 10 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default AdminScreen;