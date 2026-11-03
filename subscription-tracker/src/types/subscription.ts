export type Subscription = {
  id: string;
  name: string;
  price: number;
  currency: string;
  dueDate: string;
  category: string;
  paid: boolean;
  notificationId?: string;
};

export const isValidDate = (value: string) => {
  const date = new Date(`${value}T12:00:00`);
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(date.getTime());
};

export const formatDate = (value: string) => {
  const [year, month, day] = value.split("-");
  return `${day}.${month}.${year}`;
};

export const daysUntil = (dueDate: string) => {
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const due = new Date(`${dueDate}T12:00:00`);
  return Math.ceil((due.getTime() - today.getTime()) / 86_400_000);
};

export const formatPrice = (price: number, currency: string) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: currency || "TRY",
  }).format(price);
