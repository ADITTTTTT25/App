import React from "react";
import { StyleSheet, Text, View } from "react-native";
import SignUpLoginScreen from "./screens/SignUpLoginScreen";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { AppDrawerNavigator } from "./components/AppDrawerNavigator";
import LandingScreen from "./screens/LandingScreen"
export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
const SwitchNav = createSwitchNavigator({
  SignUpLoginScreen: { screen: SignUpLoginScreen },
  Drawer: { screen: AppDrawerNavigator },
  LandingScreen:{screen : LandingScreen},
});

const AppContainer = createAppContainer(SwitchNav);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});


