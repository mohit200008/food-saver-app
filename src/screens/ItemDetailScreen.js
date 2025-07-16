import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Food Details</Text>
        <TouchableOpacity 
          onPress={() => setIsEditing(!isEditing)} 
          style={styles.editButton}
        >
          <Ionicons 
            name={isEditing ? "close" : "create-outline"} 
            size={24} 
            color={colors.text} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Image Section */}
        {item.imageUrl && (
          <View style={styles.imageSection}>
            <Image source={{ uri: item.imageUrl }} style={styles.foodImage} />
          </View>
        )}

        {/* Status Badge */}
        <View style={styles.statusSection}>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{getStatusText(status)}</Text>
          </View>
          {daysUntilExpiry !== null && (
            <Text style={styles.daysText}>
              {daysUntilExpiry < 0 
                ? `${Math.abs(daysUntilExpiry)} days ago`
                : `${daysUntilExpiry} days left`
              }
            </Text>
          )}
        </View>

        {/* Food Details */}
        <View style={styles.detailsSection}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Name:</Text>
            {isEditing ? (
              <TextInput
                style={styles.editInput}
                value={name}
                onChangeText={setName}
                placeholder="Enter food name"
              />
            ) : (
              <Text style={styles.detailValue}>{item.name}</Text>
            )}
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Category:</Text>
            <Text style={styles.detailValue}>
              {categoryIcon} {getCategoryName(item.category)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Expiry Date:</Text>
            {isEditing ? (
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateButtonText}>
                  {expiryDate.toLocaleDateString()}
                </Text>
                <Ionicons name="calendar-outline" size={16} color={colors.text} />
              </TouchableOpacity>
            ) : (
              <Text style={styles.detailValue}>
                {formatDate(item.expiryDate)}
              </Text>
            )}
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Added:</Text>
            <Text style={styles.detailValue}>
              {item.createdAt ? formatDate(item.createdAt) : 'Unknown'}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        {isEditing && (
          <View style={styles.actionSection}>
            <TouchableOpacity
              style={[styles.actionButton, styles.saveButton]}
              onPress={handleSave}
              disabled={isLoading}
            >
              <Text style={styles.saveButtonText}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Delete Button */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
        >
          <Ionicons name="trash-outline" size={20} color={colors.error} />
          <Text style={styles.deleteButtonText}>Delete Item</Text>
        </TouchableOpacity>
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
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  editButton: {
    padding: 8,
  },
  content: {
    padding: 20,
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  foodImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
  },
  statusSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
  },
  statusText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: 'bold',
  },
  daysText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  detailsSection: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  detailValue: {
    fontSize: 16,
    color: colors.textSecondary,
    flex: 2,
    textAlign: 'right',
  },
  editInput: {
    fontSize: 16,
    color: colors.text,
    flex: 2,
    textAlign: 'right',
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
    paddingVertical: 4,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
    justifyContent: 'flex-end',
  },
  dateButtonText: {
    fontSize: 16,
    color: colors.text,
    marginRight: 8,
  },
  actionSection: {
    marginBottom: 24,
  },
  actionButton: {
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  saveButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: colors.error,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ItemDetailScreen; 