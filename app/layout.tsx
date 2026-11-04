import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { getEducation, getExperience, getProfile, getProjects, getSkills } from "@/lib/api";
import { buildFacts } from "@/lib/search";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CommandPalette } from "@/components/site/CommandPalette";
import { Cursor } from "@/components/site/Cursor";
import { Effects } from "@/components/site/Effects";
import { THEME_SCRIPT } from "@/components/site/client-utils";

const sans = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

const SITE = "https://www.misanthropic.codes";
const DESCRIPTION = "Abhishek Kumar is a full-stack developer building SaaS platforms and AI fintech products, end to end.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: "Abhishek Kumar · Full-stack developer", template: "%s · Abhishek Kumar" },
  description: DESCRIPTION,
  authors: [{ name: "Abhishek Kumar" }],
  openGraph: { type: "website", locale: "en_US", url: SITE, siteName: "Abhishek Kumar", title: "Abhishek Kumar · Full-stack developer", description: DESCRIPTION },
  twitter: { card: "summary_large_image", creator: "@airabhishek098", title: "Abhishek Kumar · Full-stack developer", description: DESCRIPTION },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#09090B" }, { media: "(prefers-color-scheme: light)", color: "#FAFAFA" }],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [profile, projects, experience, education, skills] = await Promise.all([
    getProfile(), getProjects(), getExperience(), getEducation(), getSkills(),
  ]);
  const facts = buildFacts({ profile, projects, experience, education, skills });

  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <Header name={profile.name} />
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
