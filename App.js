import React, { useEffect }from 'react';

import {
  StatusBar,
} from 'react-native';

import SplashScreen from  "react-native-splash-screen";

import Routes from "./src/routes";

import Loading from "./src/components/loading";

export default function App() {

  useEffect(() =>{ 
    SplashScreen.hide()
  })

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <Routes />
    </>
  );
}
