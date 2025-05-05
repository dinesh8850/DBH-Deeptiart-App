// import React, { useState } from "react";
// import { 
//   View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator 
// } from "react-native";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from "../../components/firebaseConfig";
// import { NativeStackScreenProps } from "@react-navigation/native-stack";
// import { Ionicons } from "@expo/vector-icons"; // Import icons for password visibility

// type RootStackParamList = {
//   Login: undefined;
//   Signup: undefined;
//   MainApp: undefined;
// };

// type Props = NativeStackScreenProps<RootStackParamList, "Login">;

// export default function LoginScreen({ navigation }: Props) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false); // Password visibility state

//   const handleLogin = async () => {
//     if (!email || !password) {
//       alert("Please enter both email and password.");
//       return;
//     }

//     setLoading(true);
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       navigation.replace("MainApp"); // Navigate after successful login
//     } catch (error: any) {
//       let message = "An error occurred. Please try again.";
//       if (error.code === "auth/invalid-email") message = "Invalid email format.";
//       else if (error.code === "auth/user-not-found") message = "User not found. Please sign up.";
//       else if (error.code === "auth/wrong-password") message = "Incorrect password.";
//       alert(message);
//     }
//     setLoading(false);
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>Login</Text>

//       <TextInput
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//         style={styles.input}
//         keyboardType="email-address"
//         autoCapitalize="none"
//       />

//       <View style={styles.passwordContainer}>
//         <TextInput
//           placeholder="Password"
//           value={password}
//           onChangeText={setPassword}
//           secureTextEntry={!showPassword}
//           style={styles.passwordInput}
//         />
//         <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.icon}>
//           <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="gray" />
//         </TouchableOpacity>
//       </View>

//       {loading ? (
//         <ActivityIndicator size="large" color="#007BFF" />
//       ) : (
//         <Button title="Login" onPress={handleLogin} />
//       )}

//       <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
//         <Text style={styles.link}>Don't have an account? Sign Up</Text>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={() => navigation.replace("MainApp")}>
//         <Text style={styles.skip}>Skip & Explore</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { 
//     flexGrow: 1, 
//     justifyContent: "center", 
//     alignItems: "center", 
//     padding: 20, 
//     backgroundColor: "#fff" 
//   },
//   title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
//   input: { 
//     width: "100%", 
//     padding: 12, 
//     marginVertical: 10, 
//     borderWidth: 1, 
//     borderRadius: 8, 
//     borderColor: "#ccc", 
//     backgroundColor: "#f9f9f9" 
//   },
//   passwordContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     width: "100%",
//     borderWidth: 1,
//     borderRadius: 8,
//     borderColor: "#ccc",
//     backgroundColor: "#f9f9f9",
//     paddingHorizontal: 10,
//     marginVertical: 10,
//   },
//   passwordInput: { flex: 1, padding: 12 },
//   icon: { padding: 10 },
//   link: { marginTop: 15, color: "blue", fontSize: 16 },
//   skip: { marginTop: 20, color: "gray", fontSize: 16 },
// });
import React, { useState, useEffect } from "react";
import { 
  View, Text, TextInput, Button, StyleSheet, TouchableOpacity, 
  ScrollView, ActivityIndicator, Animated, Image, Alert 
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../components/firebaseConfig";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNetwork } from "../../components/NetworkStatusProvider"; // Import the useNetwork hook

type RootStackParamList = {
  Login: { redirectTo?: string };
  Signup: undefined;
  Gallery: { updatedCart?: Record<string, boolean>, fromLogin?: boolean };
  Cart: { cartItems: Record<string, boolean> };
};

type GalleryScreenProps = NativeStackScreenProps<RootStackParamList, "Gallery">;
type CartScreenProps = NativeStackScreenProps<RootStackParamList, "Cart">;
type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation, route }: Props): JSX.Element {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Animation values
  const logoOpacity = useState(new Animated.Value(0))[0];
  const logoScale = useState(new Animated.Value(0.5))[0];

  useEffect(() => {
    // Animate logo when component mounts
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

  const MyComponent = () => {
    const { isConnected } = useNetwork();
  
    return (
      <Text>{isConnected ? 'Online 🎉' : 'Offline 😢'}</Text>
    );
  };

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userToken = await userCredential.user.getIdToken();
      
      // Store the token in AsyncStorage
      await AsyncStorage.setItem('userToken', userToken);
      
      // Navigate to the appropriate screen
      const redirectTo = route.params?.redirectTo || "Gallery";
      navigation.replace(redirectTo as "Gallery", { fromLogin: true });
    } catch (error: any) {
      let message = "An error occurred. Please try again.";
      if (error.code === "auth/invalid-email") message = "Invalid email format.";
      else if (error.code === "auth/user-not-found") message = "User not found. Please sign up.";
      else if (error.code === "auth/wrong-password") message = "Incorrect password.";
      else if (error.code === "auth/too-many-requests") message = "Too many attempts. Try again later.";
      
      Alert.alert("Login Failed", message);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigation.replace("Gallery", {});
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      {/* Animated Logo with Online Image */}
      <Animated.Image 
        source={{ uri: "https://deeptiart.com/Logo.png" }}
        style={[styles.logo, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}
        resizeMode="contain"
      />

      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        importantForAutofill="yes"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={styles.passwordInput}
          autoCapitalize="none"
          autoCorrect={false}
          importantForAutofill="yes"
        />
        <TouchableOpacity 
          onPress={() => setShowPassword(!showPassword)} 
          style={styles.icon}
        >
          <Ionicons 
            name={showPassword ? "eye-off" : "eye"} 
            size={24} 
            color="gray" 
          />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#6a11cb" style={styles.loader} />
      ) : (
        <TouchableOpacity 
          onPress={handleLogin} 
          style={styles.loginButton}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity 
        onPress={() => navigation.navigate("Signup")}
        style={styles.linkContainer}
      >
        <Text style={styles.link}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={handleSkip}
        style={styles.skipContainer}
      >
        <Text style={styles.skip}>Skip & Explore</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    padding: 20, 
    backgroundColor: "#fff" 
  },
  logo: {
    width: 150, 
    height: 150, 
    marginBottom: 20,
  },
  title: { 
    fontSize: 28, 
    fontWeight: "bold", 
    marginBottom: 20,
    color: "#333",
  },
  input: { 
    width: "100%", 
    padding: 15, 
    marginVertical: 10, 
    borderWidth: 1, 
    borderRadius: 8, 
    borderColor: "#ddd", 
    backgroundColor: "#f9f9f9",
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ddd",
    backgroundColor: "#f9f9f9",
    marginVertical: 10,
  },
  passwordInput: { 
    flex: 1, 
    padding: 15,
    fontSize: 16,
  },
  icon: { 
    padding: 10,
    marginRight: 5,
  },
  loader: {
    marginVertical: 20,
  },
  loginButton: {
    width: "100%",
    backgroundColor: "#6a11cb",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  linkContainer: {
    marginTop: 20,
  },
  link: { 
    color: "#6a11cb", 
    fontSize: 16,
    textDecorationLine: "underline",
  },
  skipContainer: {
    marginTop: 15,
  },
  skip: { 
    color: "#666", 
    fontSize: 16,
    textDecorationLine: "underline",
  },
});