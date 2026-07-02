import { fetchSchool, fetchHasBlog } from "@/features/school/fetchSchool";
import { Nav, Footer } from "@/features/school/Shared";
import { PageViewTracker } from "@/features/school/PageViewTracker";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const [school, showBlog] = await Promise.all([fetchSchool(), fetchHasBlog()]);
  return (
    <div className="school-site min-h-screen flex flex-col">
      <PageViewTracker />
      <Nav school={school} showBlog={showBlog} />
      <main className="flex-1">{children}</main>
      <Footer school={school} />
    </div>
  );
}
