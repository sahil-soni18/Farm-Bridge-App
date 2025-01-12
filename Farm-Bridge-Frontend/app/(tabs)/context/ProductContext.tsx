import React, { createContext, useState, ReactNode } from 'react';

type Category = 'Fruits' | 'Vegetables' | 'Grains' | 'Dairy';

type Product = {
  id: string;
  name: string;
  description: string;
  price: string;
  quantity: string;
  image: string | null;
};

type ProductContextType = {
  products: {
    Fruits: Product[];
    Vegetables: Product[];
    Grains: Product[];
    Dairy: Product[];
  };
  addProduct: (category: Category, product: Product) => void;
};

export const ProductContext = createContext<ProductContextType>({
  products: {
    Fruits: [],
    Vegetables: [],
    Grains: [],
    Dairy: [],
  },
  addProduct: () => {},
});

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<ProductContextType['products']>({
    Fruits: [],
    Vegetables: [],
    Grains: [],
    Dairy: [],
  });

  const addProduct = (category: Category, product: Product) => {
    setProducts((prevProducts) => ({
      ...prevProducts,
      [category]: [...prevProducts[category], product],
    }));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct }}>
      {children}
    </ProductContext.Provider>
  );
};