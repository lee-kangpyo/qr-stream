import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { QRType, generateQRString } from "../utils/qrTypes";
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

export type SuffixOption = "none" | "enter" | "tab";

export type GenerateMode = "single" | "split";

export interface UseQRGeneratorReturn {
  selectedType: QRType;
  formData: Record<string, string>;
  debouncedFormData: Record<string, string>;
  qrString: string;
  inputKey: number;
  updateField: (field: string, value: string) => void;
  handleTypeSelect: (type: QRType) => void;
  handleSave: () => Promise<void>;
  generateMode: GenerateMode;
  setGenerateMode: (mode: GenerateMode) => void;
  splitText: string;
  setSplitText: (text: string) => void;
  chunkSize: number;
  setChunkSize: (size: number) => void;
  suffix: SuffixOption;
  setSuffix: (s: SuffixOption) => void;
  chunks: string[];
  isPlaying: boolean;
  currentIndex: number;
  autoPlayInterval: number;
  setAutoPlayInterval: (ms: number) => void;
  togglePlay: () => void;
  nextChunk: () => void;
  prevChunk: () => void;
  resetPlayback: () => void;
  goToEnd: () => void;
  currentChunkQR: string;
}

export function useQRGenerator(): UseQRGeneratorReturn {
  const [selectedType, setSelectedType] = useState<QRType>("TEXT");
  const [formData, setFormData] = useState<Record<string, string>>(initialFormState.TEXT);
  const [inputKey, setInputKey] = useState(0);

  const [generateMode, setGenerateMode] = useState<GenerateMode>("single");

  const [splitText, setSplitText] = useState("");
  const [chunkSize, setChunkSize] = useState(200);
  const [suffix, setSuffix] = useState<SuffixOption>("none");

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlayInterval, setAutoPlayInterval] = useState(1000);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const debouncedFormData = useDebouncedValue(formData, 300);

  const qrString = useMemo(() => {
    return generateQRString(selectedType, debouncedFormData);
  }, [selectedType, debouncedFormData]);

  const chunks = useMemo(() => {
    if (!splitText) return [];
    const result: string[] = [];
    for (let i = 0; i < splitText.length; i += chunkSize) {
      let chunk = splitText.slice(i, i + chunkSize);
      if (suffix === "enter") chunk += "\n";
      else if (suffix === "tab") chunk += "\t";
      result.push(chunk);
    }
    return result;
  }, [splitText, chunkSize, suffix]);

  const currentChunkQR = useMemo(() => {
    if (chunks.length === 0) return "";
    const idx = Math.min(currentIndex, chunks.length - 1);
    return chunks[idx] || "";
  }, [chunks, currentIndex]);

  const handleTypeSelect = useCallback((type: QRType) => {
    setSelectedType(type);
    setFormData(initialFormState[type]);
    setInputKey((k) => k + 1);
  }, []);

  const updateField = useCallback((field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSave = useCallback(async () => {
    if (!qrString) return;
    await saveHistory({
      id: generateId(),
      type: selectedType,
      data: formData,
      rawString: qrString,
      createdAt: new Date().toISOString(),
      isGenerated: true,
    });
  }, [qrString, selectedType, formData]);

  const nextChunk = useCallback(() => {
    setCurrentIndex((prev) => {
      if (chunks.length === 0) return 0;
      return prev >= chunks.length - 1 ? 0 : prev + 1;
    });
  }, [chunks.length]);

  const prevChunk = useCallback(() => {
    setCurrentIndex((prev) => {
      if (chunks.length === 0) return 0;
      return prev <= 0 ? chunks.length - 1 : prev - 1;
    });
  }, [chunks.length]);

  const resetPlayback = useCallback(() => {
    setIsPlaying(false);
    setCurrentIndex(0);
  }, []);

  const goToEnd = useCallback(() => {
    setIsPlaying(false);
    if (chunks.length > 0) {
      setCurrentIndex(chunks.length - 1);
    }
  }, [chunks.length]);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  useEffect(() => {
    if (isPlaying && chunks.length > 0) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= chunks.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, autoPlayInterval);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPlaying, autoPlayInterval, chunks.length]);

  useEffect(() => {
    if (chunks.length > 0 && currentIndex >= chunks.length) {
      setCurrentIndex(chunks.length - 1);
    }
  }, [chunks.length, currentIndex]);

  return {
    selectedType,
    formData,
    debouncedFormData,
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
  };
}
