import React from "react";
import { Text, TextInput } from "react-native";

interface VCardFormProps {
  value: Record<string, string>;
  onChange: (field: string, value: string) => void;
}

export const VCardForm = React.memo(({ value, onChange }: VCardFormProps) => {
  return (
    <>
      <Text className="text-white/70 text-sm font-semibold mb-2">First Name</Text>
      <TextInput
        className="bg-white/10 rounded-xl px-4 py-4 text-white text-base border border-white/20"
        placeholder="John"
        placeholderTextColor="rgba(255,255,255,0.4)"
        value={value.firstName || ""}
        onChangeText={(v) => onChange("firstName", v)}
      />
      <Text className="text-white/70 text-sm font-semibold mb-2">Last Name</Text>
      <TextInput
        className="bg-white/10 rounded-xl px-4 py-4 text-white text-base border border-white/20"
        placeholder="Doe"
        placeholderTextColor="rgba(255,255,255,0.4)"
        value={value.lastName || ""}
        onChangeText={(v) => onChange("lastName", v)}
      />
      <Text className="text-white/70 text-sm font-semibold mb-2">Phone</Text>
      <TextInput
        className="bg-white/10 rounded-xl px-4 py-4 text-white text-base border border-white/20"
        placeholder="+1234567890"
        placeholderTextColor="rgba(255,255,255,0.4)"
        value={value.phone || ""}
        onChangeText={(v) => onChange("phone", v)}
        keyboardType="phone-pad"
      />
      <Text className="text-white/70 text-sm font-semibold mb-2">Email</Text>
      <TextInput
        className="bg-white/10 rounded-xl px-4 py-4 text-white text-base border border-white/20"
        placeholder="john@example.com"
        placeholderTextColor="rgba(255,255,255,0.4)"
        value={value.email || ""}
        onChangeText={(v) => onChange("email", v)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
    </>
  );
});