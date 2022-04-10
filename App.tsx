import 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import BillSplitter from './src/pages/BillSplitter';
import AddDish from "./src/pages/AddDish";
import History from "./src/pages/History";
import { Provider as BillProvider } from "./src/context/BillContext"
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const screenOptions = {
  headerShown: false
};

const RootStackScreen = () => {
  return (
    <BillProvider>
      <NavigationContainer>
        <SafeAreaView style={{flex: 1}}>
          <Stack.Navigator screenOptions={screenOptions}>
            <Stack.Group>
              <Stack.Screen name="Home" component={BillSplitter} />
            </Stack.Group>
            <Stack.Group screenOptions={{ presentation: 'modal' }}>
              <Stack.Screen name="AddDish" component={AddDish} />
            </Stack.Group>
            <Stack.Group screenOptions={{ presentation: 'modal' }}>
              <Stack.Screen name="History" component={History} />
            </Stack.Group>
          </Stack.Navigator>
        </SafeAreaView>
      </NavigationContainer>
    </BillProvider>
  );
}

export default RootStackScreen;