"use client";

import { useState } from "react";
import { stripProtocol } from "@/lib/format";
import type { Project } from "@/lib/types";

/** Real screenshots with a thumbnail strip; the frame links to the live site when there is one. */
export function Showcase({ project }: { project: Project }) {
  const [i, setI] = useState(0);
  const images = project.images;
  const frame = (
    <div className="mock shot">
      <div className="mock-bar"><i /><i /><i /><span>{project.liveUrl ? stripProtocol(project.liveUrl) : project.repo ?? project.title}</span></div>
      {images[i] ? <img src={images[i]} alt={`${project.title} screenshot ${i + 1} of ${images.length}`} /> : <div className="shot-empty mono">{project.title}</div>}
    </div>
  );
  return (
    <div className="showcase rv">
      {project.liveUrl ? <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" data-cursor="Visit ↗" style={{ display: "block" }}>{frame}</a> : frame}
      <div className="cap mono">
        <span>{images.length ? `Screenshot ${i + 1} of ${images.length}` : "No screenshots yet"}</span>
        {images.length > 1 && (
          <span className="thumbs" role="group" aria-label="Screenshots">
            {images.map((src, k) => (
              <button key={src} type="button" aria-pressed={k === i} aria-label={`Show screenshot ${k + 1}`} onClick={() => setI(k)}>
                <img src={src} alt="" loading="lazy" />
              </button>
            ))}
          </span>
        )}
      </div>
    </div>
  );
}
