import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Product = {
  id: string;
  name: string;
  description: string;
  price: string;
  quantity: string;
  image: string | null;
};

type ProductContextType = {
  products: { [category: string]: Product[] };
  addProduct: (category: string, product: Product) => void;
  removeProduct: (category: string, productId: string) => void;
};

export const ProductContext = createContext<ProductContextType>({
  products: {},
  addProduct: () => {},
  removeProduct: () => {},
});

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<ProductContextType['products']>({});

  const loadProducts = async () => {
    const savedProducts = await AsyncStorage.getItem('products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
  };

  const saveProducts = async (newProducts: ProductContextType['products']) => {
    await AsyncStorage.setItem('products', JSON.stringify(newProducts));
  };

  const addProduct = (category: string, product: Product) => {
    setProducts((prevProducts) => {
      const updatedProducts = {
        ...prevProducts,
        [category]: [...(prevProducts[category] || []), product],
      };
      console.log("Updated Products: " + updatedProducts);
      saveProducts(updatedProducts);
      return updatedProducts;
    });
  };

  const removeProduct = (category: string, productId: string) => {
    setProducts((prevProducts) => {
      const updatedProducts = {
        ...prevProducts,
        [category]: (prevProducts[category] || []).filter((p) => p.id !== productId),
      };
      saveProducts(updatedProducts);
      return updatedProducts;
    });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <ProductContext.Provider value={{ products, addProduct, removeProduct }}>
      {children}
    </ProductContext.Provider>
  );
};
