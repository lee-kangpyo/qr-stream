import { useState, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, Modal, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { QRData, getTypeIcon, getTypeLabel } from "../utils/qrTypes";
import { getHistory, clearHistory } from "../utils/storage";
import { QRPreview } from "../components/QRPreview";

export default function HistoryScreen() {
  const [history, setHistory] = useState<QRData[]>([]);
  const [selectedItem, setSelectedItem] = useState<QRData | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  const loadHistory = async () => {
    const data = await getHistory();
    setHistory(data);
  };

  const handleClear = () => {
    Alert.alert(
      "Clear History",
      "Are you sure you want to delete all history?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            await clearHistory();
            setHistory([]);
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: QRData }) => (
    <TouchableOpacity
      className="bg-white/5 rounded-2xl p-4 border border-white/10"
      onPress={() => setSelectedItem(item)}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center mb-3">
        <Text className="text-[28px] mr-3">{getTypeIcon(item.type)}</Text>
        <View className="flex-1">
          <Text className="text-white text-lg font-semibold">{getTypeLabel(item.type)}</Text>
          <Text className="text-white/50 text-xs mt-0.5">
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <View className={`px-2.5 py-1 rounded-lg ${item.isGenerated ? "bg-[#00D4FF]" : "bg-[#39FF14]"}`}>
          <Text className="text-[#0A0A0F] text-xs font-semibold">
            {item.isGenerated ? "Created" : "Scanned"}
          </Text>
        </View>
      </View>
      <Text className="text-white/70 text-sm leading-5" numberOfLines={2}>
        {item.rawString}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#0A0A0F]">
      <View className="flex-row justify-between items-center px-5 pt-14">
        <Text className="text-white text-[32px] font-bold">History</Text>
        {history.length > 0 && (
          <TouchableOpacity onPress={handleClear}>
            <Text className="text-[#FF4444] text-base font-semibold">Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {history.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-[64px] mb-4">📋</Text>
          <Text className="text-white text-2xl font-bold mb-2">No History Yet</Text>
          <Text className="text-white/50 text-base text-center">
            Scan or generate QR codes to see them here
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle="px-4 py-4 gap-3"
          showsVerticalScrollIndicator={false}
        />
      )}

      <Modal
        visible={selectedItem !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedItem(null)}
      >
        <Pressable className="flex-1 bg-black/85 justify-center items-center p-6" onPress={() => setSelectedItem(null)}>
          <View className="bg-[#1A1A2E] rounded-3xl p-6 items-center w-full max-w-[340px]">
            <View className="flex-row items-center mb-5">
              <Text className="text-[32px] mr-3">{selectedItem && getTypeIcon(selectedItem.type)}</Text>
              <Text className="text-white text-2xl font-bold">{selectedItem && getTypeLabel(selectedItem.type)}</Text>
            </View>
            <QRPreview qrString={selectedItem?.rawString || ""} size={250} />
            <Text className="text-white/70 text-sm text-center mb-5 px-2" numberOfLines={0}>
              {selectedItem?.rawString}
            </Text>
            <TouchableOpacity
              className="bg-[#00D4FF] px-8 py-3.5 rounded-xl"
              onPress={() => setSelectedItem(null)}
            >
              <Text className="text-[#0A0A0F] text-base font-bold">Close</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}