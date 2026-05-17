import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Clipboard from "expo-clipboard";
import { SafeAreaView } from "react-native-safe-area-context";
import { saveHistory, generateId } from "../utils/storage";

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [torchOn, setTorchOn] = useState(false);
  const [scanned, setScanned] = useState(false);

  if (!permission) {
    return (
      <SafeAreaView className="flex-1 bg-[#0A0A0F]">
        <View className="flex-1 items-center justify-center">
          <Text className="text-white text-base">Loading camera...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 bg-[#0A0A0F]">
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-white text-2xl font-bold text-center mb-3">Camera Access Required</Text>
          <Text className="text-white/70 text-base text-center mb-8">
            We need camera permission to scan QR codes
          </Text>
          <TouchableOpacity className="bg-[#00D4FF] px-8 py-4 rounded-xl" onPress={requestPermission}>
            <Text className="text-[#0A0A0F] text-base font-semibold">Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-[#0A0A0F]">
      <CameraView
        className="flex-1"
        facing="back"
        torchMode={torchOn ? "on" : "off"}
        onBarcodeScanned={scanned ? undefined : (data) => {
          setScanned(true);
          handleBarcodeScanned(data.data);
        }}
      >
        <SafeAreaView className="flex-1">
          <View className="flex-row justify-end p-5 pt-14">
            <TouchableOpacity
              className={`w-12 h-12 rounded-full items-center justify-center ${torchOn ? "bg-[#00D4FF]" : "bg-white/15"}`}
              onPress={() => setTorchOn(!torchOn)}
            >
              <Text className="text-2xl">{torchOn ? "🔦" : "💡"}</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-1 items-center justify-center">
            <View className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-10 h-10 border-t-2 border-l-2 border-[#00D4FF]" />
            <View className="absolute top-1/3 right-1/4 translate-x-1/2 -translate-y-1/2 w-10 h-10 border-t-2 border-r-2 border-[#00D4FF]" />
            <View className="absolute bottom-1/3 left-1/4 -translate-x-1/2 translate-y-1/2 w-10 h-10 border-b-2 border-l-2 border-[#00D4FF]" />
            <View className="absolute bottom-1/3 right-1/4 translate-x-1/2 translate-y-1/2 w-10 h-10 border-b-2 border-r-2 border-[#00D4FF]" />
          </View>

          <View className="items-center px-8 pb-14">
            <Text className="text-white text-base font-medium text-center">
              {scanned ? "Copied! Scan another QR code" : "Point at QR code to scan"}
            </Text>
          </View>
        </SafeAreaView>
      </CameraView>
    </View>
  );

  async function handleBarcodeScanned(data: string) {
    await Clipboard.setStringAsync(data);
    await saveHistory({
      id: generateId(),
      type: "TEXT",
      data: { text: data },
      rawString: data,
      createdAt: new Date().toISOString(),
      isGenerated: false,
    });
    setTimeout(() => setScanned(false), 2000);
  }
}