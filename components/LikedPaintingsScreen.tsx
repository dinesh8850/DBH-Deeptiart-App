import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import paintings from './Painting.json';

const LIKED_PAINTINGS_KEY = 'liked_paintings';

type Painting = {
  id: string;
  title?: string;
  price?: number;
  image?: string;
  category?: string;
};

const LikedPaintingsScreen = () => {
  const [likedPaintings, setLikedPaintings] = useState<Record<string, boolean>>({});
  const [filteredPaintings, setFilteredPaintings] = useState<Painting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const loadLikedPaintings = async () => {
    try {
      setIsLoading(true);
      const jsonValue = await AsyncStorage.getItem(LIKED_PAINTINGS_KEY);
      const likes = jsonValue ? JSON.parse(jsonValue) : {};
      setLikedPaintings(likes);
      
      // Safely filter paintings
      const liked = paintings.filter(painting => painting?.id && likes[painting.id]);
      setFilteredPaintings(liked);
    } catch (e) {
      console.error('Failed to load liked paintings', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      loadLikedPaintings();
    }
  }, [isFocused]);

  const toggleLike = async (id: string) => {
    try {
      const newLikes = { ...likedPaintings, [id]: !likedPaintings[id] };
      setLikedPaintings(newLikes);
      await AsyncStorage.setItem(LIKED_PAINTINGS_KEY, JSON.stringify(newLikes));
      loadLikedPaintings();
    } catch (e) {
      console.error('Failed to toggle like', e);
    }
  };

  const renderPaintingItem = ({ item }: { item: Painting }) => (
    <View style={styles.artCard}>
      {item?.image && (
        <Image 
          source={{ uri: item.image }} 
          style={styles.artImage} 
          resizeMode="cover"
        />
      )}
      <TouchableOpacity 
        onPress={() => toggleLike(item.id)} 
        style={styles.likeButton}
      >
        <Ionicons name="heart" size={24} color="red" />
      </TouchableOpacity>
      <View style={styles.artInfo}>
        <Text style={styles.artTitle} numberOfLines={1}>
          {item?.title || 'Untitled Painting'}
        </Text>
        <Text style={styles.artPrice}>
          ₹{(item?.price || 0).toLocaleString()}
        </Text>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="heart-dislike-outline" size={48} color="#ccc" />
      <Text style={styles.emptyText}>No liked paintings yet</Text>
      <Text style={styles.emptySubText}>Tap the heart icon on paintings to save them here</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Your Liked Paintings</Text>
        <View style={{ width: 24 }} />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredPaintings}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={renderPaintingItem}
          ListEmptyComponent={renderEmptyState}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginTop: 25,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 10,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
    textAlign: 'center',
  },
  listContainer: {
    padding: 10,
  },
  artCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  artImage: {
    width: '100%',
    height: 200,
  },
  likeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20,
    padding: 5,
  },
  artInfo: {
    padding: 15,
  },
  artTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  artPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6a11cb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LikedPaintingsScreen; 