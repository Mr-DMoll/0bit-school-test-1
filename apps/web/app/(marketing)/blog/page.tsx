import { fetchSchool, fetchBlogPosts } from "@/features/school/fetchSchool";
import { BlogPage } from "@/features/school/BlogPage";

export default async function Page() {
  const [school, posts] = await Promise.all([fetchSchool(), fetchBlogPosts()]);
  return <BlogPage school={school} posts={posts} />;
}
