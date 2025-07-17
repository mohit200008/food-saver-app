import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  Alert,
  Image,
  StyleSheet,
} from 'react-native';
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
import {
  ResponsiveContainer,
  ResponsiveCard,
  ResponsiveText,
  ResponsiveIconButton,
  ResponsiveFAB,
  ResponsiveHeader,
  ResponsiveEmptyState,
} from '../components/ResponsiveComponents';
import {
  spacing,
  borderRadius,
  isTablet,
} from '../utils/responsive';

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
      <ResponsiveCard
        style={[styles.foodItem, { borderLeftColor: statusColor }]}
        onPress={() => navigation.navigate('ItemDetail', { item })}
      >
        <View style={styles.itemHeader}>
          <View style={styles.itemInfo}>
            <ResponsiveText variant="subtitle" style={styles.itemName}>
              {item.name}
            </ResponsiveText>
            <ResponsiveText variant="caption" style={styles.itemCategory}>
              {categoryIcon} {item.category}
            </ResponsiveText>
          </View>
          <ResponsiveIconButton
            icon="trash-outline"
            onPress={() => handleDeleteItem(item.id, item.name)}
            variant="secondary"
            size="sm"
            style={styles.deleteButton}
          />
        </View>

        <View style={styles.itemDetails}>
          {item.imageUrl && (
            <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
          )}
          <View style={styles.itemText}>
            <ResponsiveText variant="caption" style={styles.expiryDate}>
              Expires: {formatDate(item.expiryDate)}
            </ResponsiveText>
            <ResponsiveText variant="body" style={[styles.statusText, { color: statusColor }]}>
              {getStatusText(status)}
              {daysUntilExpiry !== null && (
                <ResponsiveText variant="caption" style={styles.daysText}>
                  {daysUntilExpiry < 0 
                    ? ` (${Math.abs(daysUntilExpiry)} days ago)`
                    : ` (${daysUntilExpiry} days left)`
                  }
                </ResponsiveText>
              )}
            </ResponsiveText>
          </View>
        </View>
      </ResponsiveCard>
    );
  };

  const renderEmptyState = () => (
    <ResponsiveEmptyState
      icon="restaurant-outline"
      title="No food items yet"
      subtitle="Add your first food item to start tracking"
      actionTitle="Add Food Item"
      onAction={() => navigation.navigate('AddItem')}
    />
  );

  return (
    <ResponsiveContainer style={styles.container}>
      <ResponsiveHeader
        title="🍎 FoodSaver"
        rightIcon="log-out-outline"
        onRightPress={handleSignOut}
      />

      <FlatList
        data={foodItems}
        renderItem={renderFoodItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={!loading ? renderEmptyState : null}
        showsVerticalScrollIndicator={false}
      />

      <ResponsiveFAB
        icon="add"
        onPress={() => navigation.navigate('AddItem')}
        style={styles.fab}
      />
    </ResponsiveContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContainer: {
    padding: spacing.md,
    flexGrow: 1,
  },
  foodItem: {
    borderLeftWidth: 4,
    marginBottom: spacing.md,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    marginBottom: spacing.xs,
  },
  itemCategory: {
    color: colors.textSecondary,
  },
  deleteButton: {
    padding: spacing.xs,
  },
  itemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    width: isTablet ? 80 : 60,
    height: isTablet ? 80 : 60,
    borderRadius: borderRadius.md,
    marginRight: spacing.md,
  },
  itemText: {
    flex: 1,
  },
  expiryDate: {
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  statusText: {
    fontWeight: '600',
  },
  daysText: {
    color: colors.textSecondary,
  },
  fab: {
    bottom: spacing.lg,
    right: spacing.lg,
  },
});

export default HomeScreen; 