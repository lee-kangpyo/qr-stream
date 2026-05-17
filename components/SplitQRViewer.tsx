import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { QRPreview } from "./QRPreview";

interface SplitQRViewerProps {
  chunks: string[];
  currentIndex: number;
  currentChunkQR: string;
  isPlaying: boolean;
  autoPlayInterval: number;
  setAutoPlayInterval: (ms: number) => void;
  togglePlay: () => void;
  nextChunk: () => void;
  prevChunk: () => void;
  resetPlayback: () => void;
  goToEnd: () => void;
}

const SPEED_PRESETS = [
  { label: "0.2s", ms: 200 },
  { label: "0.5s", ms: 500 },
  { label: "1.0s", ms: 1000 },
  { label: "1.5s", ms: 1500 },
  { label: "2.0s", ms: 2000 },
  { label: "3.0s", ms: 3000 },
];

export const SplitQRViewer = React.memo(
  ({
    chunks,
    currentIndex,
    currentChunkQR,
    isPlaying,
    autoPlayInterval,
    setAutoPlayInterval,
    togglePlay,
    nextChunk,
    prevChunk,
    resetPlayback,
    goToEnd,
  }: SplitQRViewerProps) => {
    if (chunks.length === 0) {
      return (
        <View className="items-center py-8">
          <QRPreview qrString="" placeholder="Enter text or upload a file to start" />
        </View>
      );
    }

    return (
      <View className="gap-4">
        <View className="items-center">
          <QRPreview qrString={currentChunkQR} size={240} placeholder="No data" />
        </View>

        <View className="items-center">
          <Text className="text-white/70 text-sm font-semibold">
            {currentIndex + 1} / {chunks.length}
          </Text>
        </View>

        <View className="flex-row items-center justify-center gap-4">
          <TouchableOpacity
            className="w-12 h-12 rounded-full bg-white/10 items-center justify-center"
            onPress={resetPlayback}
          >
            <Text className="text-white text-lg">|◀</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-12 h-12 rounded-full bg-white/10 items-center justify-center"
            onPress={prevChunk}
          >
            <Text className="text-white text-lg">◀</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`w-14 h-14 rounded-full items-center justify-center ${isPlaying ? "bg-[#FF6B6B]" : "bg-[#00D4FF]"}`}
            onPress={togglePlay}
          >
            <Text className="text-[#0A0A0F] text-xl font-bold">
              {isPlaying ? "||" : "▶"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-12 h-12 rounded-full bg-white/10 items-center justify-center"
            onPress={nextChunk}
          >
            <Text className="text-white text-lg">▶</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-12 h-12 rounded-full bg-white/10 items-center justify-center"
            onPress={goToEnd}
          >
            <Text className="text-white text-lg">▶|</Text>
          </TouchableOpacity>
        </View>

        <View className="gap-2 mt-2">
          <Text className="text-white/70 text-sm font-semibold">
            Speed: {(autoPlayInterval / 1000).toFixed(1)}s
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {SPEED_PRESETS.map((preset) => (
              <TouchableOpacity
                key={preset.ms}
                className={`px-3 py-1.5 rounded-lg ${autoPlayInterval === preset.ms ? "bg-[#00D4FF]" : "bg-white/10"}`}
                onPress={() => setAutoPlayInterval(preset.ms)}
              >
                <Text
                  className={`text-xs font-semibold ${autoPlayInterval === preset.ms ? "text-[#0A0A0F]" : "text-white/70"}`}
                >
                  {preset.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    );
  }
);
