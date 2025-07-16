import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from './firebase';

// Check if Firebase auth is properly initialized
const checkAuthInitialized = () => {
  if (!auth) {
    throw new Error('Firebase Auth is not initialized. Please check your Firebase configuration.');
  }
};

export const authService = {
  // Sign up with email and password
  signUp: async (email, password) => {
    try {
      checkAuthInitialized();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message };
    }
  },

  // Sign in with email and password
  signIn: async (email, password) => {
    try {
      checkAuthInitialized();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    }
  },

  // Sign out
  signOut: async () => {
    try {
      checkAuthInitialized();
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message };
    }
  },

  // Get current user
  getCurrentUser: () => {
    checkAuthInitialized();
    return auth.currentUser;
  },

  // Listen to auth state changes
  onAuthStateChanged: (callback) => {
    checkAuthInitialized();
    return onAuthStateChanged(auth, callback);
  }
}; 