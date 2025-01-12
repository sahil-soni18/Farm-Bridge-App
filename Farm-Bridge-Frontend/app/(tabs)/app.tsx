import React from 'react';
import { ProductProvider } from './context/ProductContext'; // Adjust the path as needed
import AppNavigator from '../(tabs)/navigation/AppNavigator'; // Adjust the path as needed

const App = () => {
  return (
    <ProductProvider>
      <AppNavigator />
    </ProductProvider>
  );
};

export default App;