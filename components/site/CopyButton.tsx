"use client";

import { copyText } from "./client-utils";

export function CopyButton({ text, done = "Copied", className, children }: { text: string; done?: string; className?: string; children: React.ReactNode }) {
  return <button type="button" className={className} onClick={() => copyText(text, done)}>{children}</button>;
}
