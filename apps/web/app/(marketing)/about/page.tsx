import { fetchSchool } from "@/features/school/fetchSchool";
import { AboutPage } from "@/features/school/AboutPage";

export default async function Page() {
  const school = await fetchSchool();
  return <AboutPage school={school} />;
}
