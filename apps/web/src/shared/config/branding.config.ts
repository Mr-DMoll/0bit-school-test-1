import type { SchoolConfig } from "@/features/school/data";

export interface Brand {
  name:      string;
  typeLabel: string;
  tagline:   string;
  logoMark:  string;
  logoUrl:   string;
  year:      number;
}

// Derives dashboard branding from the live School record so the sidebar
// logo always matches whatever was last saved on the admin Site page.
export function getBrand(school: SchoolConfig): Brand {
  const typeLabel = school.type === "primary" ? "Primary School" : "Secondary School";

  // Strip the trailing type words so the bold logo line never repeats what
  // the smaller subtitle line already says (e.g. "Thandeka Secondary School"
  // -> "Thandeka", with "Secondary School" shown underneath instead).
  const shortName = school.schoolName
    .replace(/\s+(Primary|Secondary|High)\s+School$/i, "")
    .trim();

  return {
    name:      shortName,
    typeLabel,
    tagline:   school.motto,
    logoMark:  school.schoolName.charAt(0),
    logoUrl:   school.logoUrl,
    year:      new Date().getFullYear(),
  };
}
