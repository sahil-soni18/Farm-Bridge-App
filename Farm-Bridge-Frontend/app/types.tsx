export type RootStackParamList = {
  Login: undefined;  // Login screen, no parameters expected
  Home: undefined;   // Home screen, no parameters expected
  Admin: undefined;  // Admin screen, no parameters expected
  Product: { category?: string }; // Product screen, optional 'category' parameter
};
