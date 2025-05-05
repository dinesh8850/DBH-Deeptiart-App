import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Animated,
  Image,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../components/firebaseConfig";
import { StackNavigationProp } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons"; // Import icons for visibility toggle
import { useNetwork } from "../NetworkStatusProvider";
type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  MainApp: undefined;
};

type SignupScreenNavigationProp = StackNavigationProp<RootStackParamList, "Signup">;

export default function SignupScreen({ navigation }: { navigation: SignupScreenNavigationProp }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Animation for logo
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);
  const MyComponent = () => {
    const { isConnected } = useNetwork();
  
    return (
      <Text>{isConnected ? 'Online 🎉' : 'Offline 😢'}</Text>
    );
  };
  const handleSignup = async () => {
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigation.replace("MainApp");
    } catch (error: any) {
      let message = "An error occurred. Please try again.";
      if (error.code === "auth/email-already-in-use") message = "Email is already in use.";
      else if (error.code === "auth/invalid-email") message = "Invalid email format.";
      else if (error.code === "auth/weak-password") message = "Password should be at least 6 characters.";
      alert(message);
    }
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animated.Image
        source={{ uri: "https://deeptiart.com/Logo.png" }} // Replace with your actual logo URL
        style={[styles.logo, { opacity: fadeAnim }]}
      />

      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={styles.passwordInput}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.icon}>
          <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="gray" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <Button title="Sign Up" onPress={handleSignup} />
      )}

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.replace("MainApp")}>
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
    backgroundColor: "#fff",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  input: {
    width: "100%",
    padding: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ccc",
    backgroundColor: "#f9f9f9",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ccc",
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  passwordInput: { flex: 1, padding: 12 },
  icon: { padding: 10 },
  link: { marginTop: 15, color: "blue", fontSize: 16 },
  skip: { marginTop: 20, color: "gray", fontSize: 16 },
});

