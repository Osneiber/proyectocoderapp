import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Orders from '../screens/Orders'
import OrderDetail from '../screens/OrderDetail'

import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const OrderStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Orders" component={Orders} />
      <Stack.Screen name="OrderDetail" component={OrderDetail} />
    </Stack.Navigator>
  );
}

export default OrderStackNavigator

const styles = StyleSheet.create({})
