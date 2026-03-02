import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/home/HomeScreen';
import ProductScreen from '../screens/product/ProductScreen';
import ProductDetailScreen from '../screens/product/ProductDetailScreen';
import CheckoutScreen from '../checkout/CheckoutScreen';
import CategoryProductsScreen from '../screens/product/CategoryProductScreen';

const Stack = createNativeStackNavigator();

const HomeStack = ({ setUserState }: any) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home">
        {(props: any) => <HomeScreen {...props} setUserState={setUserState} />}
      </Stack.Screen>

      <Stack.Screen name="Product" component={ProductScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen
        name="CategoryProducts"
        component={CategoryProductsScreen}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
