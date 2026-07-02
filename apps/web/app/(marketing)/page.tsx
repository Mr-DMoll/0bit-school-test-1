import { fetchSchool } from "@/features/school/fetchSchool";
import { HomePage } from "@/features/school/HomePage";

export default async function Page() {
  const school = await fetchSchool();
  return <HomePage school={school} />;
}
