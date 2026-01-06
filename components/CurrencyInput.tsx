import React from 'react';
import { CURRENCIES } from '../constants';
import { CurrencyCode } from '../types';
import { ChevronDown } from 'lucide-react';

interface CurrencyInputProps {
  label: string;
  amount?: number;
  currency: CurrencyCode;
  onAmountChange?: (val: number) => void;
  onCurrencyChange: (val: CurrencyCode) => void;
  readOnlyAmount?: boolean;
  hideAmount?: boolean;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  label,
  amount,
  currency,
  onAmountChange,
  onCurrencyChange,
  readOnlyAmount = false,
  hideAmount = false,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent non-numeric keys that are technically allowed in type="number"
    // but not desired for currency (like 'e' for scientific notation, and '-' for negative)
    if (['-', 'e', 'E'].includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onAmountChange) return;

    const val = e.target.value;

    // Handle empty input by defaulting to 0
    if (val === '') {
      onAmountChange(0);
      return;
    }

    const num = parseFloat(val);

    // Validate and update if it's a number
    if (!isNaN(num)) {
      // Ensure the value is positive (handle edge cases like paste)
      onAmountChange(Math.abs(num));
    }
  };

  return (
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 transition-all focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-transparent">
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
        {label}
      </label>
      <div className="flex items-center space-x-4">
        {!hideAmount && !readOnlyAmount && (
          <input
            type="number"
            min="0"
            step="any"
            value={amount === undefined ? '' : amount}
            onKeyDown={handleKeyDown}
            onChange={handleChange}
            className="flex-1 bg-transparent text-3xl font-bold text-slate-800 focus:outline-none placeholder-slate-300 w-full"
            placeholder="0.00"
          />
        )}
        {!hideAmount && readOnlyAmount && (
           <div className="flex-1 text-3xl font-bold text-slate-400">
             {amount !== undefined && amount !== null ? amount.toFixed(2) : '--'}
           </div>
        )}
        
        <div className={`relative group ${hideAmount ? 'flex-1' : ''}`}>
          <select
            value={currency}
            onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
            className={`appearance-none bg-white pl-3 pr-10 py-2 rounded-lg border border-slate-200 shadow-sm text-lg font-medium text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-300 transition-colors ${hideAmount ? 'w-full' : ''}`}
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.code}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500">
            <ChevronDown size={16} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyInput;