import { registerRootComponent } from 'expo';
import { activateKeepAwake } from 'expo-keep-awake';
import 'expo/build/Expo.fx';
import App from '../src/App';

if (__DEV__) {
  activateKeepAwake();
}

registerRootComponent(App);