import type { Currency } from './types';
import { conversionRates } from './constants';

export const formatCurrency = (amount: number, currency: Currency): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const convertAmount = (amount: number, from: Currency['code'], to: Currency['code']): number => {
    if (from === to) {
        return amount;
    }
    return amount * (conversionRates[from][to] || 1);
};
