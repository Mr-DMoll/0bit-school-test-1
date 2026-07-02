import { AuthProvider } from "@/shared/context/AuthContext";
import { SchoolBrandProvider, type SchoolBrand } from "@/shared/context/SchoolBrandContext";
import { fetchSchool } from "@/features/school/fetchSchool";

// Login must always render, even if the API is slow, cold-starting, or down —
// it's the one page you need to reach *to fix* a backend problem. Branding is
// best-effort here: fall back to a neutral default rather than block the form.
const FALLBACK_BRAND: SchoolBrand = { schoolName: "Admin Portal", accentColor: "#C2542E", logoUrl: "" };

async function getBrand(): Promise<SchoolBrand> {
  try {
    const school = await fetchSchool();
    return { schoolName: school.schoolName, accentColor: school.accentColor, logoUrl: school.logoUrl };
  } catch (err) {
    console.error("⚠️ [login] Failed to fetch school branding, using fallback:", err);
    return FALLBACK_BRAND;
  }
}

export default async function LoginEntryLayout({ children }: { children: React.ReactNode }) {
  const brand = await getBrand();

  return (
    <AuthProvider>
      <SchoolBrandProvider brand={brand}>{children}</SchoolBrandProvider>
    </AuthProvider>
  );
}
