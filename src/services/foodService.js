import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from './firebase';

export const foodService = {
  // Add a new food item
  addFoodItem: async (foodData) => {
    try {
      console.log('Adding food item with data:', foodData);
      
      const user = auth.currentUser;
      if (!user) {
        console.error('User not authenticated');
        throw new Error('User not authenticated');
      }

      console.log('Current user:', user.uid);

      const foodItem = {
        ...foodData,
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      console.log('Food item to be added:', foodItem);

      const docRef = await addDoc(collection(db, 'foodItems'), foodItem);
      console.log('Food item added successfully with ID:', docRef.id);
      
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error adding food item:', error);
      return { success: false, error: error.message };
    }
  },

  // Get all food items for current user
  getFoodItems: async () => {
    try {
      console.log('Getting food items...');
      
      const user = auth.currentUser;
      if (!user) {
        console.error('User not authenticated');
        throw new Error('User not authenticated');
      }

      console.log('Current user for getting items:', user.uid);

      // Temporarily remove orderBy to avoid index requirement
      const q = query(
        collection(db, 'foodItems'),
        where('userId', '==', user.uid)
        // orderBy('expiryDate', 'asc') // Temporarily commented out
      );

      console.log('Executing Firestore query...');
      const querySnapshot = await getDocs(q);
      console.log('Query completed, found documents:', querySnapshot.size);
      
      const foodItems = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log('Document data:', { id: doc.id, ...data });
        foodItems.push({
          id: doc.id,
          ...data
        });
      });

      // Sort items client-side for now
      foodItems.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));

      console.log('Total food items retrieved:', foodItems.length);
      return { success: true, data: foodItems };
    } catch (error) {
      console.error('Error getting food items:', error);
      return { success: false, error: error.message };
    }
  },

  // Update a food item
  updateFoodItem: async (id, foodData) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const foodRef = doc(db, 'foodItems', id);
      const updateData = {
        ...foodData,
        updatedAt: serverTimestamp()
      };

      await updateDoc(foodRef, updateData);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Delete a food item
  deleteFoodItem: async (id) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      await deleteDoc(doc(db, 'foodItems', id));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Upload image to Firebase Storage
  uploadImage: async (uri, fileName) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      
      const storageRef = ref(storage, `food-images/${fileName}`);
      await uploadBytes(storageRef, blob);
      
      const downloadURL = await getDownloadURL(storageRef);
      return { success: true, url: downloadURL };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get expiring food items (within 7 days)
  getExpiringItems: async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

      const q = query(
        collection(db, 'foodItems'),
        where('userId', '==', user.uid),
        where('expiryDate', '<=', sevenDaysFromNow),
        orderBy('expiryDate', 'asc')
      );

      const querySnapshot = await getDocs(q);
      const expiringItems = [];
      
      querySnapshot.forEach((doc) => {
        expiringItems.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return { success: true, data: expiringItems };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}; 