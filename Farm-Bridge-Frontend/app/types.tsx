export type RootStackParamList = {
  Login: undefined;  // Login screen, no parameters expected
  Register: undefined;  // Register screen, no parameters
  Home: undefined;   // Home screen, no parameters expected
  Admin: undefined;  // Admin screen, no parameters expected
  Product: { category?: string }; // Product screen, optional 'category' parameter
  ExploreProducts: undefined;
  ProductDetails: { productId: string }; // Product details screen, requires 'productId' parameter
};
