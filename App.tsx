import { SafeAreaView } from 'react-native-safe-area-context';
import BillSplitter from './src/pages/BillSplitter';
import { Provider as BillProvider } from "./src/context/BillContext"

const App = () => {
    return <BillSplitter />;
}

export default () => {
  return (
    <BillProvider>
        <SafeAreaView style={{flex: 1}}>
          <App />
        </SafeAreaView>
    </BillProvider>
  );
};