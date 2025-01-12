import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../Screens/Login';
import HomeScreen from '../Screens/home';

const Stack = createNativeStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator initialRouteName="Login">
    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);

export default AppNavigator;
