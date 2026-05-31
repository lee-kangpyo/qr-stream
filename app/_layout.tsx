import "../global.css";
import { useEffect, useRef } from "react";
import { Tabs, useRouter } from "expo-router";
import { Text } from "react-native";
import { SafeAreaProvider, SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "react-native-css";
import { useShareIntent } from "expo-share-intent";

const SafeAreaView = styled(RNSafeAreaView, {
  className: "style",
});

function TabIcon({ name }: { name: string }) {
  const icons: Record<string, string> = {
    index: "📷",
    generate: "🔲",
    history: "📋",
  };
  return <Text style={{ fontSize: 20 }}>{icons[name]}</Text>;
}

export default function TabLayout() {
  const router = useRouter();
  const { hasShareIntent, shareIntent, resetShareIntent } = useShareIntent({
    debug: false,
    resetOnBackground: true,
  });
  const processedRef = useRef(false);

  useEffect(() => {
    if (!hasShareIntent || processedRef.current) return;

    const text = shareIntent.text || shareIntent.webUrl || "";
    if (!text) return;

    processedRef.current = true;
    const mode = text.length <= 200 ? "single" : "split";
    router.replace(`/generate?text=${encodeURIComponent(text)}&mode=${mode}`);
    resetShareIntent();

    const timer = setTimeout(() => {
      processedRef.current = false;
    }, 2000);

    return () => clearTimeout(timer);
  }, [hasShareIntent, shareIntent, resetShareIntent, router]);

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
          name="index"
          options={{
            title: "Scan",
            tabBarIcon: () => <TabIcon name="index" />,
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