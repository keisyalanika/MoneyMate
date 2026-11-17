import { apiRequest } from "@/lib/api";
import type { AdminNotification, NotificationType } from "@/types";

interface BackendCampaign {
  id: number;
  title: string;
  message?: string;
  type?: string;
  audience?: string;
  recipient_count?: number;
  created_at?: string;
}

function toAdminNotification(campaign: BackendCampaign): AdminNotification {
  const sentAt = campaign.created_at
    ? new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(campaign.created_at))
    : "-";

  return {
    id: campaign.id,
    title: campaign.title,
    message: campaign.message ?? "",
    audience: campaign.audience || "Semua pengguna",
    type: (campaign.type as NotificationType) || "Info",
    sentAt,
  };
}

export const notificationService = {
  async list(query: { search?: string; type?: string } = {}): Promise<AdminNotification[]> {
    const campaigns = await apiRequest<BackendCampaign[]>("admin/notifications");
    const term = (query.search ?? "").trim().toLowerCase();

    return campaigns.map(toAdminNotification).filter((item) => {
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
    const campaign = await apiRequest<BackendCampaign>("admin/notifications", {
      method: "POST",
      body: JSON.stringify(input),
    });
    return toAdminNotification(campaign);
  },

  async remove(id: number): Promise<void> {
    await apiRequest(`admin/notifications/${id}`, { method: "DELETE" });
  },
};
