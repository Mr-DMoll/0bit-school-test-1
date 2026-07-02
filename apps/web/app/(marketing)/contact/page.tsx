import { fetchSchool } from "@/features/school/fetchSchool";
import { ContactPage } from "@/features/school/ContactPage";

export default async function Page() {
  const school = await fetchSchool();
  return <ContactPage school={school} />;
}
