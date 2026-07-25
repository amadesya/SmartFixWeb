export interface ClientBonus {
  discountPercent: number;
  accumulatedBonuses: number;
  tier: 'Bronze' | 'Silver' | 'Gold';
}

export interface ClientHistoryItem {
  id: string;
  date: string;
  device: string;
  problem: string;
  status: 'completed' | 'in_progress' | 'cancelled';
  cost: number;
}

export interface ClientDetails {
  id: string;
  name: string;
  phone: string;
  email?: string;
  registeredAt: string;
  loyalty: ClientBonus;
  history: ClientHistoryItem[];
}