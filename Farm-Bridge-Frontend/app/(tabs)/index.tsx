import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../Screens/Login';
import HomeScreen from '../Screens/home';
import AdminScreen from '../Screens/AdminScreen';
import ProductScreen from '../Screens/ProductScreen'; // Import the new screen
import SignUpScreen from '../Screens/SignUp';
import { RootStackParamList } from '../types';
import ExploreProductsScreen from '../Screens/ExploreProductsScreen';
import ProductDetailsScreen from '../Screens/ProductDetailsScreen';
import CartScreen from '../Screens/CartScreen';
import ProfileScreen from '../Screens/ProfileScreen';
import OrderHistoryScreen from '../Screens/OrderHistoryScreen';
import OrderDetailsScreen from '../Screens/OrderDetailsScreen'; 
import ChatScreen from '../Screens/ChatScreen';


const Stack = createNativeStackNavigator<RootStackParamList>();
const AppNavigator = () => (
  <Stack.Navigator initialRouteName="OrderDetails">
    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Admin" component={AdminScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Product" component={ProductScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Register" component={SignUpScreen} options={{ headerShown: false }} />
    <Stack.Screen name="ExploreProducts" component={ExploreProductsScreen} options={{ headerTitle: 'Explore Products' }}/>
    <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} options={{ headerTitle: 'Product Details' }}/>
    <Stack.Screen name="Cart" component={CartScreen} options={{ headerTitle: 'Cart' }}/>
    <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerTitle: 'Profile' }}/>
    <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} options={{ headerTitle: 'OrderHistory' }}/>
    <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} options={{ headerTitle: 'OrderDetails' }}/>
    <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ headerTitle: 'Chat' }}/>
  </Stack.Navigator>
);

export default AppNavigator;