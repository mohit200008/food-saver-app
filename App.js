import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet } from 'react-native';
import { authService } from './src/services/authService';
import { testFirebaseConnection } from './src/services/firebase';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import AddItemScreen from './src/screens/AddItemScreen';
import ItemDetailScreen from './src/screens/ItemDetailScreen';

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Test Firebase connection first
        const connectionTest = await testFirebaseConnection();
        if (!connectionTest.success) {
          setError(`Firebase connection failed: ${connectionTest.error}`);
          setLoading(false);
          return;
        }

        // Listen for authentication state changes
        const unsubscribe = authService.onAuthStateChanged((user) => {
          setUser(user);
          setLoading(false);
          setError(null);
        }, (error) => {
          console.error('Auth state change error:', error);
          setError(error.message);
          setLoading(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error('App initialization error:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Configuration Error</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.errorSubtext}>
          Please check your Firebase configuration and ensure Authentication is enabled in your Firebase project.
        </Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {user ? (
          // Authenticated user screens
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="AddItem" component={AddItemScreen} />
            <Stack.Screen name="ItemDetail" component={ItemDetailScreen} />
          </>
        ) : (
          // Authentication screen
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 18,
    color: '#333',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
