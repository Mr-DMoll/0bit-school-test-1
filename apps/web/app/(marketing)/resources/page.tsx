import { fetchSchool } from "@/features/school/fetchSchool";
import { ResourcesPage } from "@/features/school/ResourcesPage";

export default async function Page() {
  const school = await fetchSchool();
  return <ResourcesPage school={school} />;
}
