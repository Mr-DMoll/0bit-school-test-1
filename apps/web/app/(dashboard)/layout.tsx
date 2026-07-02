import DashboardShell from "@/shared/components/layout/DashboardShell";
import { AccentProvider } from "@/shared/components/layout/AccentProvider";
import { AuthGuard } from "@/shared/components/guards/AuthGuard";
import { AuthProvider } from "@/shared/context/AuthContext";
import { ThemeProvider } from "@/shared/context/ThemeContext";
import { fetchSchool } from "@/features/school/fetchSchool";
import { getBrand } from "@/shared/config/branding.config";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const school = await fetchSchool();
  const brand = getBrand(school);

  return (
    <ThemeProvider>
      <AuthProvider>
        <AuthGuard>
          <AccentProvider accentColor={school.accentColor} />
          <DashboardShell brand={brand}>{children}</DashboardShell>
        </AuthGuard>
      </AuthProvider>
    </ThemeProvider>
  );
}
