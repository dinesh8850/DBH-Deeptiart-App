import React from "react";
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from "react-native";
import { MotiText, MotiView } from "moti";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  MainApp: undefined;
};

const { width } = Dimensions.get("window");

export default function Home() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const logoUri = "https://deeptiart.com/Logo.png";
  const artImageUri = "https://deeptiart.com/Coloured-21.jpg";

  return (
    <View style={styles.container}>
      {/* Logo in Top-Left Corner */}
      <Image source={{ uri: logoUri }} style={styles.logo} />

      {/* Animated Welcome Text */}
      <MotiText
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "spring", duration: 1000 }}
        style={styles.title}
      >
        Welcome to Deepti Art
      </MotiText>

      {/* Animated Subtitle */}
      <MotiText
        from={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "timing", duration: 800, delay: 300 }}
        style={styles.subtitle}
      >
        Explore and buy my handmade paintings!
      </MotiText>

      {/* Animated Image */}
      <MotiView
        from={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", duration: 1200, delay: 500 }}
        style={styles.imageWrapper}
      >
        <Image source={{ uri: artImageUri }} style={styles.image} />
      </MotiView>

      {/* Buttons: Login, Signup, Skip */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Login")}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.signupButton]} onPress={() => navigation.navigate("Signup")}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipButton} onPress={() => navigation.navigate("MainApp")}>
          <Text style={styles.skipText}>Skip & Explore</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: 70,
    height: 70,
    resizeMode: "contain",
    position: "absolute",
    top: 20,
    left: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
    textAlign: "center",
  },
  imageWrapper: {
    overflow: "hidden",
    borderRadius: 12,
    elevation: 4,
  },
  image: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: 12,
  },
  buttonContainer: {
    marginTop: 30,
    width: "80%",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    width: "100%",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  signupButton: {
    backgroundColor: "#28a745",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  skipButton: {
    marginTop: 10,
  },
  skipText: {
    color: "#666",
    fontSize: 16,
  },
});

