import { StyleSheet } from "react-native";
import React from "react";
import SignIn from "./signIn";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const PublicLayout = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="signIn"
        component={SignIn}
        options={{
          title: "Welcome",
          headerShown: false,
          statusBarHidden: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default PublicLayout;

const styles = StyleSheet.create({});
