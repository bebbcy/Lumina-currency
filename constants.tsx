import React from 'react';
import { CurrencyCode, CurrencyOption } from './types';

export const CURRENCIES: CurrencyOption[] = [
  { code: CurrencyCode.USD, name: 'US Dollar', flag: '🇺🇸' },
  { code: CurrencyCode.EUR, name: 'Euro', flag: '🇪🇺' },
  { code: CurrencyCode.GBP, name: 'British Pound', flag: '🇬🇧' },
  { code: CurrencyCode.JPY, name: 'Japanese Yen', flag: '🇯🇵' },
  { code: CurrencyCode.AUD, name: 'Australian Dollar', flag: '🇦🇺' },
  { code: CurrencyCode.CAD, name: 'Canadian Dollar', flag: '🇨🇦' },
  { code: CurrencyCode.CHF, name: 'Swiss Franc', flag: '🇨🇭' },
  { code: CurrencyCode.CNY, name: 'Chinese Yuan', flag: '🇨🇳' },
  { code: CurrencyCode.INR, name: 'Indian Rupee', flag: '🇮🇳' },
  { code: CurrencyCode.SGD, name: 'Singapore Dollar', flag: '🇸🇬' },
  { code: CurrencyCode.BTC, name: 'Bitcoin', flag: '₿' },
  { code: CurrencyCode.ETH, name: 'Ethereum', flag: 'Ξ' },
];

export const MOCK_HISTORY = [
  { date: '2023-01-01', rate: 1.05 },
  { date: '2023-01-02', rate: 1.06 },
  { date: '2023-01-03', rate: 1.04 },
];
