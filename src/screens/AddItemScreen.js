import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { foodService } from '../services/foodService';
import { colors } from '../constants/colors';
import { foodCategories } from '../constants/categories';
import { generateFileName } from '../utils/dateUtils';

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
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Add Food Item</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.form}>
          {/* Image Section */}
          <View style={styles.imageSection}>
            <Text style={styles.sectionTitle}>Food Image</Text>
            <TouchableOpacity style={styles.imageContainer} onPress={showImagePickerOptions}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.selectedImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="camera-outline" size={32} color={colors.textSecondary} />
                  <Text style={styles.imagePlaceholderText}>Add Photo</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Name Input */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Food Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter food item name"
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Category Selection */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
              {foodCategories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryButton,
                    category === cat.id && styles.categoryButtonSelected
                  ]}
                  onPress={() => setCategory(cat.id)}
                >
                  <Text style={styles.categoryIcon}>{cat.icon}</Text>
                  <Text style={[
                    styles.categoryText,
                    category === cat.id && styles.categoryTextSelected
                  ]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Expiry Date */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Expiry Date</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={20} color={colors.text} />
              <Text style={styles.dateButtonText}>
                {expiryDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Text style={styles.submitButtonText}>
              {isLoading ? 'Adding...' : 'Add Food Item'}
            </Text>
          </TouchableOpacity>
        </View>
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
  placeholder: {
    width: 40,
  },
  form: {
    padding: 20,
  },
  imageSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  imageContainer: {
    alignSelf: 'center',
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
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
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  inputSection: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
  },
  categoryButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 80,
  },
  categoryButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  categoryTextSelected: {
    color: colors.surface,
    fontWeight: '600',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 15,
  },
  dateButtonText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddItemScreen; 