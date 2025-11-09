import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const createTestAccount = async () => {
    setLoading(true);
    try {
      const testEmail = 'test@orderflow.com';
      const testPassword = 'test123456';
      
      console.log('Creating test account...');
      await createUserWithEmailAndPassword(auth, testEmail, testPassword);
      
      setEmail(testEmail);
      setPassword(testPassword);
      
      Alert.alert(
        'Test Account Created',
        `Email: ${testEmail}\nPassword: ${testPassword}\n\nYou can now use these credentials to login.`,
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setEmail('test@orderflow.com');
        setPassword('test123456');
        Alert.alert(
          'Test Account Exists',
          'Test account already exists!\n\nEmail: test@orderflow.com\nPassword: test123456',
          [{ text: 'OK' }]
        );
      } else {
        console.error('Test account error:', error);
        Alert.alert('Error', `Failed to create test account: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    
    try {
      if (isSignUp) {
        // Create new user account
        console.log('Creating account for:', email);
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log('Account created successfully:', userCredential.user.uid);
        Alert.alert(
          'Success',
          'Account created successfully!',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Main')
            }
          ]
        );
      } else {
        // Sign in existing user
        console.log('Signing in user:', email);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('User signed in successfully:', userCredential.user.uid);
        navigation.navigate('Main');
      }
    } catch (error: any) {
      console.error('Authentication error:', error.code, error.message);
      let errorMessage = 'Authentication failed';
      let suggestion = '';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email';
          suggestion = '\n\nTry creating an account first by toggling to Sign Up.';
          break;
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          errorMessage = 'Incorrect email or password';
          suggestion = '\n\nDouble-check your email and password, or create a new account.';
          break;
        case 'auth/email-already-in-use':
          errorMessage = 'Email is already registered';
          suggestion = '\n\nTry signing in instead of signing up.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          suggestion = '\n\nPlease enter a valid email format.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak';
          suggestion = '\n\nPassword must be at least 6 characters long.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts';
          suggestion = '\n\nPlease wait a moment before trying again.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error';
          suggestion = '\n\nCheck your internet connection and try again.';
          break;
        default:
          errorMessage = `Authentication failed: ${error.message}`;
          suggestion = '\n\nPlease try again or contact support if the issue persists.';
      }
      
      Alert.alert(
        'Authentication Error',
        errorMessage + suggestion,
        [
          { text: 'OK' },
          ...(error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential' ? 
            [{ text: 'Create Account', onPress: () => setIsSignUp(true) }] : 
            []
          )
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>OrderFlow</Text>
        <Text style={styles.subtitle}>Sign in to manage orders</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="password"
        />

        <TouchableOpacity 
          style={[styles.loginButton, loading && styles.loginButtonDisabled]}
          onPress={handleAuth}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.loginButtonText}>
              {isSignUp ? 'Sign Up' : 'Login'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.toggleButton}
          onPress={() => setIsSignUp(!isSignUp)}
        >
          <Text style={styles.toggleText}>
            {isSignUp ? 'Already have an account? Login' : 'Need an account? Sign Up'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.testButton}
          onPress={createTestAccount}
          disabled={loading}
        >
          <Text style={styles.testButtonText}>
            Create Test Account
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 20,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#006D77',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
  },
  form: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  loginButton: {
    backgroundColor: '#006D77',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonDisabled: {
    backgroundColor: '#A0AEC0',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  toggleButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  toggleText: {
    color: '#006D77',
    fontSize: 14,
    fontWeight: '500',
  },
  testButton: {
    marginTop: 12,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#F7FAFC',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  testButtonText: {
    color: '#4A5568',
    fontSize: 12,
    fontWeight: '500',
  },
});