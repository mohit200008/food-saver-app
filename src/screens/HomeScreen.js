import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { foodService } from '../services/foodService';
import { authService } from '../services/authService';
import { colors } from '../constants/colors';
import { 
  getExpiryStatus, 
  getStatusColor, 
  getStatusText, 
  formatDate,
  getDaysUntilExpiry 
} from '../utils/dateUtils';
import { getCategoryIcon } from '../constants/categories';

const HomeScreen = ({ navigation }) => {
  const [foodItems, setFoodItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFoodItems();
  }, []);

  const loadFoodItems = async () => {
    try {
      console.log('HomeScreen: Loading food items...');
      const result = await foodService.getFoodItems();
      console.log('HomeScreen: Food service result:', result);
      
      if (result.success) {
        console.log('HomeScreen: Setting food items:', result.data);
        setFoodItems(result.data);
      } else {
        console.error('HomeScreen: Error loading food items:', result.error);
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      console.error('HomeScreen: Exception loading food items:', error);
      Alert.alert('Error', 'Failed to load food items');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFoodItems();
    setRefreshing(false);
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            const result = await authService.signOut();
            if (!result.success) {
              Alert.alert('Error', result.error);
            }
          }
        }
      ]
    );
  };

  const handleDeleteItem = (itemId, itemName) => {
    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete "${itemName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await foodService.deleteFoodItem(itemId);
            if (result.success) {
              loadFoodItems();
            } else {
              Alert.alert('Error', result.error);
            }
          }
        }
      ]
    );
  };

  const renderFoodItem = ({ item }) => {
    const status = getExpiryStatus(item.expiryDate);
    const statusColor = getStatusColor(status);
    const daysUntilExpiry = getDaysUntilExpiry(item.expiryDate);
    const categoryIcon = getCategoryIcon(item.category);

    return (
      <TouchableOpacity
        style={[styles.foodItem, { borderLeftColor: statusColor }]}
        onPress={() => navigation.navigate('ItemDetail', { item })}
      >
        <View style={styles.itemHeader}>
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemCategory}>
              {categoryIcon} {item.category}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteItem(item.id, item.name)}
          >
            <Ionicons name="trash-outline" size={20} color={colors.error} />
          </TouchableOpacity>
        </View>

        <View style={styles.itemDetails}>
          {item.imageUrl && (
            <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
          )}
          <View style={styles.itemText}>
            <Text style={styles.expiryDate}>
              Expires: {formatDate(item.expiryDate)}
            </Text>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {getStatusText(status)}
              {daysUntilExpiry !== null && (
                <Text style={styles.daysText}>
                  {daysUntilExpiry < 0 
                    ? ` (${Math.abs(daysUntilExpiry)} days ago)`
                    : ` (${daysUntilExpiry} days left)`
                  }
                </Text>
              )}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="restaurant-outline" size={64} color={colors.textSecondary} />
      <Text style={styles.emptyTitle}>No food items yet</Text>
      <Text style={styles.emptySubtitle}>
        Add your first food item to start tracking
      </Text>
      <TouchableOpacity
        style={styles.addFirstButton}
        onPress={() => navigation.navigate('AddItem')}
      >
        <Text style={styles.addFirstButtonText}>Add Food Item</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🍎 FoodSaver</Text>
        <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
          <Ionicons name="log-out-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={foodItems}
        renderItem={renderFoodItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={!loading ? renderEmptyState : null}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddItem')}
      >
        <Ionicons name="add" size={24} color={colors.surface} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  signOutButton: {
    padding: 8,
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  foodItem: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  deleteButton: {
    padding: 4,
  },
  itemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  itemText: {
    flex: 1,
  },
  expiryDate: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  daysText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  addFirstButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addFirstButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default HomeScreen; 