export type NotificationType = "alert" | "warning" | "info" | "success";

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string; // ISO 8601
  read: boolean;
};
