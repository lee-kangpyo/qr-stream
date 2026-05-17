import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { QRType, qrTypes, getTypeLabel, getTypeIcon } from "../utils/qrTypes";
import { useQRGenerator, GenerateMode } from "../hooks/useQRGenerator";
import { TextForm } from "../components/forms/TextForm";
import { UrlForm } from "../components/forms/UrlForm";
import { WifiForm } from "../components/forms/WifiForm";
import { VCardForm } from "../components/forms/VCardForm";
import { SplitForm } from "../components/forms/SplitForm";
import { QRPreview } from "../components/QRPreview";
import { SplitQRViewer } from "../components/SplitQRViewer";

const MODE_OPTIONS: { key: GenerateMode; label: string; icon: string }[] = [
  { key: "single", label: "Single QR", icon: "📱" },
  { key: "split", label: "Split QR", icon: "📄" },
];

export default function GenerateScreen() {
  const {
    selectedType,
    formData,
    qrString,
    inputKey,
    updateField,
    handleTypeSelect,
    handleSave,
    generateMode,
    setGenerateMode,
    splitText,
    setSplitText,
    chunkSize,
    setChunkSize,
    suffix,
    setSuffix,
    chunks,
    isPlaying,
    currentIndex,
    autoPlayInterval,
    setAutoPlayInterval,
    togglePlay,
    nextChunk,
    prevChunk,
    resetPlayback,
    goToEnd,
    currentChunkQR,
  } = useQRGenerator();

  const renderForm = () => {
    switch (selectedType) {
      case "TEXT":
        return <TextForm value={formData.text || ""} onChange={updateField} />;
      case "URL":
        return <UrlForm value={formData.url || ""} onChange={updateField} />;
      case "WIFI":
        return <WifiForm value={formData} onChange={updateField} />;
      case "VCARD":
        return <VCardForm value={formData} onChange={updateField} />;
      default:
        return null;
    }
  };

  const renderSingleMode = () => (
    <>
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
          {renderForm()}
        </View>

        <View className="mt-8 items-center">
          <Text className="text-white/70 text-sm font-semibold mb-4">Live Preview</Text>
          <QRPreview qrString={qrString} placeholder="Enter data to generate QR" />
        </View>

        <TouchableOpacity className="mt-6 bg-[#00D4FF] py-4 rounded-xl items-center" onPress={handleSave}>
          <Text className="text-[#0A0A0F] text-base font-bold">Save to History</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );

  const renderSplitMode = () => (
    <ScrollView className="flex-1 px-5">
      <View className="gap-4 mt-4">
        <SplitForm
          splitText={splitText}
          setSplitText={setSplitText}
          chunkSize={chunkSize}
          setChunkSize={setChunkSize}
          suffix={suffix}
          setSuffix={setSuffix}
        />
      </View>

      <View className="mt-6 items-center">
        <Text className="text-white/70 text-sm font-semibold mb-4">Split QR Viewer</Text>
        <SplitQRViewer
          chunks={chunks}
          currentIndex={currentIndex}
          currentChunkQR={currentChunkQR}
          isPlaying={isPlaying}
          autoPlayInterval={autoPlayInterval}
          setAutoPlayInterval={setAutoPlayInterval}
          togglePlay={togglePlay}
          nextChunk={nextChunk}
          prevChunk={prevChunk}
          resetPlayback={resetPlayback}
          goToEnd={goToEnd}
        />
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#0A0A0F]">
      <View className="px-5 pt-14">
        <Text className="text-white text-[32px] font-bold">Generate QR</Text>
      </View>

      <View className="flex-row px-5 mt-4 mb-2 gap-2">
        {MODE_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.key}
            className={`flex-1 flex-row items-center justify-center py-2.5 rounded-full gap-2 ${generateMode === opt.key ? "bg-[#00D4FF]" : "bg-white/10"}`}
            onPress={() => setGenerateMode(opt.key)}
          >
            <Text className="text-base">{opt.icon}</Text>
            <Text className={`text-sm font-semibold ${generateMode === opt.key ? "text-[#0A0A0F]" : "text-white/70"}`}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {generateMode === "single" ? renderSingleMode() : renderSplitMode()}
    </SafeAreaView>
  );
}
