import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { authService } from '../services/authService';
import { colors } from '../constants/colors';
import {
  ResponsiveText,
  ResponsiveInput,
  ResponsiveButton,
} from '../components/ResponsiveComponents';
import {
  spacing,
  isTablet,
} from '../utils/responsive';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleAuth = async () => {
    if (!email || !password) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    
    try {
      console.log(`Attempting ${isSignUp ? 'sign up' : 'sign in'} with:`, email);
      
      const result = isSignUp 
        ? await authService.signUp(email, password)
        : await authService.signIn(email, password);

      console.log('Auth result:', result);

      if (result.success) {
        console.log('Authentication successful');
        setErrorMessage('');
        // Navigation will be handled by the auth state listener in App.js
      } else {
        console.error('Authentication failed:', result.error);
        setErrorMessage(result.error);
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setErrorMessage(`Unexpected error: ${error.message}`);
      Alert.alert('Error', 'An unexpected error occurred');
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
          <ResponsiveText variant="title" style={styles.title}>
            🍎 FoodSaver
          </ResponsiveText>
          <ResponsiveText variant="body" style={styles.subtitle}>
            {isSignUp ? 'Create your account' : 'Welcome back!'}
          </ResponsiveText>
        </View>

        <View style={styles.form}>
          <ResponsiveInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <ResponsiveInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          {errorMessage ? (
            <ResponsiveText variant="caption" style={styles.errorText}>
              {errorMessage}
            </ResponsiveText>
          ) : null}

          <ResponsiveButton
            title={isLoading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
            onPress={handleAuth}
            disabled={isLoading}
            size={isTablet ? 'large' : 'medium'}
          />

          <ResponsiveButton
            title={isSignUp 
              ? 'Already have an account? Sign In' 
              : "Don't have an account? Sign Up"
            }
            onPress={() => {
              setIsSignUp(!isSignUp);
              setErrorMessage('');
            }}
            variant="secondary"
            size={isTablet ? 'large' : 'medium'}
            style={styles.switchButton}
          />
        </View>
      </ScrollView>
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
    justifyContent: 'center',
    padding: isTablet ? spacing.xl : spacing.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: isTablet ? spacing.xxl : spacing.xl,
  },
  title: {
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  switchButton: {
    marginTop: spacing.sm,
  },
  errorText: {
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.sm,
  },
});

export default LoginScreen; 