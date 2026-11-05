import type { Metadata } from "next";
import { getProjects } from "@/lib/api";
import { allTech } from "@/lib/stack";
import { WorkGrid } from "@/components/work/WorkGrid";

export const revalidate = 300;
export const metadata: Metadata = { title: "Work", description: "Products across recruitment, fintech, networking, commerce and publishing." };

export default async function WorkPage() {
  const projects = await getProjects();
  return (
    <section className="page wrap">
      <div className="page-head rv">
        <span className="label">Work</span>
        <h1>Projects</h1>
        <p>{projects.length} products. Filter by stack, or switch to the list for a quick scan.</p>
      </div>
      <WorkGrid projects={projects} tech={allTech(projects)} />
      <div style={{ height: 96 }} />
    </section>
  );
}
