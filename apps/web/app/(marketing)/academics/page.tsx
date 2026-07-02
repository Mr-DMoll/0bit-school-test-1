import { fetchSchool } from "@/features/school/fetchSchool";
import { AcademicsPage } from "@/features/school/AcademicsPage";

export default async function Page() {
  const school = await fetchSchool();
  return <AcademicsPage school={school} />;
}
