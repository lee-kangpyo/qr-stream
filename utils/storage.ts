import AsyncStorage from "@react-native-async-storage/async-storage";
import { QRData } from "./qrTypes";

const HISTORY_KEY = "@qr_history";

export const getHistory = async (): Promise<QRData[]> => {
  try {
    const json = await AsyncStorage.getItem(HISTORY_KEY);
    return json ? JSON.parse(json) : [];
  } catch (error) {
    console.error("Failed to get history:", error);
    return [];
  }
};

export const saveHistory = async (item: QRData): Promise<void> => {
  try {
    const history = await getHistory();
    history.unshift(item);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error("Failed to save history:", error);
  }
};

export const clearHistory = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error("Failed to clear history:", error);
  }
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};