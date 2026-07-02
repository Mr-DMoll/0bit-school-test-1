import type { Metadata } from "next";
import { Fraunces, Public_Sans } from "next/font/google";
import "./globals.css";

const displayFont = Fraunces({ subsets: ["latin"], variable: "--font-display" });
const bodyFont    = Public_Sans({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "School",
  description: "School website",
};

// No AuthProvider/ThemeProvider here — those are dashboard-only concerns
// (login state, dark-mode toggle). The public site never logs in or has a
// theme to flip, so it shouldn't even fire an auth-check request on load.
// They're applied instead in (dashboard)/layout.tsx and admin/layout.tsx.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
