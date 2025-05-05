import React, { useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  Alert, 
  TextInput,  
  Image,
  SafeAreaView,
  ScrollView,
  ActivityIndicator
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { auth, firestore } from "../components/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Ionicons } from '@expo/vector-icons';
import { useNetwork } from "./NetworkStatusProvider";
type FrameType = "Black" | "Golden" | "Silver" | "None";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  framePrice?: number;
  frameType?: FrameType;
};

type RootStackParamList = {
  MainApp: undefined;
};

const CheckoutPage = ({ route }: { route: any }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { cartItems = [] } = route.params || {};
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateTotal = () => {
    return cartItems.reduce((total: number, item: CartItem) => {
      const basePrice = Number(item.price) || 0;
      const framePrice = Number(item.framePrice) || 0;
      const itemQuantity = Number(item.quantity) || 1;
      return total + (basePrice + framePrice) * itemQuantity;
    }, 0).toFixed(2);
  };

  const validatePhoneNumber = () => {
    if (phone.length !== 10) {
      setPhoneError("Phone number must be 10 digits");
      return false;
    }
    setPhoneError("");
    return true;
  };
  
  const MyComponent = () => {
    const { isConnected } = useNetwork();
  
    return (
      <Text>{isConnected ? 'Online 🎉' : 'Offline 😢'}</Text>
    );
  };

  const handleSubmit = async () => {
    if (!name || !address || !phone) {
      Alert.alert("Error", "Please enter your name, address and phone number.");
      return;
    }

    if (!validatePhoneNumber()) {
      return;
    }
  
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Error", "Please log in to proceed with your order.");
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      const orderData = {
        userId: user.uid,
        customerName: name,
        deliveryAddress: address,
        phoneNumber: phone,
        items: cartItems.map((item: CartItem) => ({
          name: item.name || "Untitled",
          frameType: item.frameType || "None",
          basePrice: Number(item.price) || 0,
          framePrice: Number(item.framePrice) || 0,
          quantity: Number(item.quantity) || 1,
          imageUrl: item.image || "",
        })),
        total: calculateTotal(),
        status: "pending",
        timestamp: serverTimestamp(),
      };
      await addDoc(collection(firestore, "orders"), orderData);
  
      Alert.alert("Success", "Your order has been submitted!", [
        { text: "OK", onPress: () => navigation.navigate("MainApp") },
      ]);
    } catch (error) {
      console.error("Error saving order: ", error);
      Alert.alert("Error", "Could not process the order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Delivery Address</Text>
            <TextInput
              style={[styles.input, styles.addressInput]}
              placeholder="Enter your address"
              placeholderTextColor="#999"
              value={address}
              onChangeText={setAddress}
              multiline
              numberOfLines={3}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput
              style={[styles.input, phoneError ? styles.inputError : null]}
              placeholder="Enter 10-digit phone number"
              placeholderTextColor="#999"
              value={phone}
              onChangeText={(text) => {
                const cleanedText = text.replace(/[^0-9]/g, '');
                if (cleanedText.length <= 10) {
                  setPhone(cleanedText);
                  if (cleanedText.length === 10) {
                    setPhoneError('');
                  }
                }
              }}
              onBlur={validatePhoneNumber}
              keyboardType="phone-pad"
              maxLength={10}
            />
            {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
          </View>
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Order Summary</Text>
        
        <FlatList
          data={cartItems}
          scrollEnabled={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }: { item: CartItem }) => (
            <View style={styles.itemContainer}>
              {item.image && (
                <View style={[
                  styles.imageWrapper,
                  item.frameType && item.frameType !== "None" && {
                    borderColor: item.frameType === "Black" ? "#000" :
                                item.frameType === "Golden" ? "#FFD700" :
                                item.frameType === "Silver" ? "#C0C0C0" : "transparent",
                    borderWidth: 2,
                    padding: 2,
                    borderRadius: 4
                  }
                ]}>
                  <Image 
                    source={{ uri: item.image }} 
                    style={styles.itemImage}
                    resizeMode="cover"
                  />
                </View>
              )}
              <View style={styles.itemDetails}>
                {/* Painting name moved here with new styling */}
                <Text style={styles.paintingName}>{item.name}</Text>
                
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Base:</Text>
                  <Text style={styles.priceValue}>₹{(Number(item.price) || 0).toFixed(2)}</Text>
                </View>
                
                {item.framePrice ? (
                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Frame {item.frameType}:</Text>
                    <Text style={styles.priceValue}>+₹{(Number(item.framePrice) || 0).toFixed(2)}</Text>
                  </View>
                ) : null}
                
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Quantity:</Text>
                  <Text style={styles.priceValue}>{item.quantity || 1}</Text>
                </View>
                
                <View style={[styles.priceRow, { marginTop: 6 }]}>
                  <Text style={styles.subtotalLabel}>Subtotal:</Text>
                  <Text style={styles.subtotalValue}>
                    ₹{((Number(item.price) + Number(item.framePrice || 0)) * (item.quantity || 1)).toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Your cart is empty</Text>
            </View>
          }
        />

        <View style={styles.totalContainer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₹{calculateTotal()}</Text>
          </View>
        </View>
      </ScrollView>
      
      <TouchableOpacity 
        style={[styles.submitButton, isSubmitting && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>
            {isSubmitting ? "Processing..." : "Submit Order"}
          </Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    // backgroundColor: '#fff',
    // borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginTop: 20,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333",
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
    color: "#000",
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
  addressInput: {
    height: 100,
    textAlignVertical: "top",
  },
  itemContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageWrapper: {
    marginRight: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 4,
  },
  itemDetails: {
    flex: 1,
  },
  paintingName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  priceLabel: {
    fontSize: 14,
    color: "#666",
  },
  priceValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: '500',
  },
  subtotalLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  subtotalValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
  },
  totalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6a11cb',
  },
  submitButton: {
    backgroundColor: "#6a11cb",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 16,
    shadowColor: "#6a11cb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: "#aaa",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default CheckoutPage;