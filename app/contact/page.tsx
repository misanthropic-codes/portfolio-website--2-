import type { Metadata } from "next";
import { getProfile, getServices } from "@/lib/api";
import { stripProtocol } from "@/lib/format";
import { BigEmail, BriefBuilder, MessageForm, RanchiSky } from "@/components/contact/ContactWidgets";
import { CopyButton } from "@/components/site/CopyButton";

export const revalidate = 300;
export const metadata: Metadata = { title: "Contact", description: "Start a project or send a message." };

const ext = <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M4 2h6v6M10 2 3 9" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>;

export default async function ContactPage() {
  const [profile, services] = await Promise.all([getProfile(), getServices()]);
  const channels = [
    ["GitHub", profile.socials.github],
    ["LinkedIn", profile.socials.linkedin],
    ["X", profile.socials.twitter],
  ].filter(([, v]) => v) as [string, string][];

  return (
    <section className="page wrap">
      <div className="ct-hero">
        <span className="label">Contact</span>
        <h1 className="ct-h">Let&apos;s build <span className="grad-t">something.</span></h1>
        {profile.email && <BigEmail email={profile.email} />}
      </div>
      <div className="ct-grid">
        <div className="chans">
          {profile.email && (
            <CopyButton className="chan" text={profile.email} done="Email copied">
              <span className="mono">01</span><b>Email</b><span className="chan-h">{profile.email}</span><span className="chan-a">Copy</span>
            </CopyButton>
          )}
          {channels.map(([label, href], i) => (
            <a key={label} className="chan" href={href} target="_blank" rel="noopener noreferrer">
              <span className="mono">{String(i + 2).padStart(2, "0")}</span><b>{label}</b><span className="chan-h">{stripProtocol(href).split("/").pop()}</span><span className="chan-a">{ext}</span>
            </a>
          ))}
        </div>
        <RanchiSky />
      </div>
      <div className="sec">
        <div className="sec-head rv"><div><span className="label">Start a project</span><h2>Write your brief in four steps</h2><p>Your brief is written as you go. Send it and it lands straight in my inbox.</p></div></div>
        <BriefBuilder services={services} />
      </div>
      <div className="sec" style={{ paddingBottom: 96 }}>
        <MessageForm />
      </div>
    </section>
  );
}
