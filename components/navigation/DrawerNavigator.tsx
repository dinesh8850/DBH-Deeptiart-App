import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import GalleryScreen from '../Gallery';
import LikedPaintingsScreen from '../LikedPaintingsScreen';


const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Gallery">
      <Drawer.Screen name="Gallery" component={GalleryScreen} />
      <Drawer.Screen name="Liked Paintings" component={LikedPaintingsScreen} />
    
    </Drawer.Navigator>
  );
}
