import { useState, useEffect, useMemo, useCallback } from "react";
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

export interface UseQRGeneratorReturn {
  selectedType: QRType;
  formData: Record<string, string>;
  debouncedFormData: Record<string, string>;
  qrString: string;
  inputKey: number;
  updateField: (field: string, value: string) => void;
  handleTypeSelect: (type: QRType) => void;
  handleSave: () => Promise<void>;
}

export function useQRGenerator(): UseQRGeneratorReturn {
  const [selectedType, setSelectedType] = useState<QRType>("TEXT");
  const [formData, setFormData] = useState<Record<string, string>>(initialFormState.TEXT);
  const [inputKey, setInputKey] = useState(0);

  const debouncedFormData = useDebouncedValue(formData, 300);

  const qrString = useMemo(() => {
    return generateQRString(selectedType, debouncedFormData);
  }, [selectedType, debouncedFormData]);

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

  return {
    selectedType,
    formData,
    debouncedFormData,
    qrString,
    inputKey,
    updateField,
    handleTypeSelect,
    handleSave,
  };
}