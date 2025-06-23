import React from 'react';
import { Redirect } from 'expo-router';

import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto'; // URL polyfill
import 'expo-asset';

import { Buffer } from 'buffer';
import { LogBox } from 'react-native'; // 🔹 Import LogBox

global.Buffer = global.Buffer || Buffer;

// Amplify Config
 import { Amplify } from 'aws-amplify';
 import AWS_CONFIG from '../amplifyconfiguration.json';


 Amplify.configure(AWS_CONFIG);
 // 🔇 Suppress deprecation warnings from third-party libs
  LogBox.ignoreLogs([
    'Support for defaultProps will be removed from function components in a future major release',
  ]);

const App = () => {
  return <Redirect href="/auth" />; // Redirect to auth page (or any other page)
};

export default App;
