import { fetchSchool } from "@/features/school/fetchSchool";
import { StudentLifePage } from "@/features/school/StudentLifePage";

export default async function Page() {
  const school = await fetchSchool();
  return <StudentLifePage school={school} />;
}
