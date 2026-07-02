import apiClient from "@/api/client";
import { endpoints } from "@/api/endpoints";

export interface TeamMember {
  id:            string;
  email:         string;
  role:          "ADMIN" | "MANAGER";
  accountStatus: "PENDING" | "ACTIVE" | "SUSPENDED" | "DELETED";
  firstName:     string | null;
  lastName:      string | null;
  displayName:   string | null;
  lastActiveAt:  string | null;
  createdAt:     string;
}

export interface InvitePayload {
  email:     string;
  firstName?: string;
  lastName?:  string;
  role:      "ADMIN" | "MANAGER";
}

export const teamService = {
  list: () =>
    apiClient.get<{ status: string; data: { members: TeamMember[] } }>(endpoints.team.list),

  invite: (payload: InvitePayload) =>
    apiClient.post<{ status: string; data: { member: TeamMember } }>(endpoints.team.invite, payload),

  remove: (id: string) =>
    apiClient.delete(endpoints.team.remove(id)),
};
