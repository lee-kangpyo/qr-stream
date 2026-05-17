import React from "react";
import { View, Text } from "react-native";
import QRCode from "react-native-qrcode-svg";

interface QRPreviewProps {
  qrString: string;
  size?: number;
  placeholder?: string;
}

export const QRPreview = React.memo(({ qrString, size = 200, placeholder = "Enter data to generate QR" }: QRPreviewProps) => {
  return (
    <View className="p-6 bg-white rounded-2xl">
      {qrString ? (
        <QRCode value={qrString} size={size} backgroundColor="#ffffff" />
      ) : (
        <View 
          className="items-center justify-center bg-white/90 rounded-2xl"
          style={{ width: size, height: size }}
        >
          <Text className="text-black/50 text-sm text-center px-5">{placeholder}</Text>
        </View>
      )}
    </View>
  );
});