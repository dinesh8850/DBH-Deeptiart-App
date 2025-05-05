// import React, { useState, useEffect, useMemo } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   Image,
//   TouchableOpacity,
//   Dimensions,
//   ScrollView,
//   TextInput,
//   ActivityIndicator,
//   RefreshControl
// } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import Icon from "react-native-vector-icons/MaterialIcons";
// import { debounce } from "lodash";

// // Mock data generator for 250+ images
// const generatePaintings = () => {
//   const categories = ["Sketch", "Mandala", "Coloured", "Oil", "Watercolor", "Digital", "Abstract", "Portrait"];
//   const paintings: Record<string, { id: string; uri: string; title: string; price: string; likes: number; isNew: boolean }[]> = {};
  
//   categories.forEach(category => {
//     paintings[category] = Array.from({ length: Math.floor(Math.random() * 40) + 10 }, (_, i) => ({
//       id: `${category}-${i+1}`,
//       uri: `https://deeptiart.com/${category}-${i+1}.jpg`,
//       title: `${category} Artwork ${i+1}`,
//       price: (Math.random() * 200 + 20).toFixed(2),
//       likes: Math.floor(Math.random() * 1000),
//       isNew: Math.random() > 0.7
//     }));
//   });
  
//   return paintings;
// };

// const paintingsData: { [key: string]: { id: string; uri: string; title: string; price: string; likes: number; isNew: boolean }[] } = generatePaintings();
// const PAGE_SIZE = 10;

// export default function Gallery() {
//   const [selectedCategory, setSelectedCategory] = useState<string>("All");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [refreshing, setRefreshing] = useState(false);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [page, setPage] = useState(1);
//   const [allLoaded, setAllLoaded] = useState(false);

//   const categories = useMemo(() => ["All", ...Object.keys(paintingsData)], []);

//   const filteredPaintings = useMemo(() => {
//     if (selectedCategory === "All") {
//       return Object.values(paintingsData).flat();
//     }
//     return paintingsData[selectedCategory] || [];
//   }, [selectedCategory]);

//   const searchedPaintings = useMemo(() => {
//     if (!searchQuery) return filteredPaintings;
//     return filteredPaintings.filter(painting =>
//       painting.title.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   }, [filteredPaintings, searchQuery]);

//   const displayedPaintings = useMemo(() => {
//     return searchedPaintings.slice(0, page * PAGE_SIZE);
//   }, [searchedPaintings, page]);

//   const handleSearch = debounce((query) => {
//     setSearchQuery(query);
//     setPage(1);
//     setAllLoaded(false);
//   }, 500);

//   const loadMore = () => {
//     if (loadingMore || allLoaded) return;
    
//     if (displayedPaintings.length < searchedPaintings.length) {
//       setLoadingMore(true);
//       setTimeout(() => {
//         setPage(p => p + 1);
//         setLoadingMore(false);
//       }, 1000);
//     } else {
//       setAllLoaded(true);
//     }
//   };

//   const onRefresh = () => {
//     setRefreshing(true);
//     setTimeout(() => {
//       setPage(1);
//       setAllLoaded(false);
//       setRefreshing(false);
//     }, 1500);
//   };

//   const renderFooter = () => {
//     if (!loadingMore) return null;
//     return (
//       <View style={styles.loadingFooter}>
//         <ActivityIndicator size="small" color="#6a11cb" />
//       </View>
//     );
//   };

//   interface Painting {
//     id: string;
//     uri: string;
//     title: string;
//     price: string;
//     likes: number;
//     isNew: boolean;
//   }
  
//   const renderItem = ({ item }: { item: Painting }) => (
//     <TouchableOpacity style={styles.artCard}>
//       <Image source={{ uri: item.uri }} style={styles.artImage} />
//       {item.isNew && <View style={styles.newBadge}><Text style={styles.newBadgeText}>New</Text></View>}
//       <View style={styles.artInfo}>
//         <Text style={styles.artTitle} numberOfLines={1}>{item.title}</Text>
//         <View style={styles.artMeta}>
//           <Text style={styles.artPrice}>${item.price}</Text>
//           <View style={styles.likesContainer}>
//             <Icon name="favorite" size={16} color="#ff4757" />
//             <Text style={styles.likesCount}>{item.likes}</Text>
//           </View>
//         </View>
//       </View>
//       <TouchableOpacity style={styles.cartButton}>
//         <Icon name="add-shopping-cart" size={20} color="#fff" />
//       </TouchableOpacity>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <LinearGradient
//         colors={['#6a11cb', '#2575fc']}
//         style={styles.headerContainer}
//       >
//         <Text style={styles.header}>Deepti Art </Text>
//         <Text style={styles.subHeader}>250+ Handmade Paintings</Text>
        
//         {/* Search Bar */}
//         <View style={styles.searchContainer}>
//           <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Search paintings..."
//             placeholderTextColor="#999"
//             onChangeText={handleSearch}
//           />
//         </View>
//       </LinearGradient>

//       {/* Category Tabs */}
//       <ScrollView
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={styles.categoryContainer}
//       >
//         {categories.map((category) => (
//           <TouchableOpacity
//             key={category}
//             style={[
//               styles.categoryTab,
//               selectedCategory === category && styles.selectedCategoryTab
//             ]}
//             onPress={() => {
//               setSelectedCategory(category);
//               setPage(1);
//               setAllLoaded(false);
//             }}
//           >
//             <Text style={[
//               styles.categoryTabText,
//               selectedCategory === category && styles.selectedCategoryTabText
//             ]}>
//               {category}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </ScrollView>

//       {/* Paintings Grid */}
//       <FlatList
//         data={displayedPaintings}
//         keyExtractor={(item) => item.id}
//         numColumns={2}
//         columnWrapperStyle={styles.columnWrapper}
//         renderItem={renderItem}
//         contentContainerStyle={styles.gridContainer}
//         onEndReached={loadMore}
//         onEndReachedThreshold={0.5}
//         ListFooterComponent={renderFooter}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             colors={['#6a11cb']}
//             tintColor="#6a11cb"
//           />
//         }
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Icon name="image" size={50} color="#ccc" />
//             <Text style={styles.emptyText}>No paintings found</Text>
//           </View>
//         }
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f8f9fa",
//   },
//   headerContainer: {
//     padding: 20,
//     paddingTop: 50,
//     paddingBottom: 20,
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//     marginBottom: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4.65,
//     elevation: 8,
//   },
//   header: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#fff",
//     textAlign: "center",
//     marginBottom: 5,
//   },
//   subHeader: {
//     fontSize: 16,
//     color: "rgba(255,255,255,0.8)",
//     textAlign: "center",
//     marginBottom: 15,
//   },
//   searchContainer: {
//     backgroundColor: "#fff",
//     borderRadius: 25,
//     paddingHorizontal: 15,
//     paddingVertical: 8,
//     flexDirection: "row",
//     alignItems: "center",
//     marginHorizontal: 10,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 16,
//     marginLeft: 10,
//     color: "#333",
//   },
//   searchIcon: {
//     marginRight: 5,
//   },
//   categoryContainer: {
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//   },
//   categoryTab: {
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     marginRight: 10,
//     borderRadius: 20,
//     backgroundColor: "#f0f0f0",
//   },
//   selectedCategoryTab: {
//     backgroundColor: "#6a11cb",
//   },
//   categoryTabText: {
//     color: "#333",
//     fontWeight: "600",
//   },
//   selectedCategoryTabText: {
//     color: "#fff",
//   },
//   gridContainer: {
//     padding: 10,
//   },
//   columnWrapper: {
//     justifyContent: "space-between",
//     marginBottom: 15,
//   },
//   artCard: {
//     width: "48%",
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     overflow: "hidden",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//     marginBottom: 15,
//   },
//   artImage: {
//     width: "100%",
//     height: 180,
//     resizeMode: "cover",
//   },
//   newBadge: {
//     position: "absolute",
//     top: 10,
//     right: 10,
//     backgroundColor: "#ff4757",
//     paddingHorizontal: 8,
//     paddingVertical: 3,
//     borderRadius: 10,
//   },
//   newBadgeText: {
//     color: "#fff",
//     fontSize: 12,
//     fontWeight: "bold",
//   },
//   artInfo: {
//     padding: 12,
//   },
//   artTitle: {
//     fontSize: 14,
//     fontWeight: "600",
//     marginBottom: 8,
//     color: "#333",
//   },
//   artMeta: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   artPrice: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#6a11cb",
//   },
//   likesContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   likesCount: {
//     fontSize: 14,
//     color: "#666",
//     marginLeft: 4,
//   },
//   cartButton: {
//     position: "absolute",
//     bottom: 15,
//     right: 15,
//     backgroundColor: "#6a11cb",
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: "#6a11cb",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.4,
//     shadowRadius: 3,
//     elevation: 5,
//   },
//   loadingFooter: {
//     paddingVertical: 20,
//     alignItems: "center",
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 50,
//   },
//   emptyText: {
//     fontSize: 18,
//     color: "#666",
//     marginTop: 15,
//   },
// // });
// import React, { useState } from "react";
// import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import paintings from "./Painting.json"; // Import paintings data

// const categories = ["All", "Sketch", "Mandala", "Coloured"];

// const Gallery = () => {
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [likedPaintings, setLikedPaintings] = useState<Record<string, boolean>>({});
//   const [cart, setCart] = useState<Record<string, boolean>>({});

//   const filteredPaintings = selectedCategory === "All"
//     ? paintings
//     : paintings.filter((painting) => painting.category === selectedCategory);

//   const toggleLike = (id: string) => {
//     setLikedPaintings((prev) => ({ ...prev, [id]: !prev[id] }));
//   };

//   const addToCart = (id: string) => {
//     setCart((prev) => ({ ...prev, [id]: !prev[id] }));
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Deepti Art</Text>

//       <View style={styles.categoryContainer}>
//         {categories.map((category) => (
//           <TouchableOpacity
//             key={category}
//             style={[
//               styles.categoryTab,
//               selectedCategory === category && styles.selectedCategoryTab,
//             ]}
//             onPress={() => setSelectedCategory(category)}
//           >
//             <Text
//               style={[
//                 styles.categoryTabText,
//                 selectedCategory === category && styles.selectedCategoryTabText,
//               ]}
//             >
//               {category}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       <FlatList
//         data={filteredPaintings}
//         keyExtractor={(item) => item.id}
//         numColumns={2}
//         renderItem={({ item }) => (
//           <View style={styles.artCard}>
//             <Image source={{ uri: item.image }} style={styles.artImage} />
//             <TouchableOpacity onPress={() => toggleLike(item.id)} style={styles.likeButton}>
//               <Ionicons name={likedPaintings[item.id] ? "heart" : "heart-outline"} size={24} color="red" />
//             </TouchableOpacity>
//             <View style={styles.artInfo}>
//               <Text style={styles.artTitle}>{item.title}</Text>
//               <Text style={styles.artPrice}>₹{item.price}</Text>
//               <TouchableOpacity
//                 onPress={() => addToCart(item.id)}
//                 style={[styles.cartButton, cart[item.id] && styles.addedToCart]}
//               >
//                 <Text style={styles.cartButtonText}>{cart[item.id] ? "Added to Cart" : "Add to Cart"}</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         )}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#f8f9fa", padding: 10 },
//   title: { textAlign: "center", fontSize: 26, fontWeight: "bold", marginVertical: 90 },
//   categoryContainer: { flexDirection: "row", justifyContent: "center", marginVertical: 10 },
//   categoryTab: { padding: 10, borderRadius: 20, marginHorizontal: 5, backgroundColor: "#f0f0f0" },
//   selectedCategoryTab: { backgroundColor: "#6a11cb" },
//   categoryTabText: { fontWeight: "600" },
//   selectedCategoryTabText: { color: "#fff" },
//   artCard: {
//     width: "48%",
//     margin: "1%",
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     padding: 10,
//     position: "relative",
//   },
//   artImage: { width: "100%", height: 180, borderRadius: 10 },
//   artInfo: { paddingTop: 10 },
//   artTitle: { fontWeight: "600" },
//   artPrice: { fontSize: 16, fontWeight: "bold", color: "#6a11cb" },
//   likeButton: { position: "absolute", top: 10, right: 10 },
//   cartButton: {
//     marginTop: 10,
//     padding: 8,
//     borderRadius: 8,
//     backgroundColor: "#6a11cb",
//     alignItems: "center",
//   },
//   cartButtonText: { color: "#fff", fontWeight: "bold" },
//   addedToCart: { backgroundColor: "green" },
// });

// export default Gallery;
// import React, { useState, useEffect } from "react";
// import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Alert } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import paintings from "./Painting.json";
// import { useNavigation, useIsFocused } from "@react-navigation/native";
// import { StackNavigationProp } from "@react-navigation/stack";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// type Painting = {
//   id: string;
//   title: string;
//   price: number;
//   image: string;
//   category: string;
// };

// type RootStackParamList = {
//   Gallery: { updatedCart?: Record<string, boolean>, fromLogin?: boolean };
//   Cart: { cartItems: Record<string, boolean> };
//   Login: { redirectTo: string };
//   LikedPaintings: undefined;
// };

// const categories = ["All", "Sketch", "Mandala", "Coloured"];
// const LIKED_PAINTINGS_KEY = 'liked_paintings';

// const Gallery = ({ route }: { route: { params?: RootStackParamList['Gallery'] } }) => {
//   const navigation = useNavigation<StackNavigationProp<RootStackParamList, "Gallery">>();
//   const isFocused = useIsFocused();
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [likedPaintings, setLikedPaintings] = useState<Record<string, boolean>>({});
//   const [cart, setCart] = useState<Record<string, boolean>>({});
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   // Load liked paintings from storage
//   const loadLikedPaintings = async () => {
//     try {
//       const jsonValue = await AsyncStorage.getItem(LIKED_PAINTINGS_KEY);
//       if (jsonValue !== null) {
//         setLikedPaintings(JSON.parse(jsonValue));
//       }
//     } catch (e) {
//       console.error('Failed to load liked paintings', e);
//     }
//   };

//   // Save liked paintings to storage
//   const saveLikedPaintings = async (likes: Record<string, boolean>) => {
//     try {
//       await AsyncStorage.setItem(LIKED_PAINTINGS_KEY, JSON.stringify(likes));
//     } catch (e) {
//       console.error('Failed to save liked paintings', e);
//     }
//   };

//   // Check login status and load liked paintings on component mount and when focused
//   useEffect(() => {
//     const checkLoginStatus = async () => {
//       try {
//         const token = await AsyncStorage.getItem('userToken');
//         setIsLoggedIn(!!token);
        
//         if (route.params?.fromLogin) {
//           setIsLoggedIn(true);
//         }
        
//         await loadLikedPaintings();
//       } catch (error) {
//         console.error('Error checking login status:', error);
//       }
//     };
    
//     checkLoginStatus();
//   }, [isFocused, route.params?.fromLogin]);

//   // Sync cart state when returning from Cart screen
//   useEffect(() => {
//     if (isFocused && route.params?.updatedCart) {
//       setCart(route.params.updatedCart);
//     }
//   }, [isFocused, route.params?.updatedCart]);

//   const filteredPaintings = selectedCategory === "All"
//     ? paintings
//     : paintings.filter((painting) => painting.category === selectedCategory);

//   const toggleLike = async (id: string) => {
//     const newLikes = { ...likedPaintings, [id]: !likedPaintings[id] };
//     setLikedPaintings(newLikes);
//     await saveLikedPaintings(newLikes);
//   };

//   const addToCart = (id: string) => {
//     if (!isLoggedIn) {
//       Alert.alert(
//         "Login Required",
//         "You need to login to add items to cart",
//         [
//           { text: "Cancel", style: "cancel" },
//           { text: "Login", onPress: () => navigation.navigate("Login", { redirectTo: "Gallery" }) }
//         ]
//       );
//       return;
//     }
    
//     setCart((prev) => {
//       const newCart = { ...prev, [id]: !prev[id] };
//       return newCart;
//     });
//   };

//   const navigateToCart = () => {
//     if (!isLoggedIn) {
//       Alert.alert(
//         "Login Required",
//         "You need to login to view your cart",
//         [
//           { text: "Cancel", style: "cancel" },
//           { text: "Login", onPress: () => navigation.navigate("Login", { redirectTo: "Cart" }) }
//         ]
//       );
//       return;
//     }
    
//     navigation.navigate("Cart", { cartItems: cart });
//   };

//   const navigateToLikedPaintings = () => {
//     if (!isLoggedIn) {
//       Alert.alert(
//         "Login Required",
//         "You need to login to view your liked paintings",
//         [
//           { text: "Cancel", style: "cancel" },
//           { text: "Login", onPress: () => navigation.navigate("Login", { redirectTo: "Gallery" }) }
//         ]
//       );
//       return;
//     }
//     navigation.navigate("LikedPaintings");
//   };

//   const cartItemsCount = Object.keys(cart).filter(id => cart[id]).length;
//   const likedItemsCount = Object.keys(likedPaintings).filter(id => likedPaintings[id]).length;

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>Deepti Art</Text>
//         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//           {isLoggedIn && (
//             <>
//               <TouchableOpacity 
//                 onPress={navigateToLikedPaintings}
//                 style={{ marginRight: 15, padding: 5 }}
//               >
//                 <Ionicons name="heart" size={24} color="red" />
//                 {likedItemsCount > 0 && (
//                   <View style={[styles.badge, { backgroundColor: 'red' }]}>
//                     <Text style={styles.badgeText}>{likedItemsCount}</Text>
//                   </View>
//                 )}
//               </TouchableOpacity>
//               <TouchableOpacity 
//                 onPress={() => {
//                   AsyncStorage.removeItem('userToken');
//                   setIsLoggedIn(false);
//                   setCart({});
//                 }}
//                 style={{ marginRight: 15 }}
//               >
//                 <Ionicons name="log-out-outline" size={24} color="black" />
//               </TouchableOpacity>
//             </>
//           )}
//           <TouchableOpacity 
//             onPress={navigateToCart}
//             style={styles.cartIcon}
//             testID="cart-button"
//           >
//             <Ionicons name="cart-outline" size={24} color="black" />
//             {cartItemsCount > 0 && (
//               <View style={styles.badge}>
//                 <Text style={styles.badgeText}>{cartItemsCount}</Text>
//               </View>
//             )}
//           </TouchableOpacity>
//         </View>
//       </View>

//       <View style={styles.categoryContainer}>
//         {categories.map((category) => (
//           <TouchableOpacity
//             key={category}
//             style={[
//               styles.categoryTab,
//               selectedCategory === category && styles.selectedCategoryTab,
//             ]}
//             onPress={() => setSelectedCategory(category)}
//           >
//             <Text
//               style={[
//                 styles.categoryTabText,
//                 selectedCategory === category && styles.selectedCategoryTabText,
//               ]}
//             >
//               {category}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       <FlatList
//         data={filteredPaintings}
//         keyExtractor={(item) => item.id}
//         numColumns={2}
//         contentContainerStyle={styles.listContainer}
//         renderItem={({ item }) => (
//           <View style={styles.artCard}>
//             <Image 
//               source={{ uri: item.image }} 
//               style={styles.artImage} 
//               resizeMode="cover"
//             />
//             <TouchableOpacity 
//               onPress={() => toggleLike(item.id)} 
//               style={styles.likeButton}
//               testID={`like-button-${item.id}`}
//             >
//               <Ionicons 
//                 name={likedPaintings[item.id] ? "heart" : "heart-outline"} 
//                 size={24} 
//                 color={likedPaintings[item.id] ? "red" : "#333"} 
//               />
//             </TouchableOpacity>
//             <View style={styles.artInfo}>
//               <Text style={styles.artTitle} numberOfLines={1}>{item.title}</Text>
//               {isLoggedIn ? (
//                 <Text style={styles.artPrice}>₹{item.price.toLocaleString()}</Text>
//               ) : (
//                 <TouchableOpacity
//                   onPress={() => navigation.navigate("Login", { redirectTo: "Gallery" })}
//                 >
//                   <Text style={styles.loginToViewPrice}>Login to view price</Text>
//                 </TouchableOpacity>
//               )}
//               <TouchableOpacity
//                 onPress={() => addToCart(item.id)}
//                 style={[
//                   styles.cartButton, 
//                   cart[item.id] ? styles.addedToCart : styles.notInCart,
//                   !isLoggedIn && styles.disabledCartButton
//                 ]}
//                 testID={`cart-button-${item.id}`}
//                 disabled={!isLoggedIn}
//               >
//                 <Text style={styles.cartButtonText}>
//                   {cart[item.id] ? "Added ✓" : "Add to Cart"}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         )}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { 
//     flex: 1, 
//     backgroundColor: "#f8f9fa", 
//     padding: 10 
//   },
//   disabledCartButton: {
//     backgroundColor: "#cccccc",
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 10,
//     paddingHorizontal: 10,
//     marginTop: 27,
//   },
//   title: { 
//     fontSize: 26, 
//     fontWeight: "bold",
//   },
//   cartIcon: {
//     position: "relative",
//     padding: 10,
//   },
//   badge: {
//     position: "absolute",
//     right: 5,
//     top: 5,
//     backgroundColor: "red",
//     borderRadius: 10,
//     width: 20,
//     height: 20,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   badgeText: {
//     color: "white",
//     fontSize: 12,
//     fontWeight: "bold",
//   },
//   categoryContainer: { 
//     flexDirection: "row", 
//     justifyContent: "center", 
//     marginVertical: 10,
//     flexWrap: "wrap",
//   },
//   categoryTab: { 
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 20, 
//     margin: 5, 
//     backgroundColor: "#f0f0f0",
//   },
//   selectedCategoryTab: { 
//     backgroundColor: "#6a11cb",
//   },
//   categoryTabText: { 
//     fontWeight: "600",
//     color: "#333",
//   },
//   selectedCategoryTabText: { 
//     color: "#fff",
//   },
//   listContainer: {
//     paddingBottom: 20,
//   },
//   artCard: {
//     flex: 1,
//     minWidth: "48%",
//     maxWidth: "48%",
//     margin: "1%",
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     padding: 10,
//     position: "relative",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   artImage: { 
//     width: "100%", 
//     height: 180, 
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   artInfo: { 
//     paddingTop: 5,
//   },
//   artTitle: { 
//     fontWeight: "600",
//     fontSize: 14,
//     marginBottom: 5,
//   },
//   artPrice: { 
//     fontSize: 16, 
//     fontWeight: "bold", 
//     color: "#6a11cb",
//     marginBottom: 10,
//   },
//   loginToViewPrice: {
//     fontSize: 14,
//     color: "#6a11cb",
//     marginBottom: 10,
//     textDecorationLine: "underline",
//   },
//   likeButton: { 
//     position: "absolute", 
//     top: 15, 
//     right: 15,
//     backgroundColor: "rgba(255,255,255,0.7)",
//     borderRadius: 20,
//     padding: 5,
//   },
//   cartButton: {
//     paddingVertical: 8,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   notInCart: {
//     backgroundColor: "#6a11cb",
//   },
//   addedToCart: { 
//     backgroundColor: "#4CAF50",
//   },
//   cartButtonText: { 
//     color: "#fff", 
//     fontWeight: "bold",
//     fontSize: 14,
//   },
// });

// export default Gallery;
// import React, { useState, useEffect } from "react";
// import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Alert, Modal, TouchableWithoutFeedback, Dimensions } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import paintings from "./Painting.json";
// import { useNavigation, useIsFocused } from "@react-navigation/native";
// import { StackNavigationProp } from "@react-navigation/stack";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useCart } from "./Context/CartContext"; // Import the context

// type Painting = {
//   id: string;
//   title: string;
//   price: number;
//   image: string;
//   category: string;
//   description?: string;
// };

// type RootStackParamList = {
//   Gallery: { updatedCart?: Record<string, boolean>, fromLogin?: boolean };
//   Cart: undefined; // Simplified since cart is now managed by context
//   Login: { redirectTo: string };
//   LikedPaintings: undefined;
// };

// const { width, height } = Dimensions.get('window');
// const categories = ["All", "Sketch", "Mandala", "Coloured"];
// const LIKED_PAINTINGS_KEY = 'liked_paintings';

// const Gallery = ({ route }: { route: { params?: RootStackParamList['Gallery'] } }) => {
//   const navigation = useNavigation<StackNavigationProp<RootStackParamList, "Gallery">>();
//   const isFocused = useIsFocused();
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [likedPaintings, setLikedPaintings] = useState<Record<string, boolean>>({});
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [selectedPainting, setSelectedPainting] = useState<Painting | null>(null);
//   const [modalVisible, setModalVisible] = useState(false);

//   // Use cart context
//   const {
//     cart,
//     addToCart,
//     removeFromCart,
//     getTotalItems,
//     isLoading: isCartLoading
//   } = useCart();

//   // Load liked paintings from storage
//   const loadLikedPaintings = async () => {
//     try {
//       const jsonValue = await AsyncStorage.getItem(LIKED_PAINTINGS_KEY);
//       if (jsonValue !== null) {
//         setLikedPaintings(JSON.parse(jsonValue));
//       }
//     } catch (e) {
//       console.error('Failed to load liked paintings', e);
//     }
//   };

//   // Save liked paintings to storage
//   const saveLikedPaintings = async (likes: Record<string, boolean>) => {
//     try {
//       await AsyncStorage.setItem(LIKED_PAINTINGS_KEY, JSON.stringify(likes));
//     } catch (e) {
//       console.error('Failed to save liked paintings', e);
//     }
//   };

//   // Check login status and load liked paintings
//   useEffect(() => {
//     const checkLoginStatus = async () => {
//       try {
//         const token = await AsyncStorage.getItem('userToken');
//         setIsLoggedIn(!!token);
        
//         if (route.params?.fromLogin) {
//           setIsLoggedIn(true);
//         }
        
//         await loadLikedPaintings();
//       } catch (error) {
//         console.error('Error checking login status:', error);
//       }
//     };
    
//     checkLoginStatus();
//   }, [isFocused, route.params?.fromLogin]);

//   const filteredPaintings = selectedCategory === "All"
//     ? paintings
//     : paintings.filter((painting) => painting.category === selectedCategory);

//   const getRecommendedPaintings = () => {
//     if (!selectedPainting) return [];
//     return paintings
//       .filter(p => p.category === selectedPainting.category && p.id !== selectedPainting.id)
//       .slice(0, 4);
//   };

//   const recommendedPaintings = getRecommendedPaintings();

//   const toggleLike = async (id: string) => {
//     const newLikes = { ...likedPaintings, [id]: !likedPaintings[id] };
//     setLikedPaintings(newLikes);
//     await saveLikedPaintings(newLikes);
//   };

//   const handleAddToCart = (painting: Painting) => {
//     if (!isLoggedIn) {
//       Alert.alert(
//         "Login Required",
//         "You need to login to add items to cart",
//         [
//           { text: "Cancel", style: "cancel" },
//           { text: "Login", onPress: () => navigation.navigate("Login", { redirectTo: "Gallery" }) }
//         ]
//       );
//       return;
//     }
    
//     addToCart({
//       id: painting.id,
//       title: painting.title,
//       price: painting.price,
//       image: painting.image
//     });
//   };

//   const navigateToCart = () => {
//     if (!isLoggedIn) {
//       Alert.alert(
//         "Login Required",
//         "You need to login to view your cart",
//         [
//           { text: "Cancel", style: "cancel" },
//           { text: "Login", onPress: () => navigation.navigate("Login", { redirectTo: "Cart" }) }
//         ]
//       );
//       return;
//     }
    
//     navigation.navigate("Cart");
//   };

//   const navigateToLikedPaintings = () => {
//     if (!isLoggedIn) {
//       Alert.alert(
//         "Login Required",
//         "You need to login to view your liked paintings",
//         [
//           { text: "Cancel", style: "cancel" },
//           { text: "Login", onPress: () => navigation.navigate("Login", { redirectTo: "Gallery" }) }
//         ]
//       );
//       return;
//     }
//     navigation.navigate("LikedPaintings");
//   };

//   const openPaintingModal = (painting: Painting) => {
//     setSelectedPainting(painting);
//     setModalVisible(true);
//   };

//   const closePaintingModal = () => {
//     setModalVisible(false);
//     setSelectedPainting(null);
//   };

//   const cartItemsCount = getTotalItems();
//   const likedItemsCount = Object.keys(likedPaintings).filter(id => likedPaintings[id]).length;

//   // Check if a painting is in cart
//   const isInCart = (id: string) => {
//     return cart.some((item: { id: string; title: string; price: number; image: string }) => item.id === id);
//   };

//   return (
//     <View style={styles.container}>
//       {/* Painting Detail Modal - Updated to use context */}
//       <Modal
//         animationType="fade"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={closePaintingModal}
//       >
//         <TouchableWithoutFeedback onPress={closePaintingModal}>
//           <View style={styles.modalOverlay}>
//             <TouchableWithoutFeedback>
//               <View style={styles.modalContent}>
//                 {selectedPainting && (
//                   <>
//                     <Image 
//                       source={{ uri: selectedPainting.image }} 
//                       style={styles.modalImage}
//                       resizeMode="contain"
//                     />
//                     <View style={styles.modalDetails}>
//                       <Text style={styles.modalTitle}>{selectedPainting.title}</Text>
//                       <Text style={styles.modalCategory}>{selectedPainting.category}</Text>
//                       {isLoggedIn ? (
//                         <Text style={styles.modalPrice}>₹{selectedPainting.price.toLocaleString()}</Text>
//                       ) : (
//                         <TouchableOpacity
//                           onPress={() => {
//                             closePaintingModal();
//                             navigation.navigate("Login", { redirectTo: "Gallery" });
//                           }}
//                         >
//                           <Text style={styles.loginToViewPrice}>Login to view price</Text>
//                         </TouchableOpacity>
//                       )}
//                       <Text style={styles.modalDescription}>
//                         {selectedPainting.description || "Beautiful handmade artwork by Deepti Art."}
//                       </Text>
//                       <View style={styles.modalActions}>
//                         <TouchableOpacity 
//                           onPress={() => {
//                             toggleLike(selectedPainting.id);
//                           }}
//                           style={styles.modalActionButton}
//                         >
//                           <Ionicons 
//                             name={likedPaintings[selectedPainting.id] ? "heart" : "heart-outline"} 
//                             size={24} 
//                             color={likedPaintings[selectedPainting.id] ? "red" : "#333"} 
//                           />
//                         </TouchableOpacity>
//                         <TouchableOpacity
//                           onPress={() => {
//                             handleAddToCart(selectedPainting);
//                           }}
//                           style={[
//                             styles.modalAddToCart,
//                             isInCart(selectedPainting.id) ? styles.addedToCart : styles.notInCart,
//                             !isLoggedIn && styles.disabledCartButton
//                           ]}
//                           disabled={!isLoggedIn}
//                         >
//                           <Text style={styles.cartButtonText}>
//                             {isInCart(selectedPainting.id) ? "Added to Cart" : "Add to Cart"}
//                           </Text>
//                         </TouchableOpacity>
//                       </View>

//                       {/* Recommended Paintings Section */}
//                       {recommendedPaintings.length > 0 && (
//                         <View style={styles.recommendedSection}>
//                           <Text style={styles.recommendedTitle}>You may also like</Text>
//                           <FlatList
//                             horizontal
//                             data={recommendedPaintings}
//                             keyExtractor={(item) => item.id}
//                             showsHorizontalScrollIndicator={false}
//                             renderItem={({ item }) => (
//                               <TouchableOpacity 
//                                 style={styles.recommendedItem}
//                                 onPress={() => {
//                                   setSelectedPainting(item);
//                                 }}
//                               >
//                                 <Image 
//                                   source={{ uri: item.image }} 
//                                   style={styles.recommendedImage}
//                                   resizeMode="cover"
//                                 />
//                                 <Text 
//                                   style={styles.recommendedText}
//                                   numberOfLines={1}
//                                 >
//                                   {item.title}
//                                 </Text>
//                                 {isLoggedIn && (
//                                   <Text style={styles.recommendedPrice}>
//                                     ₹{item.price.toLocaleString()}
//                                   </Text>
//                                 )}
//                               </TouchableOpacity>
//                             )}
//                             contentContainerStyle={styles.recommendedList}
//                           />
//                         </View>
//                       )}
//                     </View>
//                     <TouchableOpacity 
//                       onPress={closePaintingModal}
//                       style={styles.closeButton}
//                     >
//                       <Ionicons name="close" size={24} color="#333" />
//                     </TouchableOpacity>
//                   </>
//                 )}
//               </View>
//             </TouchableWithoutFeedback>
//           </View>
//         </TouchableWithoutFeedback>
//       </Modal>

//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.title}>Deepti Art</Text>
//         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//           {isLoggedIn && (
//             <>
//               <TouchableOpacity 
//                 onPress={navigateToLikedPaintings}
//                 style={{ marginRight: 15, padding: 5 }}
//               >
//                 <Ionicons name="heart" size={24} color="red" />
//                 {likedItemsCount > 0 && (
//                   <View style={[styles.badge, { backgroundColor: 'red' }]}>
//                     <Text style={styles.badgeText}>{likedItemsCount}</Text>
//                   </View>
//                 )}
//               </TouchableOpacity>
//               <TouchableOpacity 
//                 onPress={() => {
//                   AsyncStorage.removeItem('userToken');
//                   setIsLoggedIn(false);
//                 }}
//                 style={{ marginRight: 15 }}
//               >
//                 <Ionicons name="log-out-outline" size={24} color="black" />
//               </TouchableOpacity>
//             </>
//           )}
//           <TouchableOpacity 
//             onPress={navigateToCart}
//             style={styles.cartIcon}
//             testID="cart-button"
//           >
//             <Ionicons name="cart-outline" size={24} color="black" />
//             {cartItemsCount > 0 && (
//               <View style={styles.badge}>
//                 <Text style={styles.badgeText}>{cartItemsCount}</Text>
//               </View>
//             )}
//           </TouchableOpacity>
//         </View>
//       </View>

//       <View style={styles.categoryContainer}>
//         {categories.map((category) => (
//           <TouchableOpacity
//             key={category}
//             style={[
//               styles.categoryTab,
//               selectedCategory === category && styles.selectedCategoryTab,
//             ]}
//             onPress={() => setSelectedCategory(category)}
//           >
//             <Text
//               style={[
//                 styles.categoryTabText,
//                 selectedCategory === category && styles.selectedCategoryTabText,
//               ]}
//             >
//               {category}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       <FlatList
//         data={filteredPaintings}
//         keyExtractor={(item) => item.id}
//         numColumns={2}
//         contentContainerStyle={styles.listContainer}
//         renderItem={({ item }) => (
//           <TouchableOpacity 
//             style={styles.artCard}
//             onPress={() => openPaintingModal(item)}
//             activeOpacity={0.8}
//           >
//             <Image 
//               source={{ uri: item.image }} 
//               style={styles.artImage} 
//               resizeMode="cover"
//             />
//             <TouchableOpacity 
//               onPress={(e) => {
//                 e.stopPropagation();
//                 toggleLike(item.id);
//               }} 
//               style={styles.likeButton}
//               testID={`like-button-${item.id}`}
//             >
//               <Ionicons 
//                 name={likedPaintings[item.id] ? "heart" : "heart-outline"} 
//                 size={24} 
//                 color={likedPaintings[item.id] ? "red" : "#333"} 
//               />
//             </TouchableOpacity>
//             <View style={styles.artInfo}>
//               <Text style={styles.artTitle} numberOfLines={1}>{item.title}</Text>
//               {isLoggedIn ? (
//                 <Text style={styles.artPrice}>₹{item.price.toLocaleString()}</Text>
//               ) : (
//                 <TouchableOpacity
//                   onPress={(e) => {
//                     e.stopPropagation();
//                     navigation.navigate("Login", { redirectTo: "Gallery" });
//                   }}
//                 >
//                   <Text style={styles.loginToViewPrice}>Login to view price</Text>
//                 </TouchableOpacity>
//               )}
//               <TouchableOpacity
//                 onPress={(e) => {
//                   e.stopPropagation();
//                   handleAddToCart(item);
//                 }}
//                 style={[
//                   styles.cartButton, 
//                   isInCart(item.id) ? styles.addedToCart : styles.notInCart,
//                   !isLoggedIn && styles.disabledCartButton
//                 ]}
//                 testID={`cart-button-${item.id}`}
//                 disabled={!isLoggedIn}
//               >
//                 <Text style={styles.cartButtonText}>
//                   {isInCart(item.id) ? "Added ✓" : "Add to Cart"}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { 
//     flex: 1, 
//     backgroundColor: "#f8f9fa", 
//     padding: 10 
//   },
//   disabledCartButton: {
//     backgroundColor: "#cccccc",
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 10,
//     paddingHorizontal: 10,
//     marginTop: 27,
//   },
//   title: { 
//     fontSize: 26, 
//     fontWeight: "bold",
//   },
//   cartIcon: {
//     position: "relative",
//     padding: 10,
//   },
//   badge: {
//     position: "absolute",
//     right: 5,
//     top: 5,
//     backgroundColor: "red",
//     borderRadius: 10,
//     width: 20,
//     height: 20,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   badgeText: {
//     color: "white",
//     fontSize: 12,
//     fontWeight: "bold",
//   },
//   categoryContainer: { 
//     flexDirection: "row", 
//     justifyContent: "center", 
//     marginVertical: 10,
//     flexWrap: "wrap",
//   },
//   categoryTab: { 
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 20, 
//     margin: 5, 
//     backgroundColor: "#f0f0f0",
//   },
//   selectedCategoryTab: { 
//     backgroundColor: "#6a11cb",
//   },
//   categoryTabText: { 
//     fontWeight: "600",
//     color: "#333",
//   },
//   selectedCategoryTabText: { 
//     color: "#fff",
//   },
//   listContainer: {
//     paddingBottom: 20,
//   },
//   artCard: {
//     flex: 1,
//     minWidth: "48%",
//     maxWidth: "48%",
//     margin: "1%",
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     padding: 10,
//     position: "relative",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   artImage: { 
//     width: "100%", 
//     height: 180, 
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   artInfo: { 
//     paddingTop: 5,
//   },
//   artTitle: { 
//     fontWeight: "600",
//     fontSize: 14,
//     marginBottom: 5,
//   },
//   artPrice: { 
//     fontSize: 16, 
//     fontWeight: "bold", 
//     color: "#6a11cb",
//     marginBottom: 10,
//   },
//   loginToViewPrice: {
//     fontSize: 14,
//     color: "#6a11cb",
//     marginBottom: 10,
//     textDecorationLine: "underline",
//   },
//   likeButton: { 
//     position: "absolute", 
//     top: 15, 
//     right: 15,
//     backgroundColor: "rgba(255,255,255,0.7)",
//     borderRadius: 20,
//     padding: 5,
//   },
//   cartButton: {
//     paddingVertical: 8,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   notInCart: {
//     backgroundColor: "#6a11cb",
//   },
//   addedToCart: { 
//     backgroundColor: "#4CAF50",
//   },
//   cartButtonText: { 
//     color: "#fff", 
//     fontWeight: "bold",
//     fontSize: 14,
//   },
//   // Modal styles
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.7)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     width: width * 0.9,
//     maxHeight: height * 0.85,
//     backgroundColor: 'white',
//     borderRadius: 15,
//     padding: 20,
//     alignItems: 'center',
//   },
//   modalImage: {
//     width: '100%',
//     height: 250,
//     borderRadius: 10,
//     marginBottom: 15,
//   },
//   modalDetails: {
//     width: '100%',
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 5,
//   },
//   modalCategory: {
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 10,
//   },
//   modalPrice: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#6a11cb',
//     textAlign: 'center',
//     marginBottom: 15,
//   },
//   modalDescription: {
//     fontSize: 14,
//     color: '#555',
//     textAlign: 'center',
//     marginBottom: 20,
//     lineHeight: 20,
//   },
//   modalActions: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
//     marginBottom: 20,
//   },
//   modalActionButton: {
//     padding: 10,
//     borderRadius: 8,
//     backgroundColor: '#f0f0f0',
//   },
//   modalAddToCart: {
//     flex: 1,
//     marginLeft: 15,
//     padding: 10,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   closeButton: {
//     position: 'absolute',
//     top: 10,
//     right: 10,
//     padding: 5,
//     backgroundColor: 'rgba(255,255,255,0.7)',
//     borderRadius: 20,
//   },
//   // Recommended paintings styles
//   recommendedSection: {
//     width: '100%',
//     marginTop: 10,
//   },
//   recommendedTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     color: '#333',
//   },
//   recommendedList: {
//     paddingBottom: 10,
//   },
//   recommendedItem: {
//     width: 120,
//     marginRight: 10,
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     padding: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   recommendedImage: {
//     width: '100%',
//     height: 100,
//     borderRadius: 5,
//     marginBottom: 5,
//   },
//   recommendedText: {
//     fontSize: 12,
//     fontWeight: '500',
//     marginBottom: 3,
//   },
//   recommendedPrice: {
//     fontSize: 12,
//     fontWeight: 'bold',
//     color: '#6a11cb',
//   },
// });

// export default Gallery;
// import React, { useState, useEffect } from "react";
// import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Alert, Modal, TouchableWithoutFeedback, Dimensions } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import paintings from "./Painting.json";
// import { useNavigation, useIsFocused } from "@react-navigation/native";
// import { StackNavigationProp } from "@react-navigation/stack";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useCart } from "./Context/CartContext";
// import { useNetwork } from "./NetworkStatusProvider"; // Import the network context
// type Painting = {
//   id: string;
//   title: string;
//   price: number;
//   image: string;
//   category: string;
//   description?: string;
// };

// type RootStackParamList = {
//   Gallery: { updatedCart?: Record<string, boolean>, fromLogin?: boolean };
//   Cart: undefined;
//   Login: { redirectTo: string };
//   LikedPaintings: undefined;
// };

// const { width, height } = Dimensions.get('window');
// const categories = ["All", "Sketch", "Mandala", "Coloured"];
// const LIKED_PAINTINGS_KEY = 'liked_paintings';

// const Gallery = ({ route }: { route: { params?: RootStackParamList['Gallery'] } }) => {
//   const navigation = useNavigation<StackNavigationProp<RootStackParamList, "Gallery">>();
//   const isFocused = useIsFocused();
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [likedPaintings, setLikedPaintings] = useState<Record<string, boolean>>({});
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [selectedPainting, setSelectedPainting] = useState<Painting | null>(null);
//   const [modalVisible, setModalVisible] = useState(false);

//   const {
//     cart,
//     addToCart,
//     removeFromCart,
//     getTotalItems,
//     isLoading: isCartLoading
//   } = useCart();

//   const loadLikedPaintings = async () => {
//     try {
//       const jsonValue = await AsyncStorage.getItem(LIKED_PAINTINGS_KEY);
//       if (jsonValue !== null) {
//         setLikedPaintings(JSON.parse(jsonValue));
//       }
//     } catch (e) {
//       console.error('Failed to load liked paintings', e);
//     }
//   };

//   const saveLikedPaintings = async (likes: Record<string, boolean>) => {
//     try {
//       await AsyncStorage.setItem(LIKED_PAINTINGS_KEY, JSON.stringify(likes));
//     } catch (e) {
//       console.error('Failed to save liked paintings', e);
//     }
//   };

//   useEffect(() => {
//     const checkLoginStatus = async () => {
//       try {
//         const token = await AsyncStorage.getItem('userToken');
//         setIsLoggedIn(!!token);
        
//         if (route.params?.fromLogin) {
//           setIsLoggedIn(true);
//         }
        
//         await loadLikedPaintings();
//       } catch (error) {
//         console.error('Error checking login status:', error);
//       }
//     };
    
//     checkLoginStatus();
//   }, [isFocused, route.params?.fromLogin]);

//   const filteredPaintings = selectedCategory === "All"
//     ? paintings
//     : paintings.filter((painting) => painting.category === selectedCategory);

//   const getRecommendedPaintings = () => {
//     if (!selectedPainting) return [];
//     return paintings
//       .filter(p => p.category === selectedPainting.category && p.id !== selectedPainting.id)
//       .slice(0, 4);
//   };

//   const recommendedPaintings = getRecommendedPaintings();

//   const toggleLike = async (id: string) => {
//     const newLikes = { ...likedPaintings, [id]: !likedPaintings[id] };
//     setLikedPaintings(newLikes);
//     await saveLikedPaintings(newLikes);
//   };


//   const MyComponent = () => {
//     const { isConnected } = useNetwork();
  
//     return (
//       <Text>{isConnected ? 'Online 🎉' : 'Offline 😢'}</Text>
//     );
//   };

//   const handleAddToCart = (painting: Painting) => {
//     if (!isLoggedIn) {
//       Alert.alert(
//         "Login Required",
//         "You need to login to add items to cart",
//         [
//           { text: "Cancel", style: "cancel" },
//           { text: "Login", onPress: () => navigation.navigate("Login", { redirectTo: "Gallery" }) }
//         ]
//       );
//       return;
//     }
    
//     if (isInCart(painting.id)) {
//       Alert.alert("Already in Cart", "This painting is already in your cart");
//       return;
//     }
    
//     addToCart({
//       id: painting.id,
//       title: painting.title,
//       price: painting.price,
//       image: painting.image
//     });
//   };

//   const navigateToCart = () => {
//     if (!isLoggedIn) {
//       Alert.alert(
//         "Login Required",
//         "You need to login to view your cart",
//         [
//           { text: "Cancel", style: "cancel" },
//           { text: "Login", onPress: () => navigation.navigate("Login", { redirectTo: "Cart" }) }
//         ]
//       );
//       return;
//     }
    
//     navigation.navigate("Cart");
//   };

//   const navigateToLikedPaintings = () => {
//     if (!isLoggedIn) {
//       Alert.alert(
//         "Login Required",
//         "You need to login to view your liked paintings",
//         [
//           { text: "Cancel", style: "cancel" },
//           { text: "Login", onPress: () => navigation.navigate("Login", { redirectTo: "Gallery" }) }
//         ]
//       );
//       return;
//     }
//     navigation.navigate("LikedPaintings");
//   };

//   const openPaintingModal = (painting: Painting) => {
//     setSelectedPainting(painting);
//     setModalVisible(true);
//   };

//   const closePaintingModal = () => {
//     setModalVisible(false);
//     setSelectedPainting(null);
//   };

//   const cartItemsCount = getTotalItems();
//   const likedItemsCount = Object.keys(likedPaintings).filter(id => likedPaintings[id]).length;

//   const isInCart = (id: string) => {
//     return cart.some(item => item.id === id);
//   };

//   return (
//     <View style={styles.container}>
//       <Modal
//         animationType="fade"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={closePaintingModal}
//       >
//         <TouchableWithoutFeedback onPress={closePaintingModal}>
//           <View style={styles.modalOverlay}>
//             <TouchableWithoutFeedback>
//               <View style={styles.modalContent}>
//                 {selectedPainting && (
//                   <>
//                     <Image 
//                       source={{ uri: selectedPainting.image }} 
//                       style={styles.modalImage}
//                       resizeMode="contain"
//                     />
//                     <View style={styles.modalDetails}>
//                       <Text style={styles.modalTitle}>{selectedPainting.title}</Text>
//                       <Text style={styles.modalCategory}>{selectedPainting.category}</Text>
//                       {isLoggedIn ? (
//                         <Text style={styles.modalPrice}>₹{selectedPainting.price.toLocaleString()}</Text>
//                       ) : (
//                         <TouchableOpacity
//                           onPress={() => {
//                             closePaintingModal();
//                             navigation.navigate("Login", { redirectTo: "Gallery" });
//                           }}
//                         >
//                           <Text style={styles.loginToViewPrice}>Login to view price</Text>
//                         </TouchableOpacity>
//                       )}
//                       <Text style={styles.modalDescription}>
//                         {selectedPainting.description || "Beautiful handmade artwork by Deepti Art."}
//                       </Text>
//                       <View style={styles.modalActions}>
//                         <TouchableOpacity 
//                           onPress={() => {
//                             toggleLike(selectedPainting.id);
//                           }}
//                           style={styles.modalActionButton}
//                         >
//                           <Ionicons 
//                             name={likedPaintings[selectedPainting.id] ? "heart" : "heart-outline"} 
//                             size={24} 
//                             color={likedPaintings[selectedPainting.id] ? "red" : "#333"} 
//                           />
//                         </TouchableOpacity>
//                         <TouchableOpacity
//                           onPress={() => handleAddToCart(selectedPainting)}
//                           style={[
//                             styles.modalAddToCart,
//                             isInCart(selectedPainting.id) ? styles.addedToCart : styles.notInCart,
//                             (!isLoggedIn || isInCart(selectedPainting.id)) && styles.disabledCartButton
//                           ]}
//                           disabled={!isLoggedIn || isInCart(selectedPainting.id)}
//                         >
//                           <Text style={styles.cartButtonText}>
//                             {isInCart(selectedPainting.id) ? "Added to Cart" : "Add to Cart"}
//                           </Text>
//                         </TouchableOpacity>
//                       </View>

//                       {recommendedPaintings.length > 0 && (
//                         <View style={styles.recommendedSection}>
//                           <Text style={styles.recommendedTitle}>You may also like</Text>
//                           <FlatList
//                             horizontal
//                             data={recommendedPaintings}
//                             keyExtractor={(item) => item.id}
//                             showsHorizontalScrollIndicator={false}
//                             renderItem={({ item }) => (
//                               <TouchableOpacity 
//                                 style={styles.recommendedItem}
//                                 onPress={() => {
//                                   setSelectedPainting(item);
//                                 }}
//                               >
//                                 <Image 
//                                   source={{ uri: item.image }} 
//                                   style={styles.recommendedImage}
//                                   resizeMode="cover"
//                                 />
//                                 <Text 
//                                   style={styles.recommendedText}
//                                   numberOfLines={1}
//                                 >
//                                   {item.title}
//                                 </Text>
//                                 {isLoggedIn && (
//                                   <Text style={styles.recommendedPrice}>
//                                     ₹{item.price.toLocaleString()}
//                                   </Text>
//                                 )}
//                               </TouchableOpacity>
//                             )}
//                             contentContainerStyle={styles.recommendedList}
//                           />
//                         </View>
//                       )}
//                     </View>
//                     <TouchableOpacity 
//                       onPress={closePaintingModal}
//                       style={styles.closeButton}
//                     >
//                       <Ionicons name="close" size={24} color="#333" />
//                     </TouchableOpacity>
//                   </>
//                 )}
//               </View>
//             </TouchableWithoutFeedback>
//           </View>
//         </TouchableWithoutFeedback>
//       </Modal>

//       <View style={styles.header}>
//         <Text style={styles.title}>Deepti Art</Text>
//         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//           {isLoggedIn && (
//             <>
//               <TouchableOpacity 
//                 onPress={navigateToLikedPaintings}
//                 style={{ marginRight: 15, padding: 5 }}
//               >
//                 <Ionicons name="heart" size={24} color="red" />
//                 {likedItemsCount > 0 && (
//                   <View style={[styles.badge, { backgroundColor: 'red' }]}>
//                     <Text style={styles.badgeText}>{likedItemsCount}</Text>
//                   </View>
//                 )}
//               </TouchableOpacity>
//               <TouchableOpacity 
//                 onPress={() => {
//                   AsyncStorage.removeItem('userToken');
//                   setIsLoggedIn(false);
//                 }}
//                 style={{ marginRight: 15 }}
//               >
//                 <Ionicons name="log-out-outline" size={24} color="black" />
//               </TouchableOpacity>
//             </>
//           )}
//           <TouchableOpacity 
//             onPress={navigateToCart}
//             style={styles.cartIcon}
//             testID="cart-button"
//           >
//             <Ionicons name="cart-outline" size={24} color="black" />
//             {cartItemsCount > 0 && (
//               <View style={styles.badge}>
//                 <Text style={styles.badgeText}>{cartItemsCount}</Text>
//               </View>
//             )}
//           </TouchableOpacity>
//         </View>
//       </View>

//       <View style={styles.categoryContainer}>
//         {categories.map((category) => (
//           <TouchableOpacity
//             key={category}
//             style={[
//               styles.categoryTab,
//               selectedCategory === category && styles.selectedCategoryTab,
//             ]}
//             onPress={() => setSelectedCategory(category)}
//           >
//             <Text
//               style={[
//                 styles.categoryTabText,
//                 selectedCategory === category && styles.selectedCategoryTabText,
//               ]}
//             >
//               {category}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       <FlatList
//         data={filteredPaintings}
//         keyExtractor={(item) => item.id}
//         numColumns={2}
//         contentContainerStyle={styles.listContainer}
//         renderItem={({ item }) => (
//           <TouchableOpacity 
//             style={styles.artCard}
//             onPress={() => openPaintingModal(item)}
//             activeOpacity={0.8}
//           >
//             <Image 
//               source={{ uri: item.image }} 
//               style={styles.artImage} 
//               resizeMode="cover"
//             />
//             <TouchableOpacity 
//               onPress={(e) => {
//                 e.stopPropagation();
//                 toggleLike(item.id);
//               }} 
//               style={styles.likeButton}
//               testID={`like-button-${item.id}`}
//             >
//               <Ionicons 
//                 name={likedPaintings[item.id] ? "heart" : "heart-outline"} 
//                 size={24} 
//                 color={likedPaintings[item.id] ? "red" : "#333"} 
//               />
//             </TouchableOpacity>
//             <View style={styles.artInfo}>
//               <Text style={styles.artTitle} numberOfLines={1}>{item.title}</Text>
//               {isLoggedIn ? (
//                 <Text style={styles.artPrice}>₹{item.price.toLocaleString()}</Text>
//               ) : (
//                 <TouchableOpacity
//                   onPress={(e) => {
//                     e.stopPropagation();
//                     navigation.navigate("Login", { redirectTo: "Gallery" });
//                   }}
//                 >
//                   <Text style={styles.loginToViewPrice}>Login to view price</Text>
//                 </TouchableOpacity>
//               )}
//               <TouchableOpacity
//                 onPress={(e) => {
//                   e.stopPropagation();
//                   handleAddToCart(item);
//                 }}
//                 style={[
//                   styles.cartButton, 
//                   isInCart(item.id) ? styles.addedToCart : styles.notInCart,
//                   (!isLoggedIn || isInCart(item.id)) && styles.disabledCartButton
//                 ]}
//                 testID={`cart-button-${item.id}`}
//                 disabled={!isLoggedIn || isInCart(item.id)}
//               >
//                 <Text style={styles.cartButtonText}>
//                   {isInCart(item.id) ? "Added ✓" : "Add to Cart"}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { 
//     flex: 1, 
//     backgroundColor: "#f8f9fa", 
//     padding: 10 
//   },
//   disabledCartButton: {
//     backgroundColor: "#cccccc",
//     opacity: 0.6,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 10,
//     paddingHorizontal: 10,
//     marginTop: 27,
//   },
//   title: { 
//     fontSize: 26, 
//     fontWeight: "bold",
//   },
//   cartIcon: {
//     position: "relative",
//     padding: 10,
//   },
//   badge: {
//     position: "absolute",
//     right: 5,
//     top: 5,
//     backgroundColor: "red",
//     borderRadius: 10,
//     width: 20,
//     height: 20,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   badgeText: {
//     color: "white",
//     fontSize: 12,
//     fontWeight: "bold",
//   },
//   categoryContainer: { 
//     flexDirection: "row", 
//     justifyContent: "center", 
//     marginVertical: 10,
//     flexWrap: "wrap",
//   },
//   categoryTab: { 
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 20, 
//     margin: 5, 
//     backgroundColor: "#f0f0f0",
//   },
//   selectedCategoryTab: { 
//     backgroundColor: "#6a11cb",
//   },
//   categoryTabText: { 
//     fontWeight: "600",
//     color: "#333",
//   },
//   selectedCategoryTabText: { 
//     color: "#fff",
//   },
//   listContainer: {
//     paddingBottom: 20,
//   },
//   artCard: {
//     flex: 1,
//     minWidth: "48%",
//     maxWidth: "48%",
//     margin: "1%",
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     padding: 10,
//     position: "relative",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   artImage: { 
//     width: "100%", 
//     height: 180, 
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   artInfo: { 
//     paddingTop: 5,
//   },
//   artTitle: { 
//     fontWeight: "600",
//     fontSize: 14,
//     marginBottom: 5,
//   },
//   artPrice: { 
//     fontSize: 16, 
//     fontWeight: "bold", 
//     color: "#6a11cb",
//     marginBottom: 10,
//   },
//   loginToViewPrice: {
//     fontSize: 14,
//     color: "#6a11cb",
//     marginBottom: 10,
//     textDecorationLine: "underline",
//   },
//   likeButton: { 
//     position: "absolute", 
//     top: 15, 
//     right: 15,
//     backgroundColor: "rgba(255,255,255,0.7)",
//     borderRadius: 20,
//     padding: 5,
//   },
//   cartButton: {
//     paddingVertical: 8,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   notInCart: {
//     backgroundColor: "#6a11cb",
//   },
//   addedToCart: { 
//         backgroundColor: "#4CAF50",
//    },
//   cartButtonText: { 
//     color: "#fff", 
//     fontWeight: "bold",
//     fontSize: 14,
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.7)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     width: width * 0.9,
//     maxHeight: height * 0.85,
//     backgroundColor: 'white',
//     borderRadius: 15,
//     padding: 20,
//     alignItems: 'center',
//   },
//   modalImage: {
//     width: '100%',
//     height: 250,
//     borderRadius: 10,
//     marginBottom: 15,
//   },
//   modalDetails: {
//     width: '100%',
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 5,
//   },
//   modalCategory: {
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 10,
//   },
//   modalPrice: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#6a11cb',
//     textAlign: 'center',
//     marginBottom: 15,
//   },
//   modalDescription: {
//     fontSize: 14,
//     color: '#555',
//     textAlign: 'center',
//     marginBottom: 20,
//     lineHeight: 20,
//   },
//   modalActions: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
//     marginBottom: 20,
//   },
//   modalActionButton: {
//     padding: 10,
//     borderRadius: 8,
//     backgroundColor: '#f0f0f0',
//   },
//   modalAddToCart: {
//     flex: 1,
//     marginLeft: 15,
//     padding: 10,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   closeButton: {
//     position: 'absolute',
//     top: 10,
//     right: 10,
//     padding: 5,
//     backgroundColor: 'rgba(255,255,255,0.7)',
//     borderRadius: 20,
//   },
//   recommendedSection: {
//     width: '100%',
//     marginTop: 10,
//   },
//   recommendedTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     color: '#333',
//   },
//   recommendedList: {
//     paddingBottom: 10,
//   },
//   recommendedItem: {
//     width: 120,
//     marginRight: 10,
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     padding: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   recommendedImage: {
//     width: '100%',
//     height: 100,
//     borderRadius: 5,
//     marginBottom: 5,
//   },
//   recommendedText: {
//     fontSize: 12,
//     fontWeight: '500',
//     marginBottom: 3,
//   },
//   recommendedPrice: {
//     fontSize: 12,
//     fontWeight: 'bold',
//     color: '#6a11cb',
//   },
// });

// export default Gallery;
import React, { useState, useEffect, useMemo } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  Dimensions,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ImageViewer from 'react-native-image-zoom-viewer';
import RNModal from 'react-native-modal';
import paintings from "./Painting.json";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCart } from "./Context/CartContext";
import { useNetwork } from "./NetworkStatusProvider";

type Painting = {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  description?: string;
};

type RootStackParamList = {
  Gallery: { updatedCart?: Record<string, boolean>, fromLogin?: boolean };
  Cart: undefined;
  Login: { redirectTo: string };
  LikedPaintings: undefined;
};

const { width, height } = Dimensions.get('window');
const categories = ["All", "Sketch", "Mandala", "Coloured"];
const LIKED_PAINTINGS_KEY = 'liked_paintings';

const Gallery = ({ route }: { route: { params?: RootStackParamList['Gallery'] } }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, "Gallery">>();
  const isFocused = useIsFocused();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [likedPaintings, setLikedPaintings] = useState<Record<string, boolean>>({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedPainting, setSelectedPainting] = useState<Painting | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>({});

  const { isConnected } = useNetwork();
  const { cart, addToCart, removeFromCart, getTotalItems } = useCart();

  const loadLikedPaintings = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(LIKED_PAINTINGS_KEY);
      if (jsonValue !== null) {
        setLikedPaintings(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error('Failed to load liked paintings', e);
    }
  };

  const saveLikedPaintings = async (likes: Record<string, boolean>) => {
    try {
      await AsyncStorage.setItem(LIKED_PAINTINGS_KEY, JSON.stringify(likes));
    } catch (e) {
      console.error('Failed to save liked paintings', e);
    }
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        setIsLoggedIn(!!token);
        
        if (route.params?.fromLogin) {
          setIsLoggedIn(true);
        }
        
        await loadLikedPaintings();
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };
    
    checkLoginStatus();
  }, [isFocused, route.params?.fromLogin]);

  const filteredPaintings = useMemo(() => (
    selectedCategory === "All"
      ? paintings
      : paintings.filter((painting) => painting.category === selectedCategory)
  ), [selectedCategory]);

  const recommendedPaintings = useMemo(() => {
    if (!selectedPainting) return [];
    return paintings
      .filter(p => p.category === selectedPainting.category && p.id !== selectedPainting.id)
      .slice(0, 4);
  }, [selectedPainting]);

  const isInCart = useMemo(() => 
    (id: string) => cart.some(item => item.id === id),
    [cart]
  );

  const toggleLike = async (id: string) => {
    const newLikes = { ...likedPaintings, [id]: !likedPaintings[id] };
    setLikedPaintings(newLikes);
    await saveLikedPaintings(newLikes);
  };

  const handleAddToCart = (painting: Painting) => {
    if (!isLoggedIn) {
      Alert.alert(
        "Login Required",
        "You need to login to add items to cart",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Login", onPress: () => navigation.navigate("Login", { redirectTo: "Gallery" }) }
        ]
      );
      return;
    }
    
    if (isInCart(painting.id)) {
      Alert.alert("Already in Cart", "This painting is already in your cart");
      return;
    }
    
    addToCart({
      id: painting.id,
      title: painting.title,
      price: painting.price,
      image: painting.image
    });
  };

  const navigateToCart = () => {
    if (!isLoggedIn) {
      Alert.alert(
        "Login Required",
        "You need to login to view your cart",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Login", onPress: () => navigation.navigate("Login", { redirectTo: "Cart" }) }
        ]
      );
      return;
    }
    
    navigation.navigate("Cart");
  };

  const navigateToLikedPaintings = () => {
    if (!isLoggedIn) {
      Alert.alert(
        "Login Required",
        "You need to login to view your liked paintings",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Login", onPress: () => navigation.navigate("Login", { redirectTo: "Gallery" }) }
        ]
      );
      return;
    }
    navigation.navigate("LikedPaintings");
  };

  const openPaintingModal = (painting: Painting) => {
    setSelectedPainting(painting);
    setModalVisible(true);
  };

  const closePaintingModal = () => {
    setModalVisible(false);
    setSelectedPainting(null);
  };

  const handleImageLoadStart = (id: string) => {
    setLoadingImages(prev => ({ ...prev, [id]: true }));
  };

  const handleImageLoadEnd = (id: string) => {
    setLoadingImages(prev => ({ ...prev, [id]: false }));
  };

  const cartItemsCount = getTotalItems();
  const likedItemsCount = Object.keys(likedPaintings).filter(id => likedPaintings[id]).length;

  return (
    <View style={styles.container}>
      {/* Network Status Indicator */}
      <View style={styles.networkStatus}>
        <Text style={styles.networkStatusText}>
          {isConnected ? 'Online 🎉' : 'Offline 😢'}
        </Text>
      </View>

      {/* Painting Details Modal */}
      <RNModal
        isVisible={modalVisible}
        onBackdropPress={closePaintingModal}
        onBackButtonPress={closePaintingModal}
        animationIn="fadeIn"
        animationOut="fadeOut"
        backdropTransitionOutTiming={0}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          {selectedPainting && (
            <>
              <View style={styles.imageViewerContainer}>
                <ImageViewer
                  imageUrls={[{ url: selectedPainting.image }]}
                  backgroundColor="transparent"
                  enableSwipeDown
                  onSwipeDown={closePaintingModal}
                  renderIndicator={() => <View />}
                  saveToLocalByLongPress={false}
                  enablePreload
                  swipeDownThreshold={50}
                  renderHeader={() => (
                    <TouchableOpacity
                      onPress={closePaintingModal}
                      style={styles.closeButton}
                    >
                      <Ionicons name="close" size={24} color="#333" />
                    </TouchableOpacity>
                  )}
                />
              </View>

              <View style={styles.modalDetails}>
                <Text style={styles.modalTitle}>{selectedPainting.title}</Text>
                <Text style={styles.modalCategory}>{selectedPainting.category}</Text>
                
                {isLoggedIn ? (
                  <Text style={styles.modalPrice}>₹{selectedPainting.price.toLocaleString()}</Text>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      closePaintingModal();
                      navigation.navigate("Login", { redirectTo: "Gallery" });
                    }}
                  >
                    <Text style={styles.loginToViewPrice}>Login to view price</Text>
                  </TouchableOpacity>
                )}
                
                <Text style={styles.modalDescription}>
                  {selectedPainting.description || "Beautiful handmade artwork by Deepti Art."}
                </Text>
                
                <View style={styles.modalActions}>
                  <TouchableOpacity 
                    onPress={() => toggleLike(selectedPainting.id)}
                    style={styles.modalActionButton}
                    accessibilityLabel={likedPaintings[selectedPainting.id] ? "Unlike this painting" : "Like this painting"}
                  >
                    <Ionicons 
                      name={likedPaintings[selectedPainting.id] ? "heart" : "heart-outline"} 
                      size={24} 
                      color={likedPaintings[selectedPainting.id] ? "red" : "#333"} 
                    />
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    onPress={() => handleAddToCart(selectedPainting)}
                    style={[
                      styles.modalAddToCart,
                      isInCart(selectedPainting.id) ? styles.addedToCart : styles.notInCart,
                      (!isLoggedIn || isInCart(selectedPainting.id)) && styles.disabledCartButton
                    ]}
                    disabled={!isLoggedIn || isInCart(selectedPainting.id)}
                    accessibilityLabel={isInCart(selectedPainting.id) ? "Already in cart" : "Add to cart"}
                  >
                    <Text style={styles.cartButtonText}>
                      {isInCart(selectedPainting.id) ? "Added to Cart" : "Add to Cart"}
                    </Text>
                  </TouchableOpacity>
                </View>

                {recommendedPaintings.length > 0 && (
                  <View style={styles.recommendedSection}>
                    <Text style={styles.recommendedTitle}>You may also like</Text>
                    <FlatList
                      horizontal
                      data={recommendedPaintings}
                      keyExtractor={(item) => item.id}
                      showsHorizontalScrollIndicator={false}
                      renderItem={({ item }) => (
                        <TouchableOpacity 
                          style={styles.recommendedItem}
                          onPress={() => setSelectedPainting(item)}
                        >
                          <Image 
                            source={{ uri: item.image }} 
                            style={styles.recommendedImage}
                            resizeMode="cover"
                          />
                          <Text style={styles.recommendedText} numberOfLines={1}>
                            {item.title}
                          </Text>
                          {isLoggedIn && (
                            <Text style={styles.recommendedPrice}>
                              ₹{item.price.toLocaleString()}
                            </Text>
                          )}
                        </TouchableOpacity>
                      )}
                      contentContainerStyle={styles.recommendedList}
                    />
                  </View>
                )}
              </View>
            </>
          )}
        </View>
      </RNModal>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Deepti Art</Text>
        <View style={styles.headerIcons}>
          {isLoggedIn && (
            <>
              <TouchableOpacity 
                onPress={navigateToLikedPaintings}
                style={styles.iconButton}
                accessibilityLabel="View liked paintings"
              >
                <Ionicons name="heart" size={24} color="red" />
                {likedItemsCount > 0 && (
                  <View style={[styles.badge, { backgroundColor: 'red' }]}>
                    <Text style={styles.badgeText}>{likedItemsCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={async () => {
                  await AsyncStorage.removeItem('userToken');
                  setIsLoggedIn(false);
                }}
                style={styles.iconButton}
                accessibilityLabel="Logout"
              >
                <Ionicons name="log-out-outline" size={24} color="black" />
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity 
            onPress={navigateToCart}
            style={styles.cartIcon}
            testID="cart-button"
            accessibilityLabel="View cart"
          >
            <Ionicons name="cart-outline" size={24} color="black" />
            {cartItemsCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartItemsCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Tabs */}
      <View style={styles.categoryContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryTab,
              selectedCategory === category && styles.selectedCategoryTab,
            ]}
            onPress={() => setSelectedCategory(category)}
            accessibilityLabel={`Filter by ${category}`}
          >
            <Text
              style={[
                styles.categoryTabText,
                selectedCategory === category && styles.selectedCategoryTabText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Paintings Grid */}
      <FlatList
        data={filteredPaintings}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.artCard}
            onPress={() => openPaintingModal(item)}
            activeOpacity={0.8}
            accessibilityLabel={`View details of ${item.title}`}
          >
            {loadingImages[item.id] && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6a11cb" />
              </View>
            )}
            <Image 
              source={{ uri: item.image }} 
              style={styles.artImage} 
              resizeMode="cover"
              onLoadStart={() => handleImageLoadStart(item.id)}
              onLoadEnd={() => handleImageLoadEnd(item.id)}
            />
            <TouchableOpacity 
              onPress={(e) => {
                e.stopPropagation();
                toggleLike(item.id);
              }} 
              style={styles.likeButton}
              testID={`like-button-${item.id}`}
              accessibilityLabel={likedPaintings[item.id] ? "Unlike this painting" : "Like this painting"}
            >
              <Ionicons 
                name={likedPaintings[item.id] ? "heart" : "heart-outline"} 
                size={24} 
                color={likedPaintings[item.id] ? "red" : "#333"} 
              />
            </TouchableOpacity>
            <View style={styles.artInfo}>
              <Text style={styles.artTitle} numberOfLines={1}>{item.title}</Text>
              {isLoggedIn ? (
                <Text style={styles.artPrice}>₹{item.price.toLocaleString()}</Text>
              ) : (
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    navigation.navigate("Login", { redirectTo: "Gallery" });
                  }}
                >
                  <Text style={styles.loginToViewPrice}>Login to view price</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  handleAddToCart(item);
                }}
                style={[
                  styles.cartButton, 
                  isInCart(item.id) ? styles.addedToCart : styles.notInCart,
                  (!isLoggedIn || isInCart(item.id)) && styles.disabledCartButton
                ]}
                testID={`cart-button-${item.id}`}
                disabled={!isLoggedIn || isInCart(item.id)}
                accessibilityLabel={isInCart(item.id) ? "Already in cart" : "Add to cart"}
              >
                <Text style={styles.cartButtonText}>
                  {isInCart(item.id) ? "Added ✓" : "Add to Cart"}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f8f9fa", 
    padding: 10 
  },
  networkStatus: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 100,
    backgroundColor: 'transparent',
    padding: 5,
    borderRadius: 5,
  },
  networkStatusText: {
    color: 'white',
    fontSize: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 10,
    marginTop: 27,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: { 
    fontSize: 26, 
    fontWeight: "bold",
  },
  iconButton: {
    marginRight: 15,
    padding: 5,
    position: 'relative',
  },
  cartIcon: {
    position: "relative",
    padding: 10,
  },
  badge: {
    position: "absolute",
    right: 5,
    top: 5,
    backgroundColor: "red",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  categoryContainer: { 
    flexDirection: "row", 
    justifyContent: "center", 
    marginVertical: 10,
    flexWrap: "wrap",
  },
  categoryTab: { 
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20, 
    margin: 5, 
    backgroundColor: "#f0f0f0",
  },
  selectedCategoryTab: { 
    backgroundColor: "#6a11cb",
  },
  categoryTabText: { 
    fontWeight: "600",
    color: "#333",
  },
  selectedCategoryTabText: { 
    color: "#fff",
  },
  listContainer: {
    paddingBottom: 20,
  },
  artCard: {
    flex: 1,
    minWidth: "48%",
    maxWidth: "48%",
    margin: "1%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  artImage: { 
    width: "100%", 
    height: 180, 
    borderRadius: 10,
    marginBottom: 10,
  },
  artInfo: { 
    paddingTop: 5,
  },
  artTitle: { 
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 5,
  },
  artPrice: { 
    fontSize: 16, 
    fontWeight: "bold", 
    color: "#6a11cb",
    marginBottom: 10,
  },
  loginToViewPrice: {
    fontSize: 14,
    color: "#6a11cb",
    marginBottom: 10,
    textDecorationLine: "underline",
  },
  likeButton: { 
    position: "absolute", 
    top: 15, 
    right: 15,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 20,
    padding: 5,
    zIndex: 2,
  },
  cartButton: {
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  notInCart: {
    backgroundColor: "#6a11cb",
  },
  addedToCart: { 
    backgroundColor: "#4CAF50",
  },
  disabledCartButton: {
    backgroundColor: "#cccccc",
    opacity: 0.6,
  },
  cartButtonText: { 
    color: "#fff", 
    fontWeight: "bold",
    fontSize: 14,
  },
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.9,
  },
  imageViewerContainer: {
    height: 300,
    width: '100%',
  },
  modalDetails: {
    width: '100%',
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  modalCategory: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6a11cb',
    textAlign: 'center',
    marginBottom: 15,
  },
  modalDescription: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  modalActionButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  modalAddToCart: {
    flex: 1,
    marginLeft: 15,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20,
    zIndex: 1,
  },
  recommendedSection: {
    width: '100%',
    marginTop: 10,
  },
  recommendedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  recommendedList: {
    paddingBottom: 10,
  },
  recommendedItem: {
    width: 120,
    marginRight: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  recommendedImage: {
    width: '100%',
    height: 100,
    borderRadius: 5,
    marginBottom: 5,
  },
  recommendedText: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 3,
  },
  recommendedPrice: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6a11cb',
  },
});

export default Gallery;