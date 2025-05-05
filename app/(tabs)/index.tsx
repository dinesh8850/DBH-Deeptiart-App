import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Gallery from "../../components/Gallery";
import Cart from "../../components/CartPage";
import { NavigationContainer } from "@react-navigation/native";
import MainApp from "../../components/MainApp";
import CheckoutPage from "../../components/CheckOutPage"; // Ensure the path is correct
import LikedPaintings from "../../components/LikedPaintingsScreen"; // Ensure the path is correct
import { CartProvider } from '../../components/Context/CartContext'; 
import { NetworkStatusProvider } from "../../components/NetworkStatusProvider";
const Stack = createStackNavigator();

function App() {
  return (
    <NetworkStatusProvider>
      <CartProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainApp">
        <Stack.Screen name="MainApp" component={MainApp} />
        <Stack.Screen name="Gallery" component={Gallery} />
        <Stack.Screen name="Cart" component={Cart} />
        <Stack.Screen name="Checkout" component={CheckoutPage} />
        <Stack.Screen name="LikedPaintings" component={LikedPaintings} />
        <Stack.Screen name="OrderConfirmation" component={CheckoutPage} />
      
      </Stack.Navigator>
     </NavigationContainer>
    </CartProvider>
  </NetworkStatusProvider>
  );
}

export default App; // Ensure this line is present
