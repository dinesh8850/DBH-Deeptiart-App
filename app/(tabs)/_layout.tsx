import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../../components/Home";
import LoginScreen from "../../components/auth/LoginScreen";
import SignupScreen from "../../components/auth/SignupScreen";
import MainApp from "../../components/MainApp";
import Gallery from "../../components/Gallery";
import CartPage from "../../components/CartPage";
import CheckoutPage from "../../components/CheckOutPage";
import LikedPaintings from "../../components/LikedPaintingsScreen";
import { CartProvider } from "../../components/Context/CartContext";
import { NetworkStatusProvider } from "../../components/NetworkStatusProvider";
// Define CartItem type directly if the module is missing
type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  LikedPaintings: undefined;
};

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Signup: undefined;
  MainApp: undefined;
  Gallery: undefined;
  Cart: undefined;
  Checkout: { cartItems: CartItem[] };
  LikedPaintings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Layout() {
  return (
    <NetworkStatusProvider>
  
    <CartProvider>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="MainApp" component={MainApp} />
      <Stack.Screen name="Gallery" component={Gallery} />
      <Stack.Screen name="Cart" component={CartPage} />
      <Stack.Screen name="Checkout"  component={CheckoutPage as React.ComponentType<any>}  />
      <Stack.Screen name="LikedPaintings" component={LikedPaintings} />
       
    </Stack.Navigator>
    </CartProvider>
    </NetworkStatusProvider>
  );
}