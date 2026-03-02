import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import MainTabs from './MainTab';
import CheckoutScreen from '../checkout/CheckoutScreen';

import { getLoggedInUser } from '../utils/storage';
import CategoryProductsScreen from '../screens/product/CategoryProductScreen';

const Stack = createNativeStackNavigator();

const AppNavigator: React.FC = () => {
  const [initializing, setInitializing] = useState(true);
  const [loggedInUser, setLoggedInUserState] = useState<string | null>(null);

  useEffect(() => {
    const checkLoggedInUser = async () => {
      const email = await getLoggedInUser();
      setLoggedInUserState(email);
      setInitializing(false);
    };
    checkLoggedInUser();
  }, []);

  if (initializing) return null; 

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {loggedInUser ? (
          <>
            <Stack.Screen name="MainTabs">
              {(props) => <MainTabs {...props} setUserState={setLoggedInUserState} />}
            </Stack.Screen>
            
          </>
        ) : (
          <>

            <Stack.Screen name="Login">
              {(props) => <LoginScreen {...props} setUserState={setLoggedInUserState} />}
            </Stack.Screen>
            <Stack.Screen name="Register">
              {(props) => <RegisterScreen {...props} setUserState={setLoggedInUserState} />}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;