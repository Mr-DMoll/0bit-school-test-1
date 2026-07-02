import apiClient from "@/api/client";
import { endpoints } from "@/api/endpoints";

export interface AnalyticsSummary {
  totalViews: number;
  last14Days: { date: string; count: number }[];
  topPages:   { path: string; count: number }[];
}

export const analyticsService = {
  summary: () =>
    apiClient.get<{ status: string; data: AnalyticsSummary }>(endpoints.analytics.summary),
};
