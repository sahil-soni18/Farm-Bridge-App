import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Define the API base URL
const API_BASE_URL = 'http://localhost:3000';
import { RootStackParamList } from '../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const Profile = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [userDetails, setUserDetails] = useState({
    name: 'Your name',
    email: 'yourname123@gmail.com',
    phone: '+91 1234567890',
    address: '123 Street, City, Country',
  });

  // Fetch user profile from API
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/user/profile`);
      const data = await response.json();

      if (response.ok) {
        setUserDetails(data);
      } else {
        Alert.alert('Error', data.message || 'Failed to fetch profile.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while fetching profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch('http://localhost:3000/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDetails),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Profile updated successfully!');
      } else {
        Alert.alert('Error', data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image source={require('../../assets/images/Profile.jpeg')} style={styles.profileImage} />
        <Text style={styles.profileName}>{userDetails.name}</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={userDetails.name}
          onChangeText={(text) => setUserDetails({ ...userDetails, name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={userDetails.email}
          onChangeText={(text) => setUserDetails({ ...userDetails, email: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone"
          value={userDetails.phone}
          onChangeText={(text) => setUserDetails({ ...userDetails, phone: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={userDetails.address}
          onChangeText={(text) => setUserDetails({ ...userDetails, address: text })}
        />
      </View>

      <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
        <Text style={styles.updateButtonText}>Update Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
//   header: {
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#4CAF50',
//   },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  formContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
  },
  updateButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Profile;
const [loading, setLoading] = useState(false);
