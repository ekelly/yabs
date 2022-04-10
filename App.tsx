import 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import BillSplitter from './src/pages/BillSplitter';
import AddDish from "./src/pages/AddDish";
import History from "./src/pages/History";
import { Provider as BillProvider } from "./src/context/BillContext"
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const homeTabOptions = {
  headerShown: false
};

const Home = createStackNavigator();
const HomeScreenStack = () => {
  return (<Home.Navigator screenOptions={homeTabOptions} >
    <Home.Group>
      <Home.Screen name="Default" component={BillSplitter} />
    </Home.Group>
    <Home.Group screenOptions={{ presentation: 'modal' }}>
      <Home.Screen name="AddDish" component={AddDish} />
    </Home.Group>
  </Home.Navigator>);
};

const Tab = createBottomTabNavigator();
const TabNavigatorComponent = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="History" component={History} />
      <Tab.Screen name="Home" component={HomeScreenStack} options={homeTabOptions} />
      <Tab.Screen name="Saved" component={History} />
    </Tab.Navigator>
  );
};

const RootStackScreen = () => {
  return (
    <BillProvider>
      <NavigationContainer>
        <SafeAreaView style={{flex: 1}}>
          <TabNavigatorComponent />
        </SafeAreaView>
      </NavigationContainer>
    </BillProvider>
  );
}

export default RootStackScreen;