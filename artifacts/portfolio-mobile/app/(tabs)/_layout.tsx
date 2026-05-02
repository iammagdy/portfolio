import { Tabs } from "expo-router";
import React from "react";
import TabBar from "@/components/TabBar";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ tabBarLabel: "Home" }} />
      <Tabs.Screen name="projects" options={{ tabBarLabel: "Projects" }} />
      <Tabs.Screen name="work" options={{ tabBarLabel: "Work" }} />
      <Tabs.Screen name="contact" options={{ tabBarLabel: "Contact" }} />
    </Tabs>
  );
}
