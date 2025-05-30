import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeStackNavigator from './HomeStackNavigator'
import { colors } from '../global/colors'
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from '@expo/vector-icons/Ionicons';
import Header from '../components/Header'
import CartStackNavigator from './CartStackNavigator'
import OrderStackNavigator from './OrderStackNavigator'
import MyProfileStackNavigator from './MyProfileStackNavigator'

const Tab = createBottomTabNavigator()

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        header: () => {
          return <Header route={route} />;
        },
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.platinum,
        tabBarInactiveTintColor: colors.white,
      })}
    >
      <Tab.Screen
        name="HomeScreenNavigator"
        component={HomeStackNavigator}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View style={[
              styles.iconContainer,
              focused && styles.activeIconContainer
            ]}>
                <FontAwesome5
                  name="store"
                size={28}
                color={color}
                />
              </View>
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartStackNavigator}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View style={[
              styles.iconContainer,
              focused && styles.activeIconContainer
            ]}>
              <AntDesign
                name="shoppingcart"
                size={28}
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrderStackNavigator}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View style={[
              styles.iconContainer,
              focused && styles.activeIconContainer
            ]}>
                <FontAwesome6
                  name="clipboard-list"
                size={28}
                color={color}
                />
              </View>
          ),
        }}
      />
      <Tab.Screen 
        name="PerfilTab"
        component={MyProfileStackNavigator}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View style={[
              styles.iconContainer,
              focused && styles.activeIconContainer
            ]}>
              <Ionicons 
                name="person-circle" 
                size={28} 
                color={color} 
              />
              </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default BottomTabNavigator

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.fondo,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 8,
    height: 65,
    borderTopWidth: 0,
    paddingVertical: 8,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    width: 45,
    borderRadius: 12,
    backgroundColor: colors.teal600,
  },
  activeIconContainer: {
    backgroundColor: colors.teal400,
  },
});
