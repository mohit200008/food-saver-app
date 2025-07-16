// Test script for Firebase authentication
import { authService } from './src/services/authService';

const testEmail = 'test@foodsaver.com';
const testPassword = 'testpassword123';

console.log('Testing Firebase Authentication...');

// Test sign up
const testSignUp = async () => {
  console.log('Testing sign up with:', testEmail);
  try {
    const result = await authService.signUp(testEmail, testPassword);
    if (result.success) {
      console.log('✅ Sign up successful!');
      console.log('User ID:', result.user.uid);
      return result.user;
    } else {
      console.log('❌ Sign up failed:', result.error);
      return null;
    }
  } catch (error) {
    console.log('❌ Sign up error:', error.message);
    return null;
  }
};

// Test sign in
const testSignIn = async () => {
  console.log('Testing sign in with:', testEmail);
  try {
    const result = await authService.signIn(testEmail, testPassword);
    if (result.success) {
      console.log('✅ Sign in successful!');
      console.log('User ID:', result.user.uid);
      return result.user;
    } else {
      console.log('❌ Sign in failed:', result.error);
      return null;
    }
  } catch (error) {
    console.log('❌ Sign in error:', error.message);
    return null;
  }
};

// Run tests
const runTests = async () => {
  console.log('=== Firebase Authentication Test ===');
  
  // Test sign up
  const user = await testSignUp();
  
  if (user) {
    // Test sign in
    await testSignIn();
    
    // Test sign out
    console.log('Testing sign out...');
    const signOutResult = await authService.signOut();
    if (signOutResult.success) {
      console.log('✅ Sign out successful!');
    } else {
      console.log('❌ Sign out failed:', signOutResult.error);
    }
  }
  
  console.log('=== Test Complete ===');
};

// Run the tests
runTests().catch(console.error); 