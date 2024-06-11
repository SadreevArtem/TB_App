import { Tabs, router } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuthStore } from '@/stores/auth-store';


export default function TabLayout() {
  const colorScheme = useColorScheme();
  const {token, setToken} = useAuthStore();
  const isAuth = !!token;
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarStyle: {display:isAuth?"flex": "none"}
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Личный кабинет",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "person" : "person-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Все курсы",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "book" : "book-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="exit"
        options={{
          title: "Выйти",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "exit" : "exit-outline"}
              color={color}
              onPress={() => {
                setToken("");
                router.replace("");
              }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
