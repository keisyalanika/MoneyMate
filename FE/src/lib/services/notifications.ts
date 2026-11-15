import { notifications as seedNotifications } from "@/lib/mock";
import type { AdminNotification, NotificationType } from "@/types";

const delay = (ms = 240) => new Promise((resolve) => setTimeout(resolve, ms));

let data: AdminNotification[] = [...seedNotifications];

export const notificationService = {
  async list(query: { search?: string; type?: string } = {}): Promise<AdminNotification[]> {
    await delay();
    const term = (query.search ?? "").trim().toLowerCase();
    return data.filter((item) => {
      const matchTerm =
        !term ||
        item.title.toLowerCase().includes(term) ||
        item.message.toLowerCase().includes(term);
      const matchType = !query.type || query.type === "all" || item.type === query.type;
      return matchTerm && matchType;
    });
  },

  async send(input: {
    audience: string;
    title: string;
    message: string;
    type: NotificationType;
  }): Promise<AdminNotification> {
    await delay(320);
    const created: AdminNotification = {
      id: Date.now(),
      title: input.title,
      message: input.message,
      audience: input.audience,
      type: input.type,
      sentAt: new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date()),
    };
    data = [created, ...data];
    return created;
  },

  async remove(id: number): Promise<void> {
    await delay(200);
    data = data.filter((item) => item.id !== id);
  },
};
