import { View, Text, Image } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import {Colors} from "./../../constants/Colors"

import homeIcon from "@/assets/images/category.png"
import newsletter from "@/assets/images/newsletter.png";
import account from "@/assets/images/account.png";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.PRIMARY,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          // tabBarLabel: "Feed",
          tabBarIcon: ({ color }) => (
            <View style={{ width: 24, height: 24 }}>
              <Image
                source={homeIcon}
                style={{ width: 24, height: 24, tintColor: color }}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="newsletter"
        options={{
          // tabBarLabel: "Newsletter",
          tabBarIcon: ({ color }) => (
            <View style={{ width: 24, height: 24 }}>
              <Image
                source={newsletter}
                style={{ width: 24, height: 24, tintColor: color }}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          tabBarIcon: ({ color }) => (
            <View style={{ width: 24, height: 24 }}>
              <Image
                source={account}
                style={{ width: 24, height: 24, tintColor: color }}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
