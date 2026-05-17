import React from "react";
import { Text, TextInput } from "react-native";

interface TextFormProps {
  value: string;
  onChange: (field: string, value: string) => void;
}

export const TextForm = React.memo(({ value, onChange }: TextFormProps) => {
  return (
    <>
      <Text className="text-white/70 text-sm font-semibold mb-2">Text Content</Text>
      <TextInput
        className="bg-white/10 rounded-xl px-4 py-4 text-white text-base border border-white/20"
        placeholder="Enter text..."
        placeholderTextColor="rgba(255,255,255,0.4)"
        value={value}
        onChangeText={(v) => onChange("text", v)}
        multiline
      />
    </>
  );
});