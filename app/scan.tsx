import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Clipboard from "expo-clipboard";
import { saveHistory, generateId } from "../utils/storage";

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [torchOn, setTorchOn] = useState(false);
  const [scanned, setScanned] = useState(false);

  if (!permission) {
    return (
      <View className="flex-1 bg-[#0A0A0F] pt-safe">
        <View className="flex-1 items-center justify-center">
          <Text className="text-white text-base">Loading camera...</Text>
        </View>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 bg-[#0A0A0F] pt-safe">
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-white text-2xl font-bold text-center mb-3">Camera Access Required</Text>
          <Text className="text-white/70 text-base text-center mb-8">
            We need camera permission to scan QR codes
          </Text>
          <TouchableOpacity className="bg-[#00D4FF] px-8 py-4 rounded-xl" onPress={requestPermission}>
            <Text className="text-[#0A0A0F] text-base font-semibold">Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#0A0A0F]">
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        enableTorch={torchOn}
        onBarcodeScanned={scanned ? undefined : (data) => {
          setScanned(true);
          handleBarcodeScanned(data.data);
        }}
      />
      <View style={StyleSheet.absoluteFillObject} className="pt-safe justify-between" pointerEvents="box-none">
        <View className="flex-row justify-end p-5 pt-4" pointerEvents="box-none">
          <TouchableOpacity
            className={`w-12 h-12 rounded-full items-center justify-center ${torchOn ? "bg-[#00D4FF]" : "bg-white/15"}`}
            onPress={() => setTorchOn(!torchOn)}
          >
            <Text className="text-2xl">{torchOn ? "🔦" : "💡"}</Text>
          </TouchableOpacity>
        </View>

        <View className="items-center justify-center" pointerEvents="none">
          <View className="w-64 h-64 border-2 border-white/20 rounded-3xl items-center justify-center">
            {/* Viewfinder brackets */}
            <View className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#00D4FF] rounded-tl-xl" />
            <View className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#00D4FF] rounded-tr-xl" />
            <View className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#00D4FF] rounded-bl-xl" />
            <View className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#00D4FF] rounded-br-xl" />
          </View>
        </View>

        <View className="items-center px-8 pb-14" pointerEvents="none">
          <Text className="text-white text-base font-medium text-center bg-black/60 px-6 py-3 rounded-full overflow-hidden">
            {scanned ? "Copied! Scan another QR code" : "Point at QR code to scan"}
          </Text>
        </View>
      </View>
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