import 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import BillSplitter from './src/pages/BillSplitter';
import AddDish from "./src/pages/AddDish";
import History from "./src/pages/History";
import Saved from "./src/pages/Saved";
import { Provider as BillProvider } from "./src/context/BillContext"
import { Provider as HistoryProvider } from "./src/context/HistoryContext"
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const homeTabOptions = {
  headerShown: false
};

const Home = createStackNavigator();
const HomeScreenStack = () => {
  return (<Home.Navigator screenOptions={homeTabOptions} >
    <Home.Group>
      <Home.Screen name="Default" component={BillSplitter} />
    </Home.Group>
    <Home.Group screenOptions={{ presentation: 'transparentModal', cardStyle: { backgroundColor: 'transparent' }, gestureEnabled: false }}>
      <Home.Screen name="AddDish" component={AddDish} />
    </Home.Group>
  </Home.Navigator>);
};

const Tab = createMaterialBottomTabNavigator();
const TabNavigatorComponent = () => {
  return (
    <Tab.Navigator
      barStyle={{ 
        // backgroundColor: '#694fad',
        // paddingBottom: 48, // for the translucent navigation bar
        backgroundColor: 'green',
      }}
      shifting
      initialRouteName="Home">
      <Tab.Screen name="History" component={History} 
        options={({ route }) => {
          return {
            tabBarLabel: 'History',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="clipboard" color={color} size={26} />
            ),
          };
        }}
        />
      <Tab.Screen name="Home" component={HomeScreenStack} options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="calculator" color={color} size={26} />
          ),
        }} />
      <Tab.Screen name="Saved" component={Saved} options={{
          tabBarLabel: 'Saved',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="archive" color={color} size={26} />
          ),
        }} />
    </Tab.Navigator>
  );
};

const RootStackScreen = () => {
  return (
    <BillProvider>
      <HistoryProvider>
        <NavigationContainer>
          <SafeAreaView style={{flex: 1}}>
            <TabNavigatorComponent />
          </SafeAreaView>
        </NavigationContainer>
      </HistoryProvider>
    </BillProvider>
  );
}

export default RootStackScreen;