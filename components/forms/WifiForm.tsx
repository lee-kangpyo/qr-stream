import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

interface WifiFormProps {
  value: Record<string, string>;
  onChange: (field: string, value: string) => void;
}

export const WifiForm = React.memo(({ value, onChange }: WifiFormProps) => {
  return (
    <>
      <Text className="text-white/70 text-sm font-semibold mb-2">Network Name (SSID)</Text>
      <TextInput
        className="bg-white/10 rounded-xl px-4 py-4 text-white text-base border border-white/20"
        placeholder="Wi-Fi Network"
        placeholderTextColor="rgba(255,255,255,0.4)"
        value={value.ssid || ""}
        onChangeText={(v) => onChange("ssid", v)}
      />
      <Text className="text-white/70 text-sm font-semibold mb-2">Password</Text>
      <TextInput
        className="bg-white/10 rounded-xl px-4 py-4 text-white text-base border border-white/20"
        placeholder="Password"
        placeholderTextColor="rgba(255,255,255,0.4)"
        value={value.password || ""}
        onChangeText={(v) => onChange("password", v)}
        secureTextEntry
      />
      <Text className="text-white/70 text-sm font-semibold mb-2">Security</Text>
      <View className="flex-row gap-3">
        {["WPA", "WEP", "nopass"].map((sec) => (
          <TouchableOpacity
            key={sec}
            className={`flex-1 p-3 rounded-xl items-center ${value.security === sec ? "bg-[#00D4FF]" : "bg-white/10"}`}
            onPress={() => onChange("security", sec)}
          >
            <Text className={`font-semibold ${value.security === sec ? "text-[#0A0A0F]" : "text-white/70"}`}>
              {sec}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
});