export type QRType = "TEXT" | "URL" | "WIFI" | "VCARD";

export interface QRData {
  id: string;
  type: QRType;
  data: Record<string, string>;
  rawString: string;
  createdAt: string;
  isGenerated: boolean;
}

export interface WifiData {
  ssid: string;
  password: string;
  security: "WPA" | "WEP" | "nopass";
}

export interface VCardData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

type ParserFactory = {
  [K in QRType]: (data: Record<string, string>) => string;
};

export const generateQRString = (type: QRType, data: Record<string, string>): string => {
  const parsers: ParserFactory = {
    TEXT: (d) => d.text || "",
    URL: (d) => d.url || "",
    WIFI: (d) => {
      const security = d.security || "nopass";
      const ssid = d.ssid || "";
      const password = d.password || "";
      return `WIFI:T:${security};S:${ssid};P:${password};;`;
    },
    VCARD: (d) => {
      const firstName = d.firstName || "";
      const lastName = d.lastName || "";
      const phone = d.phone || "";
      const email = d.email || "";
      return `BEGIN:VCARD\nVERSION:3.0\nFN:${firstName} ${lastName}\nTEL:${phone}\nEMAIL:${email}\nEND:VCARD`;
    },
  };
  return parsers[type](data);
};

export const getTypeIcon = (type: QRType): string => {
  const icons: Record<QRType, string> = {
    TEXT: "📝",
    URL: "🌐",
    WIFI: "📶",
    VCARD: "👤",
  };
  return icons[type];
};

export const getTypeLabel = (type: QRType): string => {
  const labels: Record<QRType, string> = {
    TEXT: "Text",
    URL: "URL",
    WIFI: "Wi-Fi",
    VCARD: "vCard",
  };
  return labels[type];
};

export const qrTypes: QRType[] = ["TEXT", "URL", "WIFI", "VCARD"];