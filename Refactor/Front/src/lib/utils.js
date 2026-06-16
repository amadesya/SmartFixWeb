import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value, fractionDigits = 0) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

export function formatCompactCurrency(value) {
  if (Math.abs(value) >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)} млн ₽`;
  }
  if (Math.abs(value) >= 1_000) {
    return `${(value / 1_000).toFixed(value >= 10_000 ? 0 : 1)} тыс ₽`;
  }
  return formatCurrency(value, 0);
}
