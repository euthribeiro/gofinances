import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useTheme } from 'styled-components'
import { MaterialIcons } from '@expo/vector-icons';

import { Dashboard } from '../screens/Dashboard';
import { Register } from '../screens/Register';
import { Resume } from '../screens/Resume';


const { Navigator, Screen } = createBottomTabNavigator();

export function AppRoutes() {
 
  const { colors } = useTheme();
 
  return (
    <Navigator tabBarOptions={{
      activeTintColor: colors.secondary,
      inactiveTintColor: colors.text,
      labelPosition: "beside-icon",
      style: {
        paddingVertical: Platform.OS == 'ios' ? 20 : 0,
        height: 70
      }
    }}>
      <Screen 
        name="Listagem" 
        component={Dashboard}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons 
              size={size}
              color={color}
              name="format-list-bulleted"
            />
          )
        }}
      />
      <Screen 
        name="Cadastrar"
        component={Register}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons 
              size={size}
              color={color}
              name="attach-money"
            />
          )
        }}
      />
      <Screen
        name="Resumo"
        component={Resume}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons 
              size={size}
              color={color}
              name="pie-chart"
            />
          )
        }}
      />
    </Navigator>
  )
}