import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { House, ShoppingCart, Receipt, User } from 'phosphor-react-native';
import CartScreen from '../screens/cart/CartScreen';
import OrderScreen from '../screens/order/OrderScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import HomeStack from './HomeStack';

const Tab = createBottomTabNavigator();

const MainTabs = ({ setUserState }: any) => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen
        name="Home"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <House
              size={size}
              color={color}
              weight={focused ? 'fill' : 'regular'}
            />
          ),
        }}
      >
        {() => <HomeStack setUserState={setUserState} />}
      </Tab.Screen>

      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <ShoppingCart
              size={size}
              color={color}
              weight={focused ? 'fill' : 'regular'}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Orders"
        component={OrderScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Receipt
              size={size}
              color={color}
              weight={focused ? 'fill' : 'regular'}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <User
              size={size}
              color={color}
              weight={focused ? 'fill' : 'regular'}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabs;