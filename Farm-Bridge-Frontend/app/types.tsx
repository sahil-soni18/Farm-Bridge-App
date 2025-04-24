export type RootStackParamList = {
  Login: undefined;  // Login screen, no parameters expected
  Register: undefined;  // Register screen, no parameters
  Home: undefined;   // Home screen, no parameters expected
  Admin: undefined;  // Admin screen, no parameters expected
  Product: { category?: string }; // Product screen, optional 'category' parameter
  ExploreProducts: undefined;
  ProductDetails: { productId?: string }; // Product details screen, requires 'productId' parameter
  Cart: undefined;
  Profile: undefined;  // Profile screen, no parameters expected
  OrderHistory: undefined;
  OrderDetails: { orderId?: string };
  ChatScreen: undefined;
  OrderStatus: { orderId?: string }; // Order status screen, requires 'orderId' parameter
  Payment: undefined; // Payment screen, no parameters expected
};
