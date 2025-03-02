// types/notification.ts
export interface Notification {
  id: string;
  action: string;
  details?: string;
  read: boolean;
  createdAt: Date;
  userId: string;
}