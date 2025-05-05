// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import { 
//   View, 
//   Text, 
//   FlatList, 
//   Image, 
//   StyleSheet, 
//   TouchableOpacity, 
//   Alert, 
//   ActivityIndicator,
//   Platform,
//   Modal,
//   ScrollView,
//   SafeAreaView
// } from "react-native";
// import { Ionicons } from  "@expo/vector-icons";
// import { Picker } from "@react-native-picker/picker";
// import paintings from "./Painting.json";
// import { useNavigation } from "@react-navigation/native";
// import { useCart } from './CartContext';
// import type { StackScreenProps } from "@react-navigation/stack" with { "resolution-mode": "import" };
// import { auth } from "../components/firebaseConfig";

// import type { User } from "firebase/auth";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// // Enhanced type definitions
// type Painting = {
//   id: string;
//   title: string;
//   price: number;
//   image: string;
//   artist?: string;
//   thumbnail?: string;
// };

// type CartItem = {
//   paintingId: string;
//   frame: FrameOption;
//   quantity: number; 
// };

// type CartProps = StackScreenProps<any, "Cart">;

// type FrameOption = {
//   label: string;
//   value: number;
//   color: string;
//   borderWidth: number;
// };

// const frameOptions: FrameOption[] = [
//   { label: "None", value: 0, color: "transparent", borderWidth: 0 },
//   { label: "Black", value: 2001, color: "#000000", borderWidth: 10 },
//   { label: "Golden", value: 2002, color: "#FFD700", borderWidth: 10 },
//   { label: "Silver", value: 2003, color: "#C0C0C0", borderWidth: 10 },
// ];

// const Cart = ({ route, navigation }: CartProps) => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);
//   const [iosPickerVisible, setIosPickerVisible] = useState(false);
//   const [currentSelectedItem, setCurrentSelectedItem] = useState<string | null>(null);
//   const [imageLoadErrors, setImageLoadErrors] = useState<Record<string, boolean>>({});
//   // Removed duplicate navigation declaration
//   // Load cart items from storage on mount
//   useEffect(() => {
//     const loadCart = async () => {
//       try {
//         const savedCart = await AsyncStorage.getItem('userCart');
//         if (savedCart) {
//           setCartItems(JSON.parse(savedCart));
//         } else if (route.params?.cartItems) {
//           // Convert legacy format to new format
//           const legacyItems = Object.keys(route.params.cartItems)
//             .filter(id => route.params?.cartItems?.[id])
//             .map(id => ({
//               paintingId: id,
//               frame: frameOptions[0],
//               quantity: 1
//             }));
//           setCartItems(legacyItems);
//           await AsyncStorage.setItem('userCart', JSON.stringify(legacyItems));
//         }
//       } catch (error) {
//         console.error('Failed to load cart', error);
//       }
//     };

//     const unsubscribe = auth.onAuthStateChanged(async (user: User | null) => {
//       setIsLoggedIn(!!user);
//       setIsLoading(false);
      
//       if (!user) {
//         await saveCart(); // Persist before navigating
//         navigation.replace("Login", { 
//           redirectTo: "Cart",
//           message: "Please login to view your cart" 
//         });
//       } else {
//         await loadCart();
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   // Save cart to storage whenever it changes
//   const saveCart = async () => {
//     try {
//       await AsyncStorage.setItem('userCart', JSON.stringify(cartItems));
//     } catch (error) {
//       console.error('Failed to save cart', error);
//     }
//   };

//   // Memoized cart paintings with full details
//   const cartPaintings = useMemo(() => {
//     return cartItems.map(item => {
//       const painting = paintings.find(p => p.id === item.paintingId);
//       return painting ? { ...painting, ...item } : null;
//     }).filter(Boolean) as (Painting & CartItem)[];
//   }, [cartItems]);

//   // Handle frame change
//   const handleFrameChange = useCallback(async (itemId: string, value: string) => {
//     const frame = frameOptions.find(f => f.value === parseInt(value, 10));
//     if (frame) {
//       setCartItems(prev => 
//         prev.map(item => 
//           item.paintingId === itemId 
//             ? { ...item, frame } 
//             : item
//         )
//       );
//     }
//     if (Platform.OS === 'ios') setIosPickerVisible(false);
//     await saveCart();
//   }, []);

//   // Handle remove item
//   const handleRemoveItem = useCallback(async (itemId: string) => {
//     Alert.alert(
//       "Remove Item",
//       "Are you sure you want to remove this item from your cart?",
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Remove",
//           style: "destructive",
//           onPress: async () => {
//             setCartItems(prev => prev.filter(item => item.paintingId !== itemId));
//             await saveCart();
//             navigation.navigate("Gallery");
//           },
//         },
//       ]
//     );
//   }, [navigation]);

//   // Calculate total with frame prices
//   const calculateTotal = useCallback(() => {
//     return cartPaintings.reduce((sum, item) => {
//       const paintingPrice = item.price * item.quantity;
//       const framePrice = item.frame.value * item.quantity;
//       return sum + paintingPrice + framePrice;
//     }, 0);
//   }, [cartPaintings]);

//   const handleCheckout = useCallback(() => {
//     navigation.navigate("Checkout", {
//       cartItems: cartPaintings.map(item => ({
//         ...item,
//         frame: item.frame.label,
//         framePrice: item.frame.value,
//         totalPrice: item.price + item.frame.value,
//         quantity: item.quantity
//       })),
//       grandTotal: calculateTotal(),
//     });
//   }, [cartPaintings, calculateTotal]);

//   const handleImageError = useCallback((itemId: string) => {
//     setImageLoadErrors(prev => ({ ...prev, [itemId]: true }));
//   }, []);

//   if (isLoading) {
//     return (
//       <SafeAreaView style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#6a11cb" />
//       </SafeAreaView>
//     );
//   }

//   if (!isLoggedIn) {
//     return (
//       <SafeAreaView style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#6a11cb" />
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity 
//           onPress={() => navigation.goBack()}
//           accessibilityLabel="Go back"
//           accessibilityHint="Returns to previous screen"
//           hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
//         >
//           <Ionicons name="arrow-back" size={24} color="black" />
//         </TouchableOpacity>
//         <Text style={styles.title}>Your Cart</Text>
//         <View style={{ width: 24 }} />
//       </View>

//       {cartPaintings.length === 0 ? (
//         <View style={styles.emptyCart}>
//           <Ionicons name="cart-outline" size={64} color="#ccc" />
//           <Text style={styles.emptyText}>Your cart is empty</Text>
//           <Text style={styles.emptySubtext}>Browse our collection to add items</Text>
//           <TouchableOpacity
//             style={styles.browseButton}
//             onPress={() => navigation.navigate("Gallery")}
//             accessibilityRole="button"
//           >
//             <Text style={styles.browseButtonText}>Browse Gallery</Text>
//           </TouchableOpacity>
//         </View>
//       ) : (
//         <>
//           <FlatList
//             data={cartPaintings}
//             keyExtractor={(item) => item.id}
//             renderItem={({ item }) => {
//               const imageSource = imageLoadErrors[item.id] && item.thumbnail 
//                 ? { uri: item.thumbnail } 
//                 : { uri: item.image };
              
//               return (
//                 <View style={styles.cartItem}>
//                   <View style={[
//                     styles.imageFrame,
//                     { 
//                       borderColor: item.frame.color,
//                       borderWidth: item.frame.borderWidth,
//                       padding: item.frame.borderWidth > 0 ? 2 : 0
//                     }
//                   ]}>
//                     <Image
//                       source={imageSource}
//                       style={styles.cartImage}
//                       onError={() => handleImageError(item.id)}
//                       accessibilityLabel={`Artwork titled ${item.title}`}
//                     />
//                   </View>
//                   <View style={styles.itemInfo}>
//                     <View style={styles.itemHeader}>
//                       <Text 
//                         style={styles.itemTitle} 
//                         numberOfLines={1}
//                         accessibilityLabel={`Title: ${item.title}`}
//                       >
//                         {item.title}
//                       </Text>
//                       <TouchableOpacity
//                         onPress={() => handleRemoveItem(item.id)}
//                         accessibilityLabel="Remove item"
//                         accessibilityHint="Removes this item from your cart"
//                         hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//                       >
//                         <Ionicons name="trash-outline" size={20} color="#ff4444" />
//                       </TouchableOpacity>
//                     </View>
//                     {item.artist && (
//                       <Text 
//                         style={styles.itemArtist}
//                         accessibilityLabel={`Artist: ${item.artist}`}
//                       >
//                         By {item.artist}
//                       </Text>
//                     )}
//                     <Text 
//                       style={styles.itemPrice}
//                       accessibilityLabel={`Price: ${item.price} rupees`}
//                     >
//                       ₹{item.price.toLocaleString()}
//                     </Text>

//                     <Text style={styles.frameLabel}>Frame Selection:</Text>
//                     {Platform.OS === 'ios' ? (
//                       <TouchableOpacity
//                         onPress={() => {
//                           setCurrentSelectedItem(item.id);
//                           setIosPickerVisible(true);
//                         }}
//                         style={styles.iosPickerTrigger}
//                         accessibilityRole="button"
//                         accessibilityLabel={`Select frame, current: ${item.frame.label}`}
//                       >
//                         <Text style={styles.iosPickerText}>
//                           {item.frame.label} {item.frame.value > 0 ? `(+₹${item.frame.value})` : ""}
//                         </Text>
//                         <Ionicons name="chevron-down" size={16} color="#666" />
//                       </TouchableOpacity>
//                     ) : (
//                       <View style={styles.pickerContainer}>
//                         <Picker
//                           selectedValue={item.frame.value.toString()}
//                           onValueChange={(value) => handleFrameChange(item.id, value)}
//                           dropdownIconColor="#666"
//                           mode="dropdown"
//                           accessibilityLabel="Select frame option"
//                         >
//                           {frameOptions.map((option) => (
//                             <Picker.Item
//                               key={option.label}
//                               label={`${option.label} ${option.value > 0 ? `(+₹${option.value})` : ""}`}
//                               value={option.value.toString()}
//                             />
//                           ))}
//                         </Picker>
//                       </View>
//                     )}
//                   </View>
//                 </View>
//               );
//             }}
//             contentContainerStyle={styles.listContent}
//             ListFooterComponent={<View style={{ height: 20 }} />}
//           />

//           {/* iOS Picker Modal */}
//           <Modal
//             visible={iosPickerVisible}
//             transparent={true}
//             animationType="slide"
//             onRequestClose={() => setIosPickerVisible(false)}
//           >
//             <View style={styles.modalOverlay}>
//               <View style={styles.modalContainer}>
//                 <Text style={styles.modalTitle}>Select Frame</Text>
//                 <ScrollView>
//                   {frameOptions.map((option) => (
//                     <TouchableOpacity
//                       key={option.label}
//                       style={[
//                         styles.iosPickerOption,
//                         cartItems.find(i => i.paintingId === currentSelectedItem)?.frame.value === option.value && 
//                         styles.iosPickerOptionSelected
//                       ]}
//                       onPress={() => {
//                         if (currentSelectedItem) {
//                           handleFrameChange(currentSelectedItem, option.value.toString());
//                         }
//                       }}
//                       accessibilityRole="button"
//                       accessibilityLabel={`Frame option: ${option.label}`}
//                     >
//                       <View style={styles.frameSampleContainer}>
//                         <View style={[
//                           styles.frameSample,
//                           { 
//                             borderColor: option.color,
//                             borderWidth: option.borderWidth
//                           }
//                         ]} />
//                       </View>
//                       <Text style={styles.iosPickerOptionText}>
//                         {option.label} {option.value > 0 ? `(+₹${option.value})` : ""}
//                       </Text>
//                       {cartItems.find(i => i.paintingId === currentSelectedItem)?.frame.value === option.value && (
//                         <Ionicons name="checkmark" size={20} color="#6a11cb" />
//                       )}
//                     </TouchableOpacity>
//                   ))}
//                 </ScrollView>
//                 <TouchableOpacity
//                   style={styles.iosPickerCancel}
//                   onPress={() => setIosPickerVisible(false)}
//                   accessibilityRole="button"
//                   accessibilityLabel="Cancel frame selection"
//                 >
//                   <Text style={styles.iosPickerCancelText}>Cancel</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </Modal>

//           {/* Order Summary */}
//           <View style={styles.summaryContainer}>
//             <Text style={styles.summaryTitle}>Order Summary</Text>
            
//             <View style={styles.summaryRow}>
//               <Text style={styles.summaryLabel}>Subtotal ({cartPaintings.length} items)</Text>
//               <Text style={styles.summaryValue}>
//                 ₹{cartPaintings.reduce((sum, p) => sum + (p.price * p.quantity), 0).toLocaleString()}
//               </Text>
//             </View>
            
//             <View style={styles.summaryRow}>
//               <Text style={styles.summaryLabel}>Frames</Text>
//               <Text style={styles.summaryValue}>
//                 ₹{cartPaintings.reduce((sum, p) => sum + (p.frame.value * p.quantity), 0).toLocaleString()}
//               </Text>
//             </View>
            
//             <View style={styles.divider} />
            
//             <View style={[styles.summaryRow, { marginBottom: 16 }]}>
//               <Text style={styles.grandTotalLabel}>Total Amount</Text>
//               <Text style={styles.grandTotalValue}>
//                 ₹{calculateTotal().toLocaleString()}
//               </Text>
//             </View>
            
//             <TouchableOpacity
//               style={styles.checkoutButton}
//               onPress={handleCheckout}
//               activeOpacity={0.9}
//               accessibilityRole="button"
//               accessibilityLabel="Proceed to checkout"
//             >
//               <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
//               <Ionicons name="arrow-forward" size={20} color="#fff" />
//             </TouchableOpacity>
//           </View>
//         </>
//       )}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f8f9fa",
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#f8f9fa",
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 10,
//     paddingHorizontal: 10,
//     marginTop: 30,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "600",
//     color: "#333",
//   },
//   emptyCart: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 40,
//   },
//   emptyText: {
//     fontSize: 18,
//     fontWeight: "500",
//     color: "#555",
//     marginTop: 16,
//     marginBottom: 4,
//   },
//   emptySubtext: {
//     fontSize: 14,
//     color: "#888",
//     marginBottom: 24,
//   },
//   browseButton: {
//     backgroundColor: "#6a11cb",
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 8,
//     shadowColor: "#6a11cb",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   browseButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "500",
//   },
//   cartItem: {
//     flexDirection: "row",
//     backgroundColor: "#fff",
//     marginHorizontal: 16,
//     marginVertical: 8,
//     borderRadius: 12,
//     padding: 16,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   imageFrame: {
//     borderRadius: 8,
//     overflow: "hidden",
//     marginRight: 16,
//     backgroundColor: "#fff",
//   },
//   cartImage: {
//     width: 80,
//     height: 80,
//     resizeMode: "cover",
//   },
//   itemInfo: {
//     flex: 1,
//   },
//   itemHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 4,
//   },
//   itemTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#333",
//     flex: 1,
//     marginRight: 8,
//   },
//   itemArtist: {
//     fontSize: 13,
//     color: "#666",
//     marginBottom: 6,
//   },
//   itemPrice: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: "#6a11cb",
//     marginBottom: 12,
//   },
//   frameLabel: {
//     fontSize: 13,
//     color: "#666",
//     marginBottom: 6,
//   },
//   pickerContainer: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 8,
//     overflow: "hidden",
//   },
//   iosPickerTrigger: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//   },
//   iosPickerText: {
//     fontSize: 14,
//     color: "#333",
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "flex-end",
//   },
//   modalContainer: {
//     backgroundColor: "#fff",
//     borderTopLeftRadius: 16,
//     borderTopRightRadius: 16,
//     maxHeight: "60%",
//     paddingBottom: 8,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: "600",
//     padding: 16,
//     borderBottomWidth: StyleSheet.hairlineWidth,
//     borderBottomColor: "#eee",
//   },
//   iosPickerOption: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 16,
//     borderBottomWidth: StyleSheet.hairlineWidth,
//     borderBottomColor: "#eee",
//   },
//   iosPickerOptionSelected: {
//     backgroundColor: "#f5f5f5",
//   },
//   frameSampleContainer: {
//     width: 40,
//     height: 40,
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 12,
//   },
//   frameSample: {
//     width: 30,
//     height: 30,
//     backgroundColor: "#f8f9fa",
//   },
//   iosPickerOptionText: {
//     fontSize: 16,
//     flex: 1,
//     color: "#333",
//   },
//   iosPickerCancel: {
//     padding: 16,
//     alignItems: "center",
//     borderTopWidth: StyleSheet.hairlineWidth,
//     borderTopColor: "#eee",
//   },
//   iosPickerCancelText: {
//     fontSize: 16,
//     color: "#6a11cb",
//     fontWeight: "600",
//   },
//   listContent: {
//     paddingTop: 8,
//     paddingBottom: 8,
//   },
//   summaryContainer: {
//     backgroundColor: "#fff",
//     padding: 16,
//     borderTopWidth: StyleSheet.hairlineWidth,
//     borderTopColor: "#ddd",
//   },
//   summaryTitle: {
//     fontSize: 18,
//     fontWeight: "600",
//     marginBottom: 16,
//     color: "#333",
//   },
//   summaryRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 8,
//   },
//   summaryLabel: {
//     fontSize: 14,
//     color: "#666",
//   },
//   summaryValue: {
//     fontSize: 14,
//     fontWeight: "500",
//   },
//   divider: {
//     height: 1,
//     backgroundColor: "#eee",
//     marginVertical: 12,
//   },
//   grandTotalLabel: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#333",
//   },
//   grandTotalValue: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: "#6a11cb",
//   },
//   checkoutButton: {
//     backgroundColor: "#6a11cb",
//     padding: 16,
//     borderRadius: 12,
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: "#6a11cb",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   checkoutButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//     marginRight: 8,
//   },
// });

// export default Cart;   
import React, { useState, useCallback } from "react";
import {
  View, 
  Text, 
  FlatList, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  Platform,
  Modal,
  ScrollView,
  SafeAreaView,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import type { StackScreenProps } from "@react-navigation/stack";
import { useCart, frameOptions } from "./Context/CartContext";
import paintings from "./Painting.json";
import { auth } from "../components/firebaseConfig";
import { useNetwork } from "../components/NetworkStatusProvider";
type CartProps = StackScreenProps<any, "Cart">;

const CartScreen = ({ route, navigation }: CartProps) => {
  const {
    cart: cartItems,
    removeFromCart,
    updateFrame,
    getTotalWithFrames,
    isLoading: isCartLoading,
    frameOptions
  } = useCart();
  
  const [iosPickerVisible, setIosPickerVisible] = useState(false);
  const [currentSelectedItem, setCurrentSelectedItem] = useState<string | null>(null);
  const [imageLoadErrors, setImageLoadErrors] = useState<Record<string, boolean>>({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Handle auth state
  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
      if (!user) {
        navigation.replace("Login", { 
          redirectTo: "Cart",
          message: "Please login to view your cart" 
        });
      }
    });
    return unsubscribe;
  }, [navigation]);

    const MyComponent = () => {
      const { isConnected } = useNetwork();
    
      return (
        <Text>{isConnected ? 'Online 🎉' : 'Offline 😢'}</Text>
      );
    };


  const handleFrameChange = useCallback((itemId: string, value: string) => {
    const frame = frameOptions.find(f => f.value === parseInt(value, 10));
    if (frame) {
      updateFrame(itemId, frame);
    }
    if (Platform.OS === 'ios') setIosPickerVisible(false);
  }, [updateFrame]);

  const handleRemoveItem = useCallback((itemId: string) => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item from your cart?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => removeFromCart(itemId),
        },
      ]
    );
  }, [removeFromCart]);

  const handleCheckout = useCallback(() => {
    navigation.navigate("Checkout", {
      cartItems: cartItems.map(item => ({
        ...item,
        frame: item.frame.label,
        framePrice: item.frame.value,
        totalPrice: item.price + item.frame.value,
        quantity: item.quantity
      })),
      grandTotal: getTotalWithFrames(),
    });
  }, [cartItems, getTotalWithFrames, navigation]);

  const handleImageError = useCallback((itemId: string) => {
    setImageLoadErrors(prev => ({ ...prev, [itemId]: true }));
  }, []);

  if (isCartLoading || !isLoggedIn) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6a11cb" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          accessibilityLabel="Go back"
          accessibilityHint="Returns to previous screen"
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Your Cart</Text>
        <View style={{ width: 24 }} />
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.emptyCart}>
          <Ionicons name="cart-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <Text style={styles.emptyText}>Browse our collection to add items</Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => navigation.navigate("Gallery")}
            accessibilityRole="button"
          >
            <Text style={styles.browseButtonText}>Browse Gallery</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const imageSource = imageLoadErrors[item.id] && item.thumbnail 
                ? { uri: item.thumbnail } 
                : { uri: item.image };
              
              return (
                <View style={styles.cartItem}>
                  <View style={[
                    styles.imageFrame,
                    { 
                      borderColor: item.frame.color,
                      borderWidth: item.frame.borderWidth,
                      padding: item.frame.borderWidth > 0 ? 2 : 0
                    }
                  ]}>
                    <Image
                      source={imageSource}
                      style={styles.cartImage}
                      onError={() => handleImageError(item.id)}
                      accessibilityLabel={`Artwork titled ${item.title}`}
                    />
                  </View>
                  <View style={styles.itemInfo}>
                    <View style={styles.itemHeader}>
                      <Text 
                        style={styles.itemTitle} 
                        numberOfLines={1}
                        accessibilityLabel={`Title: ${item.title}`}
                      >
                        {item.title}
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleRemoveItem(item.id)}
                        accessibilityLabel="Remove item"
                      >
                        <Ionicons name="trash-outline" size={20} color="#ff4444" />
                      </TouchableOpacity>
                    </View>
                    {item.artist && (
                      <Text accessibilityLabel={`Artist: ${item.artist}`}>
                        By {item.artist}
                      </Text>
                    )}
                    <Text accessibilityLabel={`Price: ${item.price} rupees`}>
                      ₹{item.price.toLocaleString()}
                    </Text>

                    <Text style={styles.frameLabel}>Frame Selection:</Text>
                    {Platform.OS === 'ios' ? (
                      <TouchableOpacity
                        onPress={() => {
                          setCurrentSelectedItem(item.id);
                          setIosPickerVisible(true);
                        }}
                        style={styles.iosPickerTrigger}
                        accessibilityLabel={`Select frame, current: ${item.frame.label}`}
                      >
                        <Text>
                          {item.frame.label} {item.frame.value > 0 ? `(+₹${item.frame.value})` : ""}
                        </Text>
                        <Ionicons name="chevron-down" size={16} color="#666" />
                      </TouchableOpacity>
                    ) : (
                      <View style={styles.pickerContainer}>
                        <Picker
                          selectedValue={item.frame.value.toString()}
                          onValueChange={(value) => handleFrameChange(item.id, value)}
                          dropdownIconColor="#666"
                          accessibilityLabel="Select frame option"
                        >
                          {frameOptions.map((option) => (
                            <Picker.Item
                              key={option.label}
                              label={`${option.label} ${option.value > 0 ? `(+₹${option.value})` : ""}`}
                              value={option.value.toString()}
                            />
                          ))}
                        </Picker>
                      </View>
                    )}
                  </View>
                </View>
              );
            }}
            contentContainerStyle={styles.listContent}
            ListFooterComponent={<View style={{ height: 20 }} />}
          />

          {/* iOS Picker Modal */}
          <Modal
            visible={iosPickerVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setIosPickerVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Select Frame</Text>
                <ScrollView>
                  {frameOptions.map((option) => (
                    <TouchableOpacity
                      key={option.label}
                      style={[
                        styles.iosPickerOption,
                        cartItems.find(i => i.id === currentSelectedItem)?.frame.value === option.value && 
                        styles.iosPickerOptionSelected
                      ]}
                      onPress={() => {
                        if (currentSelectedItem) {
                          handleFrameChange(currentSelectedItem, option.value.toString());
                        }
                      }}
                      accessibilityLabel={`Frame option: ${option.label}`}
                    >
                      <View style={styles.frameSampleContainer}>
                        <View style={[
                          styles.frameSample,
                          { 
                            borderColor: option.color,
                            borderWidth: option.borderWidth
                          }
                        ]} />
                      </View>
                      <Text>
                        {option.label} {option.value > 0 ? `(+₹${option.value})` : ""}
                      </Text>
                      {cartItems.find(i => i.id === currentSelectedItem)?.frame.value === option.value && (
                        <Ionicons name="checkmark" size={20} color="#6a11cb" />
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <TouchableOpacity
                  style={styles.iosPickerCancel}
                  onPress={() => setIosPickerVisible(false)}
                  accessibilityLabel="Cancel frame selection"
                >
                  <Text style={styles.iosPickerCancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Order Summary */}
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Order Summary</Text>
            
            <View style={styles.summaryRow}>
              <Text>Subtotal ({cartItems.length} items)</Text>
              <Text>
                ₹{cartItems.reduce((sum, p) => sum + (p.price * p.quantity), 0).toLocaleString()}
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text>Frames</Text>
              <Text>
                ₹{cartItems.reduce((sum, p) => sum + (p.frame.value * p.quantity), 0).toLocaleString()}
              </Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={[styles.summaryRow, { marginBottom: 16 }]}>
              <Text style={styles.grandTotalLabel}>Total Amount</Text>
              <Text style={styles.grandTotalValue}>
                ₹{getTotalWithFrames().toLocaleString()}
              </Text>
            </View>
            
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={handleCheckout}
              accessibilityRole="button"
              accessibilityLabel="Proceed to checkout"
            >
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginTop: 30,
    marginLeft: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
  },
  emptyCart: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "500",
    marginVertical: 8,
  },
  browseButton: {
    backgroundColor: "#6a11cb",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  browseButtonText: {
    color: "white",
    fontWeight: "500",
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "white",
    margin: 8,
    borderRadius: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    elevation: 2,
  },
  imageFrame: {
    borderRadius: 4,
    overflow: "hidden",
    marginRight: 12,
  },
  cartImage: {
    width: 80,
    height: 80,
    resizeMode: "cover",
  },
  itemInfo: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  itemArtist: {
    fontSize: 13,
    color: "#666",
    marginBottom: 6,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#6a11cb",
    marginBottom: 12,
  },
  frameLabel: {
    fontSize: 13,
    color: "#666",
    marginBottom: 6,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  iosPickerTrigger: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  iosPickerText: {
    fontSize: 14,
    color: "#333",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "60%",
    paddingBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
  },
  iosPickerOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
  },
  iosPickerOptionSelected: {
    backgroundColor: "#f5f5f5",
  },
  frameSampleContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  frameSample: {
    width: 30,
    height: 30,
    backgroundColor: "#f8f9fa",
  },
  iosPickerOptionText: {
    fontSize: 16,
    flex: 1,
    color: "#333",
  },
  iosPickerCancel: {
    padding: 16,
    alignItems: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#eee",
  },
  iosPickerCancelText: {
    fontSize: 16,
    color: "#6a11cb",
    fontWeight: "600",
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  summaryContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#ddd",
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 12,
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  grandTotalValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#6a11cb",
  },
  checkoutButton: {
    backgroundColor: "#6a11cb",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#6a11cb",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
});

export default CartScreen; 