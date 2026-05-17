import { Tabs } from "expo-router";
import { Text } from "react-native";

function TabIcon({ name }: { name: string }) {
  const icons: Record<string, string> = {
    scan: "📷",
    generate: "🔲",
    history: "📋",
  };
  return <Text style={{ fontSize: 20 }}>{icons[name]}</Text>;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#0A0A0F",
          borderTopColor: "rgba(255,255,255,0.1)",
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: "#00D4FF",
        tabBarInactiveTintColor: "rgba(255,255,255,0.5)",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="scan"
        options={{
          title: "Scan",
          tabBarIcon: () => <TabIcon name="scan" />,
        }}
      />
      <Tabs.Screen
        name="generate"
        options={{
          title: "Generate",
          tabBarIcon: () => <TabIcon name="generate" />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: () => <TabIcon name="history" />,
        }}
      />
    </Tabs>
  );
}