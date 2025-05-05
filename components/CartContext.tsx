// // CartContext.tsx
// import React, { createContext, useContext, useState, useEffect } from 'react';

// // Define frame options
// type FrameOption = string; // Adjust the type as needed
// const frameOptions: FrameOption[] = ['Classic', 'Modern', 'Vintage'];
// import AsyncStorage from '@react-native-async-storage/async-storage';

// type CartItem = {
//   paintingId: string;
//   frame: FrameOption;
//   quantity: number;
// };

// const CartContext = createContext<{
//   cart: CartItem[];
//   addToCart: (paintingId: string) => void;
//   removeFromCart: (paintingId: string) => void;
//   updateCartItem: (paintingId: string, updates: Partial<CartItem>) => void;
// }>(null!);

// export const CartProvider = ({ children }: { children: React.ReactNode }) => {
//   const [cart, setCart] = useState<CartItem[]>([]);

//   useEffect(() => {
//     const loadCart = async () => {
//       try {
//         const savedCart = await AsyncStorage.getItem('userCart');
//         if (savedCart) setCart(JSON.parse(savedCart));
//       } catch (error) {
//         console.error('Failed to load cart:', error);
//       }
//     };
//     loadCart();
//   }, []);

//   const saveCart = async (newCart: CartItem[]) => {
//     try {
//       await AsyncStorage.setItem('userCart', JSON.stringify(newCart));
//     } catch (error) {
//       console.error('Failed to save cart:', error);
//     }
//   };

//   const addToCart = async (paintingId: string) => {
//     const existing = cart.find(item => item.paintingId === paintingId);
//     let newCart;
    
//     if (existing) {
//       newCart = cart.map(item => 
//         item.paintingId === paintingId 
//           ? { ...item, quantity: item.quantity + 1 }
//           : item
//       );
//     } else {
//       newCart = [...cart, {
//         paintingId,
//         frame: frameOptions[0],
//         quantity: 1
//       }];
//     }
    
//     setCart(newCart);
//     await saveCart(newCart);
//   };

//   const updateCartItem = async (paintingId: string, updates: Partial<CartItem>) => {
//     const newCart = cart.map(item =>
//       item.paintingId === paintingId ? { ...item, ...updates } : item
//     );
//     setCart(newCart);
//     await saveCart(newCart);
//   };

//   const removeFromCart = async (paintingId: string) => {
//     const newCart = cart.filter(item => item.paintingId !== paintingId);
//     setCart(newCart);
//     await saveCart(newCart);
//   };

//   // Add other cart operations...

//   return (
//     <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateCartItem }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => useContext(CartContext);

// import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// // Frame options with type safety
// type FrameOption = 'Classic' | 'Modern' | 'Vintage' | 'None';
// const frameOptions: FrameOption[] = ['Classic', 'Modern', 'Vintage', 'None'];

// interface CartItem {
//   id: string;
//   paintingId: string;
//   title: string;
//   price: number;
//   image?: string;
//   frame: FrameOption;
//   quantity: number;
// }

// interface CartContextType {
//   cart: CartItem[];
//   frameOptions: FrameOption[];
//   addToCart: (item: Omit<CartItem, 'quantity' | 'frame' | 'id'>) => void;
//   removeFromCart: (id: string) => void;
//   updateItem: (id: string, updates: Partial<CartItem>) => void;
//   changeFrame: (id: string, frame: FrameOption) => void;
//   incrementQuantity: (id: string) => void;
//   decrementQuantity: (id: string) => void;
//   clearCart: () => void;
//   getTotalItems: () => number;
//   getTotalPrice: () => number;
//   isInCart: (paintingId: string) => boolean;
// }

// const CartContext = createContext<CartContextType | undefined>(undefined);

// export const CartProvider = ({ children }: { children: React.ReactNode }) => {
//   const [cart, setCart] = useState<CartItem[]>([]);

//   // Load cart from storage
//   useEffect(() => {
//     const loadCart = async () => {
//       try {
//         const savedCart = await AsyncStorage.getItem('@cart');
//         if (savedCart) setCart(JSON.parse(savedCart));
//       } catch (error) {
//         console.error('Failed to load cart', error);
//       }
//     };
//     loadCart();
//   }, []);

//   // Save cart to storage
//   const saveCart = useCallback(async (newCart: CartItem[]) => {
//     try {
//       await AsyncStorage.setItem('@cart', JSON.stringify(newCart));
//     } catch (error) {
//       console.error('Failed to save cart', error);
//     }
//   }, []);

//   // Cart operations
//   const addToCart = useCallback((item: Omit<CartItem, 'quantity' | 'frame' | 'id'>) => {
//     setCart(prev => {
//       const existingItem = prev.find(i => i.paintingId === item.paintingId);
//       let newCart;

//       if (existingItem) {
//         newCart = prev.map(i =>
//           i.paintingId === item.paintingId
//             ? { ...i, quantity: i.quantity + 1 }
//             : i
//         ) as CartItem[];
//       } else {
//         newCart = [
//           ...prev,
//           {
//             ...item,
//             id: `${item.paintingId}-${Date.now()}`,
//             frame: 'None' as FrameOption,
//             quantity: 1
//           }
//         ];
//       }

//       saveCart(newCart);
//       return newCart;
//     });
//   }, [saveCart]);

//   const updateItem = useCallback((id: string, updates: Partial<CartItem>) => {
//     setCart(prev => {
//       const newCart = prev.map(item => 
//         item.id === id ? { ...item, ...updates } : item
//       );
//       saveCart(newCart);
//       return newCart;
//     });
//   }, [saveCart]);

//   const removeFromCart = useCallback((id: string) => {
//     setCart(prev => {
//       const newCart = prev.filter(item => item.id !== id);
//       saveCart(newCart);
//       return newCart;
//     });
//   }, [saveCart]);

//   const changeFrame = useCallback((id: string, frame: FrameOption) => {
//     updateItem(id, { frame });
//   }, [updateItem]);

//   const incrementQuantity = useCallback((id: string) => {
//     updateItem(id, { quantity: cart.find(i => i.id === id)!.quantity + 1 });
//   }, [cart, updateItem]);

//   const decrementQuantity = useCallback((id: string) => {
//     const item = cart.find(i => i.id === id);
//     if (item && item.quantity > 1) {
//       updateItem(id, { quantity: item.quantity - 1 });
//     }
//   }, [cart, updateItem]);

//   const clearCart = useCallback(() => {
//     setCart([]);
//     saveCart([]);
//   }, [saveCart]);

//   // Helper functions
//   const getTotalItems = useCallback(() => 
//     cart.reduce((total, item) => total + item.quantity, 0), 
//     [cart]
//   );

//   const getTotalPrice = useCallback(() =>
//     cart.reduce((total, item) => total + (item.price * item.quantity), 0),
//     [cart]
//   );

//   const isInCart = useCallback((paintingId: string) =>
//     cart.some(item => item.paintingId === paintingId),
//     [cart]
//   );

//   return (
//     <CartContext.Provider
//       value={{
//         cart,
//         frameOptions,
//         addToCart,
//         removeFromCart,
//         updateItem,
//         changeFrame,
//         incrementQuantity,
//         decrementQuantity,
//         clearCart,
//         getTotalItems,
//         getTotalPrice,
//         isInCart
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type FrameOption = 'Black' | 'Golden' | 'Silver' | 'None';

interface CartItem {
  id: string;
  paintingId: string;
  title: string;
  price: number;
  image?: string;
  frame: FrameOption;
  quantity: number;
  artist?: string;
}

interface CartContextType {
  cart: CartItem[];
  isLoading: boolean;
  frameOptions: FrameOption[];
  addToCart: (item: Omit<CartItem, 'quantity' | 'frame' | 'id'>) => void;
  removeFromCart: (id: string) => void;
  updateItem: (id: string, updates: Partial<CartItem>) => void;
  changeFrame: (id: string, frame: FrameOption) => void;
  incrementQuantity: (id: string) => void;
  decrementQuantity: (id: string) => void;
  clearCart: () => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getTotalWithFrames: () => number;
  isInCart: (paintingId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FRAME_PRICES: Record<FrameOption, number> = {
  'None': 0,
  'Black': 2001,
  'Golden': 2002,
  'Silver': 2003
};

export const CartProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const frameOptions: FrameOption[] = ['Black', 'Golden', 'Silver', 'None'];

  // Load cart from storage on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        const savedCart = await AsyncStorage.getItem('@cart');
        if (savedCart) setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to load cart', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCart();
  }, []);

  // Save cart to storage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      const saveCart = async () => {
        try {
          await AsyncStorage.setItem('@cart', JSON.stringify(cart));
        } catch (error) {
          console.error('Failed to save cart', error);
        }
      };
      saveCart();
    }
  }, [cart, isLoading]);

  const addToCart = useCallback((item: Omit<CartItem, 'quantity' | 'frame' | 'id'>) => {
    setCart(prev => {
      const existingItem = prev.find(i => i.paintingId === item.paintingId);
      let newCart;

      if (existingItem) {
        newCart = prev.map(i =>
          i.paintingId === item.paintingId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        newCart = [
          ...prev,
          {
            ...item,
            id: `${item.paintingId}-${Date.now()}`,
            frame: 'None' as FrameOption,
            quantity: 1
          }
        ];
      }
      return newCart;
    });
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<CartItem>) => {
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  }, []);

  const changeFrame = useCallback((id: string, frame: FrameOption) => {
    updateItem(id, { frame });
  }, [updateItem]);

  const incrementQuantity = useCallback((id: string) => {
    updateItem(id, { quantity: cart.find(i => i.id === id)!.quantity + 1 });
  }, [cart, updateItem]);

  const decrementQuantity = useCallback((id: string) => {
    const item = cart.find(i => i.id === id);
    if (item && item.quantity > 1) {
      updateItem(id, { quantity: item.quantity - 1 });
    }
  }, [cart, updateItem]);

  const clearCart = useCallback(async () => {
    setCart([]);
    try {
      await AsyncStorage.removeItem('@cart');
    } catch (error) {
      console.error('Failed to clear cart from storage', error);
      throw error;
    }
  }, []);

  const getTotalItems = useCallback(() => 
    cart.reduce((total, item) => total + item.quantity, 0), 
    [cart]
  );

  const getTotalPrice = useCallback(() =>
    cart.reduce((total, item) => total + (item.price * item.quantity), 0),
    [cart]
  );

  const getTotalWithFrames = useCallback(() =>
    cart.reduce((total, item) => {
      const framePrice = FRAME_PRICES[item.frame] || 0;
      return total + (item.price + framePrice) * item.quantity;
    }, 0),
    [cart]
  );

  const isInCart = useCallback((paintingId: string) =>
    cart.some(item => item.paintingId === paintingId),
    [cart]
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        frameOptions,
        addToCart,
        removeFromCart,
        updateItem,
        changeFrame,
        incrementQuantity,
        decrementQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        getTotalWithFrames,
        isInCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};