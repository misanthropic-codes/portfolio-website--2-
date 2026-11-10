import { ImageResponse } from "next/og";

export const alt = "Abhishek Kumar, freelance full-stack developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default link preview for every page that doesn't set its own. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 80, background: "#09090B", color: "#FAFAFA", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", fontSize: 28, color: "#A1A1AA" }}>misanthropic.codes</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 700, lineHeight: 1.05 }}>Abhishek Kumar</div>
          <div style={{ display: "flex", fontSize: 40, color: "#D4D4D8" }}>Freelance full-stack developer</div>
          <div style={{ display: "flex", fontSize: 30, color: "#A1A1AA" }}>Web apps · Mobile apps · Backends · Payments</div>
        </div>
        <div style={{ display: "flex", alignSelf: "flex-start", fontSize: 28, padding: "14px 28px", borderRadius: 999, background: "#FAFAFA", color: "#09090B" }}>Available for projects</div>
      </div>
    ),
    size,
  );
}
