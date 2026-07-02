import apiClient from "@/api/client";
import { endpoints } from "@/api/endpoints";

export interface AuditLogEntry {
  id:        string;
  action:    string;
  meta:      { path?: string; method?: string; status?: number } | null;
  ip:        string | null;
  userAgent: string | null;
  createdAt: string;
  user: {
    email:       string;
    firstName:   string | null;
    lastName:    string | null;
    displayName: string | null;
  };
}

export const auditService = {
  list: () =>
    apiClient.get<{ status: string; data: { logs: AuditLogEntry[] } }>(endpoints.audit.list),
};
