// app/index.tsx
import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import Home from '../home'; 

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Home />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
});

export default App;
