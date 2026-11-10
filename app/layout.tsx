import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { getEducation, getExperience, getProfile, getProjects, getServices, getSkills } from "@/lib/api";
import { SITE, SITE_DESCRIPTION, SITE_TITLE } from "@/lib/site";
import { structuredData } from "@/lib/structured-data";
import { buildFacts } from "@/lib/search";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CommandPalette } from "@/components/site/CommandPalette";
import { Cursor } from "@/components/site/Cursor";
import { Effects } from "@/components/site/Effects";
import { THEME_SCRIPT } from "@/components/site/client-utils";

const sans = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

const DESCRIPTION = SITE_DESCRIPTION;
const TITLE = SITE_TITLE;

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: TITLE, template: "%s · Abhishek Kumar" },
  description: DESCRIPTION,
  authors: [{ name: "Abhishek Kumar" }],
  openGraph: { type: "website", locale: "en_US", url: SITE, siteName: "Abhishek Kumar", title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary_large_image", creator: "@airabhishek098", title: TITLE, description: DESCRIPTION },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#09090B" }, { media: "(prefers-color-scheme: light)", color: "#FAFAFA" }],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [profile, projects, experience, education, skills, services] = await Promise.all([
    getProfile(), getProjects(), getExperience(), getEducation(), getSkills(), getServices(),
  ]);
  const facts = buildFacts({ profile, projects, experience, education, skills });

  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData(profile, services) }} />
      </head>
      <body>
        <Header name={profile.name} photo={profile.profileImage} />
        <main id="app">{children}</main>
        <Footer profile={profile} />
        <CommandPalette
          facts={facts}
          projects={projects.map((p) => ({ id: p.id, title: p.title, year: p.year }))}
          email={profile.email}
          github={profile.socials.github ?? null}
          linkedin={profile.socials.linkedin ?? null}
        />
        <Cursor />
        <Effects />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
