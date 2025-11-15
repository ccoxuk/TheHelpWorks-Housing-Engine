import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import HomeScreen from './src/screens/HomeScreen';
import ChatScreen from './src/screens/ChatScreen';
import DecisionScreen from './src/screens/DecisionScreen';
import TemplatesScreen from './src/screens/TemplatesScreen';
import UpdatesScreen from './src/screens/UpdatesScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#2196F3',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ title: 'TheHelpWorks Housing Engine' }}
          />
          <Stack.Screen 
            name="Chat" 
            component={ChatScreen}
            options={{ title: 'Legal Assistant' }}
          />
          <Stack.Screen 
            name="Decision" 
            component={DecisionScreen}
            options={{ title: 'Decision Guide' }}
          />
          <Stack.Screen 
            name="Templates" 
            component={TemplatesScreen}
            options={{ title: 'Legal Templates' }}
          />
          <Stack.Screen 
            name="Updates" 
            component={UpdatesScreen}
            options={{ title: 'Legislative Updates' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
