import apiClient from "@/api/client";
import { endpoints } from "@/api/endpoints";

export interface Post {
  id:        string;
  type:      "NEWS" | "BLOG";
  title:     string;
  slug:      string;
  date:      string;
  category:  string | null;
  excerpt:   string;
  body:      string | null;
  image:     string | null;
  published: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export const postService = {
  list: (type?: "NEWS" | "BLOG") =>
    apiClient.get<{ status: string; data: { posts: Post[] } }>(endpoints.posts.list, { params: type ? { type } : undefined }),

  create: (payload: Partial<Post>) =>
    apiClient.post<{ status: string; data: { post: Post } }>(endpoints.posts.create, payload),

  update: (id: string, payload: Partial<Post>) =>
    apiClient.patch<{ status: string; data: { post: Post } }>(endpoints.posts.update(id), payload),

  delete: (id: string) =>
    apiClient.delete(endpoints.posts.delete(id)),
};
