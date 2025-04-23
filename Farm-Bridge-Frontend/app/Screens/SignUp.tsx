import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Switch,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import BASE_URI from '../../Environment';

import { saveToken } from "../Utils/secureStore";
const SignUpScreen = ({ navigation }: any) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFarmer, setIsFarmer] = useState(false);
  const [farmLocation, setFarmLocation] = useState("");
  const [productsGrown, setProductsGrown] = useState("");

  const handleSignUp = async () => {
    const userData = {
      name,
      email,
      password,
      isFarmer,
      ...(isFarmer && { farm_location: farmLocation, products_grown: productsGrown }),
    };
  
    try {
      const response = await fetch(`${BASE_URI}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        // Handle error response
        alert(result.error || "Signup failed! Please try again.");
        return;
      }
      // Save the access token to AsyncStorage
      await saveToken(result.access_token);
  
      // Handle successful signup
      alert(result.message || "Signup successful!");
      navigation.navigate("Home"); // Navigate to Home screen after successful signup
    } catch (error) {
      console.error("Signup error:", error);
      alert("An error occurred. Please try again later.");
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join us and start exploring!</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#aaa"
      />
      <View style={styles.switchContainer}>
        <Text style={styles.label}>Are you a farmer?</Text>
        <Switch
          value={isFarmer}
          onValueChange={setIsFarmer}
          thumbColor={isFarmer ? "#4caf50" : "#ccc"}
          trackColor={{ false: "#ccc", true: "#8bc34a" }}
        />
      </View>
      {isFarmer && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Farm Location"
            value={farmLocation}
            onChangeText={setFarmLocation}
            placeholderTextColor="#aaa"
          />
          <TextInput
            style={styles.input}
            placeholder="Products Grown (e.g., Wheat, Rice)"
            value={productsGrown}
            onChangeText={setProductsGrown}
            placeholderTextColor="#aaa"
          />
        </>
      )}
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.loginLink}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.loginText}>Already have an account? Login here</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#aaa",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#1e1e1e",
    color: "#fff",
    padding: 12,
    marginVertical: 10,
    borderRadius: 8,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    color: "#fff",
  },
  button: {
    backgroundColor: "#6200ee",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  loginLink: {
    marginTop: 10,
    alignItems: "center",
  },
  loginText: {
    fontSize: 14,
    color: "#6200ee",
    textDecorationLine: "underline",
  },
});

export default SignUpScreen;
