import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  TextInput
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { foodService } from '../services/foodService';
import { colors } from '../constants/colors';
import { 
  getExpiryStatus, 
  getStatusColor, 
  getStatusText, 
  formatDate,
  getDaysUntilExpiry 
} from '../utils/dateUtils';
import { getCategoryIcon, getCategoryName } from '../constants/categories';
import {
  ResponsiveContainer,
  ResponsiveText,
  ResponsiveButton,
  ResponsiveHeader,
  ResponsiveImageContainer,
} from '../components/ResponsiveComponents';
import {
  spacing,
  borderRadius,
  isTablet,
} from '../utils/responsive';

const ItemDetailScreen = ({ route, navigation }) => {
  const { item } = route.params;
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(item.name);
  const [expiryDate, setExpiryDate] = useState(new Date(item.expiryDate));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const status = getExpiryStatus(item.expiryDate);
  const statusColor = getStatusColor(status);
  const daysUntilExpiry = getDaysUntilExpiry(item.expiryDate);
  const categoryIcon = getCategoryIcon(item.category);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setExpiryDate(selectedDate);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a food item name');
      return;
    }

    setIsLoading(true);
    try {
      const updateData = {
        name: name.trim(),
        expiryDate: expiryDate.toISOString(),
      };

      const result = await foodService.updateFoodItem(item.id, updateData);
      if (result.success) {
        Alert.alert('Success', 'Food item updated successfully!', [
          { text: 'OK', onPress: () => {
            setIsEditing(false);
            navigation.goBack();
          }}
        ]);
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update food item');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete "${item.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await foodService.deleteFoodItem(item.id);
            if (result.success) {
              navigation.goBack();
            } else {
              Alert.alert('Error', result.error);
            }
          }
        }
      ]
    );
  };

  return (
    <ResponsiveContainer style={styles.container}>
      <ResponsiveHeader
        title="Food Details"
        leftIcon="arrow-back"
        rightIcon={isEditing ? "close" : "create-outline"}
        onLeftPress={() => navigation.goBack()}
        onRightPress={() => setIsEditing(!isEditing)}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Image Section */}
        {item.imageUrl && (
          <View style={styles.imageSection}>
            <ResponsiveImageContainer size={isTablet ? 'large' : 'medium'}>
              <Image source={{ uri: item.imageUrl }} style={styles.foodImage} />
            </ResponsiveImageContainer>
          </View>
        )}

        {/* Status Badge */}
        <View style={styles.statusSection}>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <ResponsiveText variant="body" style={styles.statusText}>
              {getStatusText(status)}
            </ResponsiveText>
          </View>
          {daysUntilExpiry !== null && (
            <ResponsiveText variant="caption" style={styles.daysText}>
              {daysUntilExpiry < 0 
                ? `${Math.abs(daysUntilExpiry)} days ago`
                : `${daysUntilExpiry} days left`
              }
            </ResponsiveText>
          )}
        </View>

        {/* Food Details */}
        <View style={styles.detailsSection}>
          <View style={styles.detailRow}>
            <ResponsiveText variant="subtitle" style={styles.detailLabel}>
              Name:
            </ResponsiveText>
            {isEditing ? (
              <TextInput
                style={styles.editInput}
                value={name}
                onChangeText={setName}
                placeholder="Enter food name"
              />
            ) : (
              <ResponsiveText variant="body" style={styles.detailValue}>
                {item.name}
              </ResponsiveText>
            )}
          </View>

          <View style={styles.detailRow}>
            <ResponsiveText variant="subtitle" style={styles.detailLabel}>
              Category:
            </ResponsiveText>
            <ResponsiveText variant="body" style={styles.detailValue}>
              {categoryIcon} {getCategoryName(item.category)}
            </ResponsiveText>
          </View>

          <View style={styles.detailRow}>
            <ResponsiveText variant="subtitle" style={styles.detailLabel}>
              Expiry Date:
            </ResponsiveText>
            {isEditing ? (
              <ResponsiveButton
                title={expiryDate.toLocaleDateString()}
                icon="calendar-outline"
                onPress={() => setShowDatePicker(true)}
                variant="outline"
                size="small"
                style={styles.dateButton}
              />
            ) : (
              <ResponsiveText variant="body" style={styles.detailValue}>
                {formatDate(item.expiryDate)}
              </ResponsiveText>
            )}
          </View>

          <View style={styles.detailRow}>
            <ResponsiveText variant="subtitle" style={styles.detailLabel}>
              Added:
            </ResponsiveText>
            <ResponsiveText variant="body" style={styles.detailValue}>
              {item.createdAt ? formatDate(item.createdAt) : 'Unknown'}
            </ResponsiveText>
          </View>
        </View>

        {/* Action Buttons */}
        {isEditing && (
          <View style={styles.actionSection}>
            <ResponsiveButton
              title={isLoading ? 'Saving...' : 'Save Changes'}
              onPress={handleSave}
              disabled={isLoading}
              size={isTablet ? 'large' : 'medium'}
              style={styles.saveButton}
            />
          </View>
        )}

        {/* Delete Button */}
        <ResponsiveButton
          title="Delete Item"
          icon="trash-outline"
          onPress={handleDelete}
          variant="secondary"
          size={isTablet ? 'large' : 'medium'}
          style={styles.deleteButton}
        />
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker
          value={expiryDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}
    </ResponsiveContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: isTablet ? spacing.xl : spacing.md,
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: isTablet ? spacing.xl : spacing.lg,
  },
  foodImage: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.lg,
  },
  statusSection: {
    alignItems: 'center',
    marginBottom: isTablet ? spacing.xl : spacing.lg,
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
    marginBottom: spacing.sm,
  },
  statusText: {
    color: colors.surface,
    fontWeight: 'bold',
  },
  daysText: {
    color: colors.textSecondary,
  },
  detailsSection: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: isTablet ? spacing.xl : spacing.lg,
    marginBottom: isTablet ? spacing.xl : spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabel: {
    color: colors.text,
    flex: 1,
  },
  detailValue: {
    color: colors.textSecondary,
    flex: 2,
    textAlign: 'right',
  },
  editInput: {
    color: colors.text,
    flex: 2,
    textAlign: 'right',
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
    paddingVertical: spacing.xs,
  },
  dateButton: {
    flex: 2,
    justifyContent: 'flex-end',
  },
  actionSection: {
    marginBottom: isTablet ? spacing.xl : spacing.lg,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  deleteButton: {
    borderColor: colors.error,
  },
});

export default ItemDetailScreen; 