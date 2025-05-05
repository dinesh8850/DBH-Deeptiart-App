// import React, { useState, useEffect } from "react";
// import { View, Text, StyleSheet, Image, Animated } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";

// export default function MainApp() {
//   const [slideAnim] = useState(new Animated.Value(90)); // Starts 50 pixels down
//   const [opacityAnim] = useState(new Animated.Value(1)); // Starts fully visible

//   useEffect(() => {
//     Animated.sequence([
//       Animated.timing(slideAnim, {
//         toValue: 0,
//         duration: 1000,
//         useNativeDriver: true,
//       }),
//       Animated.timing(opacityAnim, {
//         toValue: 0,
//         duration: 500,
//         delay: 500,
//         useNativeDriver: true,
//       })
//     ]).start();
//   }, []);

//   return (
//     <LinearGradient colors={["#6a11cb", "#2575fc"]} style={styles.container}>
//       <Animated.View style={{ opacity: opacityAnim, transform: [{ translateY: slideAnim }] }}>
//         <Image
//           source={{ uri: "https://deeptiart.com/Logo.png" }}
//           style={styles.logo}
//         />
//         <Text style={styles.text}>Welcome to Deepti Art</Text>
//         <Text style={styles.subtitle}>Discover beautiful handmade paintings</Text>
//       </Animated.View>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   logo: {
//     width: 120,
//     height: 120,
//     marginBottom: 20,
//     borderRadius: 60,
//   },
//   text: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#fff",
//   },
//   subtitle: {
//     fontSize: 16,
//     color: "#ddd",
//     marginTop: 10,
//   },
// });

// import React, { useState, useEffect } from "react";
// import { View, Text, StyleSheet, Image, Animated } from "react-native";

// export default function MainApp() {
//   const [fadeAnim] = useState(new Animated.Value(1)); // Opacity starts at 1
//   const [slideAnim] = useState(new Animated.Value(0)); // Starts at original position
//   const [showContent, setShowContent] = useState(true);

//   useEffect(() => {
//     Animated.parallel([
//       Animated.timing(slideAnim, {
//         toValue: -50, // Move up by 50 pixels
//         duration: 1000,
//         useNativeDriver: true,
//       }),
//       Animated.timing(fadeAnim, {
//         toValue: 0, // Fade out completely
//         duration: 1000,
//         useNativeDriver: true,
//       })
//     ]).start(() => setShowContent(false)); // Hide content after animation
//   }, []);

//   return (
//     <View style={styles.container}>
//       {showContent ? (
//         <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
//           <Image
//             source={{ uri: "https://deeptiart.com/Logo.png" }}
//             style={styles.logo}
//           />
//           <Text style={styles.text}>Welcome to Deepti Art</Text>
//           <Text style={styles.subtitle}>Discover beautiful handmade paintings</Text>
//         </Animated.View>
//       ) : (
//         <View style={styles.whiteScreen} />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#fff",
//   },
//   logo: {
//     width: 120,
//     height: 120,
//     marginBottom: 20,
//     borderRadius: 60,
//   },
//   text: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   subtitle: {
//     fontSize: 16,
//     color: "#666",
//     marginTop: 10,
//   },
//   whiteScreen: {
//     flex: 1,
//     backgroundColor: "#fff",
//     width: "100%",
//     height: "100%",
//   },
// });import React, { useState, useEffect } from "react";
import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackActions } from "@react-navigation/native"; // Import StackActions

type RootStackParamList = {
  MainApp: undefined;
  Gallery: undefined;
};

export default function MainApp() {
  const fadeAnim = new Animated.Value(1);
  const slideAnim = new Animated.Value(0);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.dispatch(StackActions.replace("Gallery")); // Correct navigation
    });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <Image source={{ uri: "https://deeptiart.com/Logo.png" }} style={styles.logo} />
        <Text style={styles.text}>Welcome to Deepti Art</Text>
        <Text style={styles.subtitle}>Discover beautiful handmade paintings</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6a11cb",
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    borderRadius: 60,
  },
  text: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
  },
});
