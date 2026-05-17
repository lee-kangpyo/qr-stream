import "../global.css";
import { Tabs } from "expo-router";
import { Text } from "react-native";
import { SafeAreaProvider, SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "react-native-css";

// NativeWind v5: Wrap the component with styled() to bridge the className prop
const SafeAreaView = styled(RNSafeAreaView, {
  className: "style",
});

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
    <SafeAreaProvider>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: "#0A0A0F",
            borderTopColor: "rgba(255,255,255,0.1)",
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
    </SafeAreaProvider>
  );
}