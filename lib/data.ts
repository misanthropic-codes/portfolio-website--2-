import { client } from "./sanity";
import data from "@/data/data.json";

export async function getProfile() {
  try {
    const query = `*[_type == "profile"][0]{
      name,
      title,
      headline,
      summary,
      "profileImage": profileImage.asset->url,
      email,
      phone,
      location,
      resumeUrl,
      socials
    }`;
    const profile = await client.fetch(query);
    return profile || data.bio;
  } catch (error) {
    console.error("Sanity fetch failed:", error);
    return data.bio;
  }
}

export async function getProjects() {
  try {
    const query = `*[_type == "project"] | order(year desc) {
      ...,
      "id": slug.current,
      "images": images[].asset->url
    }`;
    const projects = await client.fetch(query);
    return projects.length > 0 ? projects : data.projects;
  } catch (error) {
    console.warn("Sanity fetch failed:", error);
    return data.projects;
  }
}

export async function getProject(id: string) {
  try {
    const query = `*[_type == "project" && slug.current == $id][0] {
      ...,
      "id": slug.current,
      "images": images[].asset->url
    }`;
    const project = await client.fetch(query, { id });
    return project || data.projects.find((p) => p.id === id);
  } catch (error) {
    console.warn("Sanity fetch failed:", error);
    return data.projects.find((p) => p.id === id);
  }
}

export async function getSkills() {
  try {
    const query = `*[_type == "skill"]`;
    const skills = await client.fetch(query);
    return skills.length > 0 ? skills : data.skills;
  } catch (error) {
    console.warn("Sanity fetch failed:", error);
    return data.skills;
  }
}

export async function getExperience() {
  try {
    const query = `*[_type == "experience"] | order(start desc)`;
    const experience = await client.fetch(query);
    return experience.length > 0 ? experience : data.experience;
  } catch (error) {
    console.warn("Sanity fetch failed:", error);
    return data.experience;
  }
}

export async function getEducation() {
  try {
    const query = `*[_type == "education"] | order(start desc)`;
    const education = await client.fetch(query);
    return education.length > 0 ? education : data.education;
  } catch (error) {
    console.warn("Sanity fetch failed:", error);
    return data.education;
  }
}
