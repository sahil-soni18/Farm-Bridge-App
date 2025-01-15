import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../Screens/Login';
import HomeScreen from '../Screens/home';
import AdminScreen from '../Screens/AdminScreen';
import ProductScreen from '../Screens/ProductScreen'; // Import the new screen
import SignUpScreen from '../Screens/SignUp';
import { RootStackParamList } from '../types';
import ExploreProductsScreen from '../Screens/ExploreProductsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const AppNavigator = () => (
  <Stack.Navigator initialRouteName="ExploreProducts">
    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Admin" component={AdminScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Product" component={ProductScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Register" component={SignUpScreen} options={{ headerShown: false }} />
    <Stack.Screen name="ExploreProducts" component={ExploreProductsScreen} options={{ headerTitle: 'Explore Products' }}/>
  </Stack.Navigator>
);

export default AppNavigator;