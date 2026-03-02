import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = 'user';
const LOGGED_IN_KEY = 'logged_in_user';

export const saveUser = async (user: { name: string; email: string; password: string }) => {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user:', error);
  }
};

export const getUser = async () => {
  try {
    const data = await AsyncStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

export const setLoggedInUser = async (email: string) => {
  try {
    await AsyncStorage.setItem(LOGGED_IN_KEY, email);
  } catch (error) {
    console.error('Error setting logged in user:', error);
  }
};

export const getLoggedInUser = async () => {
  try {
    return await AsyncStorage.getItem(LOGGED_IN_KEY);
  } catch (error) {
    return null;
  }
};

export const logoutUser = async () => {
  try {
    await AsyncStorage.removeItem(LOGGED_IN_KEY);
  } catch (error) {
    console.error('Error logging out user:', error);
  }
};