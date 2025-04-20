import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, View, Text, TextInput, TouchableOpacity, 
  Image, Alert, ActivityIndicator 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getToken, removeToken } from "../Utils/secureStore.js";


const Profile = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Fetch user profile from API on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) {
        Alert.alert('Error', 'No token found. Please log in again.');
        navigation.navigate('Login');
        return;
      }
      console.log('Retrieved Token:', token);


      const response = await fetch(`${process.env.BASE_URI}/api/user/get/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
    });
    

      console.log('Response Headers:', response.headers);
  
      const data = await response.json();
  
      if (response.ok) {
        setUserDetails(data.user); // Adjust according to the API response
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
      setUpdating(true);
      const response = await fetch(`${process.env.BASE_URI}/user/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userDetails),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Profile updated successfully!');
      } else {
        Alert.alert('Error', data.message || 'Failed to update profile.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong.');
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await removeToken();
      const response = await fetch(`${process.env.BASE_URI}/api/auth/logout`, {
        method: 'GET', // or 'GET' depending on your backend
        credentials: 'include', // Ensures cookies are sent with the request
      });
  
      const data = await response.json();
  
      if (response.ok) {
        Alert.alert('Success', 'Logged out successfully!');
        navigation.navigate('Login'); // Redirect to login screen
      } else {
        Alert.alert('Error', data.message || 'Failed to logout.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong.');
    }
  };
  
  return (
    <View style={styles.container}>
      {/* Profile Image & Name */}
      <View style={styles.profileContainer}>
        <Image source={require('../../assets/images/Profile.jpeg')} style={styles.profileImage} />
        <Text style={styles.profileName}>{userDetails.name || 'Your Name'}</Text>
      </View>

      {/* User Details Form */}
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

      {/* Update Profile Button */}
      <TouchableOpacity 
        style={[styles.updateButton, updating && styles.disabledButton]} 
        onPress={handleUpdate}
        disabled={updating}
      >
        {updating ? <ActivityIndicator color="#fff" /> : <Text style={styles.updateButtonText}>Update Profile</Text>}
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity 
        style={[styles.logoutButton, loggingOut && styles.disabledButton]} 
        onPress={handleLogout}
        disabled={loggingOut}
      >
        {loggingOut ? <ActivityIndicator color="#fff" /> : <Text style={styles.logoutButtonText}>Logout</Text>}
      </TouchableOpacity>

      {/* Loading Indicator */}
      {loading && <ActivityIndicator size="large" color="#4CAF50" style={styles.loading} />}
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
  disabledButton: {
    opacity: 0.6,
  },
  loading: {
    marginTop: 20,
  },
});

export default Profile;
