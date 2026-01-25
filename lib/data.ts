const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
import data from "@/data/data.json";

async function fetchAPI(endpoint: string) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      next: { revalidate: 0 }, // Disable cache for dev
    });
    if (!res.ok) throw new Error("Failed to fetch data");
    const json = await res.json();
    if (!json.success) throw new Error(json.message || "API error");
    return json.data;
  } catch (error) {
    console.error(`API fetch failed for ${endpoint}:`, error);
    return null;
  }
}

export async function getProfile() {
  const profile = await fetchAPI("/profile");
  if (!profile) return data.bio;
  
  // Transform API profile to match frontend expected format
  return {
    name: profile.name,
    pronouns: profile.pronouns,
    title: profile.title,
    location: profile.location,
    email: profile.email,
    phone: profile.phone,
    headline: profile.headline,
    summary: profile.summary,
    profileImage: profile.profile_image || "/profile.jpg",
    resumeUrl: profile.resume_url,
    socials: profile.socials || {},
  };
}

export async function getProjects() {
  const projects = await fetchAPI("/projects");
  if (!projects) return data.projects;
  
  // Transform API projects to match frontend expected format
  return projects.map((project: any) => ({
    id: project.slug || project.id,
    title: project.title,
    year: project.year,
    tech: project.tech || [],
    description: project.description,
    images: project.images || [],
    featured: project.featured,
    liveUrl: project.live_url,
    githubUrl: project.github_url,
  }));
}

export async function getProject(slug: string) {
  const project = await fetchAPI(`/projects/${slug}`);
  
  if (!project) {
    // Fallback to local data if API fails or project not found
    return data.projects.find((p) => p.id === slug);
  }
  
  return {
    id: project.slug || project.id,
    title: project.title,
    year: project.year,
    tech: project.tech || [],
    description: project.description,
    images: project.images || [],
    featured: project.featured,
    liveUrl: project.live_url,
    githubUrl: project.github_url,
  };
}

export async function getSkills() {
  const skills = await fetchAPI("/skills");
  // Ensure we fallback if API returns empty array or null, but API should return list
  return skills?.length ? skills : data.skills;
}

export async function getExperience() {
  const experience = await fetchAPI("/experience");
  return experience?.length ? experience : data.experience;
}

export async function getEducation() {
  const education = await fetchAPI("/education");
  return education?.length ? education : data.education;
}

export async function getServices() {
  const services = await fetchAPI("/services");
  return services || [];
}

export async function getService(slug: string) {
  const service = await fetchAPI(`/services/${slug}`);
  return service || null;
}

export async function getServicePrice(slug: string) {
  const data = await fetchAPI(`/services/${slug}/price`);
  return data || null;
}

export async function submitQuotation(data: any) {
  try {
    const res = await fetch(`${API_BASE_URL}/quotations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    return json;
  } catch (error) {
    console.error("Failed to submit quotation:", error);
    return { success: false, message: "Network error" };
  }
}

export async function submitContact(data: any) {
  try {
    const res = await fetch(`${API_BASE_URL}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    return json;
  } catch (error) {
    console.error("Failed to submit message:", error);
    return { success: false, message: "Network error" };
  }
}
