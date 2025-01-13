import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../Screens/Login';
import HomeScreen from '../Screens/home';
import AdminScreen from '../Screens/AdminScreen';
import ProductScreen from '../Screens/ProductScreen'; // Import the new screen
import { RootStackParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => (
  <Stack.Navigator initialRouteName="Login">
    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Admin" component={AdminScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Product" component={ProductScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);

export default AppNavigator;