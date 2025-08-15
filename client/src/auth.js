import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from './firebase';

// Register new user
export const register = async (email, password) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert('✅ Registration successful!');
  } catch (error) {
    handleAuthError(error, 'Registration');
  }
};

// Login existing user
export const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert('✅ Login successful!');
  } catch (error) {
    handleAuthError(error, 'Login');
  }
};

// Logout user
export const logout = async () => {
  try {
    await signOut(auth);
    alert('👋 Logged out successfully.');
  } catch (error) {
    alert('Logout Error: ' + error.message);
  }
};

// Error handler function
const handleAuthError = (error, context) => {
  let message = `${context} Error: `;

  switch (error.code) {
    case 'auth/email-already-in-use':
      message += 'Email already in use.';
      break;
    case 'auth/invalid-email':
      message += 'Invalid email address.';
      break;
    case 'auth/user-not-found':
      message += 'No user found with this email.';
      break;
    case 'auth/wrong-password':
      message += 'Incorrect password.';
      break;
    case 'auth/weak-password':
      message += 'Password should be at least 6 characters.';
      break;
    default:
      message += error.message;
  }

  alert(message);
};
