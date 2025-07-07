export interface PurchaseItem {
  label: string;
  value: string;
}

export interface DailyPurchase {
  id: string;
  day: string;
  items: PurchaseItem[];
}

export type WeeklyPurchases = {
  week1: DailyPurchase[];
  week2: DailyPurchase[];
  week3: DailyPurchase[];
  week4: DailyPurchase[];
};
