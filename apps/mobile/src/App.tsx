<<<<<<< HEAD
import { StatusBar } from "expo-status-bar";
import React from 'react';
import { Text, View } from 'react-native';

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Hello World!!!</Text>
      <StatusBar style="auto" />
    </View>
=======
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from './navigation';

export default function App() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
>>>>>>> feature-mobile
  );
}