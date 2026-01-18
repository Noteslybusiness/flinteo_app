
import { StyleSheet } from 'react-native';
import AppNavigator from './src/navigation/routes';
import { ThemeProvider } from './src/assets/theme/themeProvider';
import { Provider } from 'react-redux';
import store from './src/redux/store';

function App() {
  return (
    <ThemeProvider>
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
