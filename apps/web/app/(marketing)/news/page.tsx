import { fetchSchool } from "@/features/school/fetchSchool";
import { NewsPage } from "@/features/school/NewsPage";

export default async function Page() {
  const school = await fetchSchool();
  return <NewsPage school={school} />;
}
