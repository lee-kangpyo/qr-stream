import React from "react";
import { Text, TextInput } from "react-native";

interface UrlFormProps {
  value: string;
  onChange: (field: string, value: string) => void;
}

export const UrlForm = React.memo(({ value, onChange }: UrlFormProps) => {
  return (
    <>
      <Text className="text-white/70 text-sm font-semibold mb-2">URL</Text>
      <TextInput
        className="bg-white/10 rounded-xl px-4 py-4 text-white text-base border border-white/20"
        placeholder="https://..."
        placeholderTextColor="rgba(255,255,255,0.4)"
        value={value}
        onChangeText={(v) => onChange("url", v)}
        keyboardType="url"
        autoCapitalize="none"
      />
    </>
  );
});