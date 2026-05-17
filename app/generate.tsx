import { useState, useEffect, useMemo } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { SafeAreaView } from "react-native-safe-area-context";
import { QRType, qrTypes, generateQRString, getTypeLabel, getTypeIcon } from "../utils/qrTypes";
import { saveHistory, generateId } from "../utils/storage";

const initialFormState: Record<QRType, Record<string, string>> = {
  TEXT: { text: "" },
  URL: { url: "" },
  WIFI: { ssid: "", password: "", security: "WPA" },
  VCARD: { firstName: "", lastName: "", phone: "", email: "" },
};

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function GenerateScreen() {
  const [selectedType, setSelectedType] = useState<QRType>("TEXT");
  const [formData, setFormData] = useState<Record<string, string>>(initialFormState.TEXT);
  const [inputKey, setInputKey] = useState(0);

  const debouncedFormData = useDebouncedValue(formData, 300);

  const qrString = useMemo(() => {
    return generateQRString(selectedType, debouncedFormData);
  }, [selectedType, debouncedFormData]);

  const handleTypeSelect = (type: QRType) => {
    setSelectedType(type);
    setFormData(initialFormState[type]);
    setInputKey((k) => k + 1);
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!qrString) return;
    await saveHistory({
      id: generateId(),
      type: selectedType,
      data: formData,
      rawString: qrString,
      createdAt: new Date().toISOString(),
      isGenerated: true,
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0A0A0F]">
      <View className="px-5 pt-14">
        <Text className="text-white text-[32px] font-bold">Generate QR</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="max-h-20 border-b border-white/10"
        contentContainerStyle="px-4 flex-row items-center gap-3"
      >
        {qrTypes.map((type) => (
          <TouchableOpacity
            key={type}
            className={`flex-row items-center px-4 py-2.5 rounded-full gap-2 ${selectedType === type ? "bg-[#00D4FF]" : "bg-white/10"}`}
            onPress={() => handleTypeSelect(type)}
          >
            <Text className="text-lg">{getTypeIcon(type)}</Text>
            <Text className={`text-sm font-semibold ${selectedType === type ? "text-[#0A0A0F]" : "text-white/70"}`}>
              {getTypeLabel(type)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView className="flex-1 px-5">
        <View className="gap-4" key={inputKey}>
          {selectedType === "TEXT" && (
            <>
              <Text className="text-white/70 text-sm font-semibold mb-2">Text Content</Text>
              <TextInput
                className="bg-white/10 rounded-xl px-4 py-4 text-white text-base border border-white/20"
                placeholder="Enter text..."
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={formData.text || ""}
                onChangeText={(v) => updateField("text", v)}
                multiline
              />
            </>
          )}

          {selectedType === "URL" && (
            <>
              <Text className="text-white/70 text-sm font-semibold mb-2">URL</Text>
              <TextInput
                className="bg-white/10 rounded-xl px-4 py-4 text-white text-base border border-white/20"
                placeholder="https://..."
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={formData.url || ""}
                onChangeText={(v) => updateField("url", v)}
                keyboardType="url"
                autoCapitalize="none"
              />
            </>
          )}

          {selectedType === "WIFI" && (
            <>
              <Text className="text-white/70 text-sm font-semibold mb-2">Network Name (SSID)</Text>
              <TextInput
                className="bg-white/10 rounded-xl px-4 py-4 text-white text-base border border-white/20"
                placeholder="Wi-Fi Network"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={formData.ssid || ""}
                onChangeText={(v) => updateField("ssid", v)}
              />
              <Text className="text-white/70 text-sm font-semibold mb-2">Password</Text>
              <TextInput
                className="bg-white/10 rounded-xl px-4 py-4 text-white text-base border border-white/20"
                placeholder="Password"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={formData.password || ""}
                onChangeText={(v) => updateField("password", v)}
                secureTextEntry
              />
              <Text className="text-white/70 text-sm font-semibold mb-2">Security</Text>
              <View className="flex-row gap-3">
                {["WPA", "WEP", "nopass"].map((sec) => (
                  <TouchableOpacity
                    key={sec}
                    className={`flex-1 p-3 rounded-xl items-center ${formData.security === sec ? "bg-[#00D4FF]" : "bg-white/10"}`}
                    onPress={() => updateField("security", sec)}
                  >
                    <Text className={`font-semibold ${formData.security === sec ? "text-[#0A0A0F]" : "text-white/70"}`}>
                      {sec}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {selectedType === "VCARD" && (
            <>
              <Text className="text-white/70 text-sm font-semibold mb-2">First Name</Text>
              <TextInput
                className="bg-white/10 rounded-xl px-4 py-4 text-white text-base border border-white/20"
                placeholder="John"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={formData.firstName || ""}
                onChangeText={(v) => updateField("firstName", v)}
              />
              <Text className="text-white/70 text-sm font-semibold mb-2">Last Name</Text>
              <TextInput
                className="bg-white/10 rounded-xl px-4 py-4 text-white text-base border border-white/20"
                placeholder="Doe"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={formData.lastName || ""}
                onChangeText={(v) => updateField("lastName", v)}
              />
              <Text className="text-white/70 text-sm font-semibold mb-2">Phone</Text>
              <TextInput
                className="bg-white/10 rounded-xl px-4 py-4 text-white text-base border border-white/20"
                placeholder="+1234567890"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={formData.phone || ""}
                onChangeText={(v) => updateField("phone", v)}
                keyboardType="phone-pad"
              />
              <Text className="text-white/70 text-sm font-semibold mb-2">Email</Text>
              <TextInput
                className="bg-white/10 rounded-xl px-4 py-4 text-white text-base border border-white/20"
                placeholder="john@example.com"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={formData.email || ""}
                onChangeText={(v) => updateField("email", v)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </>
          )}
        </View>

        <View className="mt-8 items-center">
          <Text className="text-white/70 text-sm font-semibold mb-4">Live Preview</Text>
          <View className="p-6 bg-white rounded-2xl">
            {qrString ? (
              <QRCode value={qrString} size={200} backgroundColor="#ffffff" />
            ) : (
              <View className="w-[200px] h-[200px] items-center justify-center bg-white/90 rounded-2xl">
                <Text className="text-black/50 text-sm text-center px-5">Enter data to generate QR</Text>
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity className="mt-6 bg-[#00D4FF] py-4 rounded-xl items-center" onPress={handleSave}>
          <Text className="text-[#0A0A0F] text-base font-bold">Save to History</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}