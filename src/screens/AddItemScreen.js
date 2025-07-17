import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { foodService } from '../services/foodService';
import { colors } from '../constants/colors';
import { foodCategories } from '../constants/categories';
import { generateFileName } from '../utils/dateUtils';
import {
  ResponsiveContainer,
  ResponsiveText,
  ResponsiveInput,
  ResponsiveButton,
  ResponsiveHeader,
  ResponsiveImageContainer,
} from '../components/ResponsiveComponents';
import {
  spacing,
  isTablet,
} from '../utils/responsive';

const AddItemScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('other');
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [imageUri, setImageUri] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions to select an image.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera permissions to take a photo.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      'Add Image',
      'Choose an option',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Library', onPress: pickImage },
      ]
    );
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setExpiryDate(selectedDate);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a food item name');
      return;
    }

    setIsLoading(true);
    try {
      console.log('AddItemScreen: Starting to add food item...');
      let imageUrl = null;
      
      // Upload image if selected
      if (imageUri) {
        console.log('AddItemScreen: Uploading image...');
        const fileName = generateFileName('food_image.jpg');
        const uploadResult = await foodService.uploadImage(imageUri, fileName);
        if (uploadResult.success) {
          imageUrl = uploadResult.url;
          console.log('AddItemScreen: Image uploaded successfully:', imageUrl);
        } else {
          console.error('AddItemScreen: Image upload failed:', uploadResult.error);
          Alert.alert('Error', 'Failed to upload image');
          setIsLoading(false);
          return;
        }
      }

      // Add food item
      const foodData = {
        name: name.trim(),
        category,
        expiryDate: expiryDate.toISOString(),
        imageUrl,
      };

      console.log('AddItemScreen: Adding food item with data:', foodData);
      const result = await foodService.addFoodItem(foodData);
      console.log('AddItemScreen: Add food item result:', result);
      
      if (result.success) {
        console.log('AddItemScreen: Food item added successfully!');
        Alert.alert('Success', 'Food item added successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        console.error('AddItemScreen: Failed to add food item:', result.error);
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      console.error('AddItemScreen: Exception adding food item:', error);
      Alert.alert('Error', 'Failed to add food item');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ResponsiveHeader
          title="Add Food Item"
          leftIcon="arrow-back"
          onLeftPress={() => navigation.goBack()}
        />

        <ResponsiveContainer style={styles.form}>
          {/* Image Section */}
          <View style={styles.imageSection}>
            <ResponsiveText variant="subtitle" style={styles.sectionTitle}>
              Food Image
            </ResponsiveText>
            <ResponsiveImageContainer
              size={isTablet ? 'large' : 'medium'}
              style={styles.imageContainer}
              onPress={showImagePickerOptions}
            >
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.selectedImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <ResponsiveText variant="caption" style={styles.imagePlaceholderText}>
                    Add Photo
                  </ResponsiveText>
                </View>
              )}
            </ResponsiveImageContainer>
          </View>

          {/* Name Input */}
          <View style={styles.inputSection}>
            <ResponsiveText variant="subtitle" style={styles.sectionTitle}>
              Food Name
            </ResponsiveText>
            <ResponsiveInput
              placeholder="Enter food item name"
              value={name}
              onChangeText={setName}
              size={isTablet ? 'large' : 'medium'}
            />
          </View>

          {/* Category Selection */}
          <View style={styles.inputSection}>
            <ResponsiveText variant="subtitle" style={styles.sectionTitle}>
              Category
            </ResponsiveText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
              {foodCategories.map((cat) => (
                <ResponsiveButton
                  key={cat.id}
                  title={cat.name}
                  icon={cat.icon}
                  onPress={() => setCategory(cat.id)}
                  variant={category === cat.id ? 'primary' : 'outline'}
                  size="small"
                  style={styles.categoryButton}
                />
              ))}
            </ScrollView>
          </View>

          {/* Expiry Date */}
          <View style={styles.inputSection}>
            <ResponsiveText variant="subtitle" style={styles.sectionTitle}>
              Expiry Date
            </ResponsiveText>
            <ResponsiveButton
              title={expiryDate.toLocaleDateString()}
              icon="calendar-outline"
              onPress={() => setShowDatePicker(true)}
              variant="outline"
              size={isTablet ? 'large' : 'medium'}
              style={styles.dateButton}
            />
          </View>

          {/* Submit Button */}
          <ResponsiveButton
            title={isLoading ? 'Adding...' : 'Add Food Item'}
            onPress={handleSubmit}
            disabled={isLoading}
            size={isTablet ? 'large' : 'medium'}
            style={styles.submitButton}
          />
        </ResponsiveContainer>
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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  form: {
    padding: isTablet ? spacing.xl : spacing.md,
  },
  imageSection: {
    marginBottom: isTablet ? spacing.xl : spacing.lg,
    alignItems: 'center',
  },
  sectionTitle: {
    color: colors.text,
    marginBottom: spacing.md,
  },
  imageContainer: {
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    backgroundColor: colors.surface,
  },
  selectedImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  inputSection: {
    marginBottom: isTablet ? spacing.xl : spacing.lg,
  },
  categoryContainer: {
    flexDirection: 'row',
  },
  categoryButton: {
    marginRight: spacing.md,
    minWidth: isTablet ? 100 : 80,
  },
  dateButton: {
    justifyContent: 'flex-start',
  },
  submitButton: {
    marginTop: isTablet ? spacing.xl : spacing.lg,
  },
});

export default AddItemScreen; 