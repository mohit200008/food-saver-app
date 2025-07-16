import { initializeApp, getApps } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDg8OKn8QervOTD4Ho8TuPV7JptqlhlqDQ",
  authDomain: "food-saver-app-dca01.firebaseapp.com",
  projectId: "food-saver-app-dca01",
  storageBucket: "food-saver-app-dca01.firebasestorage.app",
  messagingSenderId: "990922375714",
  appId: "1:990922375714:web:fc5236f0ccf9494dce407b"
};

// Initialize Firebase with error handling
let app;
let auth;
let db;
let storage;

try {
  // Check if Firebase app is already initialized
  const apps = getApps();
  if (apps.length === 0) {
    app = initializeApp(firebaseConfig);
    console.log('Firebase app initialized');
  } else {
    app = apps[0];
    console.log('Firebase app already exists, using existing instance');
  }
  
  // Check if Auth is already initialized
  try {
    auth = getAuth(app);
    console.log('Using existing Auth instance');
  } catch (error) {
    // Initialize Auth with AsyncStorage persistence only if not already initialized
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
    console.log('Auth initialized with AsyncStorage persistence');
  }
  
  db = getFirestore(app);
  storage = getStorage(app);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw new Error(`Firebase initialization failed: ${error.message}`);
}

// Test Firebase connection
export const testFirebaseConnection = async () => {
  try {
    // Test if we can access the auth object
    if (!auth) {
      throw new Error('Auth object is not initialized');
    }
    
    // Test if we can access the current user (this will be null if not logged in)
    const currentUser = auth.currentUser;
    console.log('Firebase connection test successful. Current user:', currentUser);
    
    // Test if auth is properly configured
    if (typeof auth.app === 'undefined') {
      throw new Error('Auth app is not properly configured');
    }
    
    console.log('Auth app config:', auth.app.options);
    
    // Test if we can access Firestore (this will verify project access)
    try {
      const testDoc = doc(db, 'test', 'connection');
      await getDoc(testDoc);
      console.log('Firestore connection test successful');
    } catch (firestoreError) {
      console.log('Firestore test result (this is normal if collection doesn\'t exist):', firestoreError.message);
    }
    
    return { success: true, currentUser, config: auth.app.options };
  } catch (error) {
    console.error('Firebase connection test failed:', error);
    return { success: false, error: error.message };
  }
};

// Initialize Firebase services
export { auth, db, storage };
export default app; 