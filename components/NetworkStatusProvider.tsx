// NetworkStatusProvider.tsx

import React, { useEffect, useState, createContext, useContext } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { View, Text, StyleSheet, Platform, StatusBar } from 'react-native';

type NetworkContextType = {
  isConnected: boolean;
};

const NetworkContext = createContext<NetworkContextType>({ isConnected: true });

export const useNetwork = () => useContext(NetworkContext);

export const NetworkStatusProvider = ({ children }: { children: React.ReactNode }) => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <NetworkContext.Provider value={{ isConnected }}>
      {!isConnected && <NoInternetBanner />}
      {children}
    </NetworkContext.Provider>
  );
};

const NoInternetBanner = () => (
  <View style={styles.banner}>
    <Text style={styles.text}>🔌 No Internet Connection</Text>
  </View>
);

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
    width: '100%',
    backgroundColor: '#ff4d4d',
    padding: 10,
    zIndex: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
