// import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo, useCallback } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Picker } from "@react-native-picker/picker";
// import { View, StyleSheet, StyleProp, ViewStyle, TextStyle } from "react-native";
// import { useNavigation, NavigationProp } from "@react-navigation/native";
// import { auth } from "../firebaseConfig";

// export interface CartItem {
//   id: string;
//   title: string;
//   price: number;
//   image: string;
//   quantity: number;
//   maxQuantity?: number;
// }

// interface CartProviderProps {
//   children: ReactNode;
//   initialCart?: CartItem[];
//   pickerStyle?: StyleProp<ViewStyle>;
//   pickerItemStyle?: StyleProp<TextStyle>;
// }

// interface CartContextType {
//   cart: CartItem[];
//   addToCart: (item: Omit<CartItem, "quantity">) => Promise<void>;
//   removeFromCart: (id: string) => void;
//   clearCart: () => void;
//   updateQuantity: (id: string, quantity: number) => void;
//   getTotalItems: () => number;
//   getTotalPrice: () => number;
//   renderQuantitySelector: (item: CartItem) => JSX.Element;
//   initializeCart: (initialCart: CartItem[]) => void;
//   applyCoupon: (code: string) => void;
//   discountedPrice: number | null;
// }

// const CartContext = createContext<CartContextType | undefined>(undefined);

// export const CartProvider = ({ 
//   children, 
//   initialCart = [],
//   pickerStyle,
//   pickerItemStyle 
// }: CartProviderProps): JSX.Element => {
//   const [cart, setCart] = useState<CartItem[]>(initialCart);
//   const [discountedPrice, setDiscountedPrice] = useState<number | null>(null);
//   const navigation = useNavigation<NavigationProp<{ 
//     Login: { screen: string; params: { shouldAddItem: boolean; item: Omit<CartItem, "quantity"> } } | undefined 
//   }>>();
//   const isAuthenticated = auth?.currentUser != null;

//   // Load cart from storage if no initial cart provided
//   useEffect(() => {
//     const loadCart = async () => {
//       if (initialCart.length > 0) return;
      
//       try {
//         const savedCart = await AsyncStorage.getItem("@cart");
//         if (savedCart) setCart(JSON.parse(savedCart));
//       } catch (error) {
//         console.error("Failed to load cart", error);
//       }
//     };
    
//     loadCart();
//   }, [initialCart]);

//   // Debounced save to storage
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       AsyncStorage.setItem("@cart", JSON.stringify(cart))
//         .catch(error => console.error("Failed to save cart", error));
//     }, 500);
    
//     return () => clearTimeout(timer);
//   }, [cart]);

//   const initializeCart = useCallback((initialCart: CartItem[]) => {
//     setCart(initialCart);
//   }, []);

//   const addToCart = useCallback(async (item: Omit<CartItem, "quantity">) => {
//     if (!isAuthenticated) {
//       navigation.navigate("Login", { 
//         screen: "Cart",
//         params: { shouldAddItem: true, item }
//       });
//       return;
//     }

//     setCart(prev => {
//       const existing = prev.find(i => i.id === item.id);
//       if (existing) {
//         const newQuantity = existing.quantity + 1;
//         const maxQty = existing.maxQuantity || 10;
//         return prev.map(i => 
//           i.id === item.id 
//             ? { ...i, quantity: Math.min(newQuantity, maxQty) } 
//             : i
//         );
//       }
//       return [...prev, { ...item, quantity: 1 }];
//     });
//   }, [isAuthenticated, navigation]);

//   const removeFromCart = useCallback((id: string) => {
//     setCart(prev => prev.filter(item => item.id !== id));
//   }, []);

//   const updateQuantity = useCallback((id: string, quantity: number) => {
//     if (quantity < 1) {
//       removeFromCart(id);
//       return;
//     }
    
//     setCart(prev => prev.map(item => {
//       if (item.id === id) {
//         const maxQty = item.maxQuantity || 10;
//         return { ...item, quantity: Math.min(quantity, maxQty) };
//       }
//       return item;
//     }));
//   }, [removeFromCart]);

//   const clearCart = useCallback(() => {
//     setCart([]);
//     setDiscountedPrice(null);
//   }, []);

//   const totalItems = useMemo(() => 
//     cart.reduce((sum, item) => sum + item.quantity, 0), 
//     [cart]
//   );

//   const totalPrice = useMemo(() => 
//     cart.reduce((sum, item) => sum + (item.price * item.quantity), 0), 
//     [cart]
//   );

//   const applyCoupon = useCallback((code: string) => {
//     // Simple coupon logic - extend as needed
//     if (code === "DISCOUNT10") {
//       setDiscountedPrice(totalPrice * 0.9);
//     } else {
//       setDiscountedPrice(null);
//     }
//   }, [totalPrice]);

//   const renderQuantitySelector = useCallback((item: CartItem) => {
//     const maxQuantity = item.maxQuantity || 10;
//     const quantities = Array.from({ length: maxQuantity }, (_, i) => i + 1);
    
//     return (
//       <View style={[styles.pickerContainer, pickerStyle]}>
//         <Picker
//           selectedValue={item.quantity.toString()}
//           onValueChange={(value) => updateQuantity(item.id, parseInt(value as string, 10))}
//           mode="dropdown"
//           style={styles.picker}
//           itemStyle={pickerItemStyle}
//         >
//           {quantities.map(num => (
//             <Picker.Item 
//               key={num.toString()} 
//               label={num.toString()} 
//               value={num.toString()} 
//             />
//           ))}
//         </Picker>
//       </View>
//     );
//   }, [pickerStyle, pickerItemStyle, updateQuantity]);

//   return (
//     <CartContext.Provider
//       value={{
//         cart,
//         addToCart,
//         removeFromCart,
//         clearCart,
//         updateQuantity,
//         getTotalItems: () => totalItems,
//         getTotalPrice: () => discountedPrice !== null ? discountedPrice : totalPrice,
//         renderQuantitySelector,
//         initializeCart,
//         applyCoupon,
//         discountedPrice
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// const styles = StyleSheet.create({
//   pickerContainer: {
//     borderWidth: 1,
//     borderRadius: 5,
//     overflow: 'hidden',
//     width: 100
//   },
//   picker: {
//     height: 50,
//   }
// });

// export const useCart = (): CartContextType => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error("useCart must be used within a CartProvider");
//   }
//   return context;
// };
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type FrameOption = {
  label: string;
  value: number;
  color: string;
  borderWidth: number;
};

export const frameOptions: FrameOption[] = [
  { label: "None", value: 0, color: "transparent", borderWidth: 0 },
  { label: "Black", value: 2001, color: "#000000", borderWidth: 10 },
  { label: "Golden", value: 2002, color: "#FFD700", borderWidth: 10 },
  { label: "Silver", value: 2003, color: "#C0C0C0", borderWidth: 10 },
];

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  thumbnail?: string;
  artist?: string;
  quantity: number;
  frame: FrameOption;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity" | "frame">, frame?: FrameOption) => void;
  removeFromCart: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  updateFrame: (id: string, frame: FrameOption) => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getTotalWithFrames: () => number;
  frameOptions: FrameOption[];
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from storage
  useEffect(() => {
    const loadCart = async () => {
      try {
        const savedCart = await AsyncStorage.getItem('@cart');
        if (savedCart) {
          setCart(JSON.parse(savedCart));
        }
      } catch (error) {
        console.error("Failed to load cart", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCart();
  }, []);

  // Save cart to storage
  const saveCart = async (updatedCart: CartItem[]) => {
    try {
      await AsyncStorage.setItem('@cart', JSON.stringify(updatedCart));
    } catch (error) {
      console.error("Failed to save cart", error);
    }
  };

  const addToCart = useCallback(async (item: Omit<CartItem, "quantity" | "frame">, frame = frameOptions[0]) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id && i.frame.value === frame.value);
      const newCart = existing 
        ? prev.map(i => 
            i.id === item.id && i.frame.value === frame.value 
              ? {...i, quantity: i.quantity + 1} 
              : i
          )
        : [...prev, {...item, quantity: 1, frame}];
      saveCart(newCart);
      return newCart;
    });
  }, []);

  const removeFromCart = useCallback(async (id: string) => {
    setCart(prev => {
      const newCart = prev.filter(item => item.id !== id);
      saveCart(newCart);
      return newCart;
    });
  }, []);

  const clearCart = useCallback(async () => {
    setCart([]);
    await AsyncStorage.removeItem('@cart');
  }, []);

  const updateQuantity = useCallback(async (id: string, quantity: number) => {
    if (quantity < 1) {
      await removeFromCart(id);
      return;
    }
    setCart(prev => {
      const newCart = prev.map(item => 
        item.id === id ? {...item, quantity} : item
      );
      saveCart(newCart);
      return newCart;
    });
  }, [removeFromCart]);

  const updateFrame = useCallback(async (id: string, frame: FrameOption) => {
    setCart(prev => {
      const newCart = prev.map(item => 
        item.id === id ? {...item, frame} : item
      );
      saveCart(newCart);
      return newCart;
    });
  }, []);

  const getTotalItems = useCallback(() => 
    cart.reduce((sum, item) => sum + item.quantity, 0), 
    [cart]
  );

  const getTotalPrice = useCallback(() => 
    cart.reduce((sum, item) => sum + (item.price * item.quantity), 0), 
    [cart]
  );

  const getTotalWithFrames = useCallback(() => 
    cart.reduce((sum, item) => 
      sum + (item.price * item.quantity) + (item.frame.value * item.quantity), 
      0
    ), 
    [cart]
  );

  const value = {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    updateQuantity,
    updateFrame,
    getTotalItems,
    getTotalPrice,
    getTotalWithFrames,
    frameOptions,
    isLoading
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};