
export enum CurrencyCode {
  USD = 'USD',
  EUR = 'EUR',
  JPY = 'JPY',
  GBP = 'GBP',
  AUD = 'AUD',
  CAD = 'CAD',
  CHF = 'CHF',
  CNY = 'CNY',
  INR = 'INR',
  SGD = 'SGD',
  BTC = 'BTC',
  ETH = 'ETH'
}

export interface CurrencyOption {
  code: CurrencyCode;
  name: string;
  flag: string;
}

export interface HistoryDataPoint {
  date: string;
  rate: number;
}

export interface ConversionResponse {
  rateText: string; // The raw text answer from Gemini
  calculatedAmount?: string; // Parsed amount if available
  exchangeRate?: string; // Parsed rate if available
  // Update: Make web properties optional to align with @google/genai SDK types
  groundingChunks?: Array<{
    web?: {
      uri?: string;
      title?: string;
    };
  }>;
}

export interface HistoryResponse {
  data: HistoryDataPoint[];
  analysis: string;
  compareData?: HistoryDataPoint[];
  compareAnalysis?: string;
}
