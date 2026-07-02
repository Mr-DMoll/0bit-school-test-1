import { fetchSchool } from "@/features/school/fetchSchool";
import { AdmissionsPage } from "@/features/school/AdmissionsPage";

export default async function Page() {
  const school = await fetchSchool();
  return <AdmissionsPage school={school} />;
}
