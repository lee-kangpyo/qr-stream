import React, { useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { SuffixOption } from "../../hooks/useQRGenerator";

interface SplitFormProps {
  splitText: string;
  setSplitText: (text: string) => void;
  chunkSize: number;
  setChunkSize: (size: number) => void;
  suffix: SuffixOption;
  setSuffix: (s: SuffixOption) => void;
}

const SUFFIX_OPTIONS: { label: string; value: SuffixOption }[] = [
  { label: "None", value: "none" },
  { label: "Enter (\\n)", value: "enter" },
  { label: "Tab (\\t)", value: "tab" },
];

const CHUNK_PRESETS = [50, 100, 200, 300, 500, 800, 1000, 1500, 2000];

export const SplitForm = React.memo(
  ({ splitText, setSplitText, chunkSize, setChunkSize, suffix, setSuffix }: SplitFormProps) => {
    const handleFileUpload = useCallback(async () => {
      try {
        const result = await DocumentPicker.getDocumentAsync({
          type: "*/*",
          copyToCacheDirectory: true,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
          const file = result.assets[0];
          if (file.uri) {
            const content = await FileSystem.readAsStringAsync(file.uri);
            setSplitText(content);
          }
        }
      } catch {
        // silently ignore file picker errors
      }
    }, [setSplitText]);

    return (
      <View className="gap-4">
        <Text className="text-white/70 text-sm font-semibold mb-2">Text Content</Text>
        <TextInput
          className="bg-white/10 rounded-xl px-4 py-4 text-white text-base border border-white/20 min-h-[120px]"
          placeholder="Enter or paste text to split..."
          placeholderTextColor="rgba(255,255,255,0.4)"
          value={splitText}
          onChangeText={setSplitText}
          multiline
          textAlignVertical="top"
        />

        <TouchableOpacity
          className="bg-white/10 rounded-xl px-4 py-3.5 border border-white/20 flex-row items-center justify-center gap-2"
          onPress={handleFileUpload}
        >
          <Text className="text-white text-base">📎</Text>
          <Text className="text-white/80 text-sm font-semibold">Upload File (.txt, .js, .md, etc.)</Text>
        </TouchableOpacity>

        <View className="gap-2">
          <Text className="text-white/70 text-sm font-semibold">
            Chunk Size: {chunkSize} chars
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {CHUNK_PRESETS.map((preset) => (
              <TouchableOpacity
                key={preset}
                className={`px-3 py-1.5 rounded-lg ${chunkSize === preset ? "bg-[#00D4FF]" : "bg-white/10"}`}
                onPress={() => setChunkSize(preset)}
              >
                <Text
                  className={`text-xs font-semibold ${chunkSize === preset ? "text-[#0A0A0F]" : "text-white/70"}`}
                >
                  {preset}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="gap-2">
          <Text className="text-white/70 text-sm font-semibold">End Delimiter</Text>
          <View className="flex-row gap-2">
            {SUFFIX_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                className={`px-4 py-2 rounded-lg flex-1 items-center ${suffix === opt.value ? "bg-[#00D4FF]" : "bg-white/10"}`}
                onPress={() => setSuffix(opt.value)}
              >
                <Text
                  className={`text-sm font-semibold ${suffix === opt.value ? "text-[#0A0A0F]" : "text-white/70"}`}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    );
  }
);
