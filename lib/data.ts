const API_BASE_URL = "https://api.misanthropic.codes/api";
import data from "@/data/data.json";

async function fetchAPI(endpoint: string) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      next: { revalidate: 60 },
    }); // 60s cache
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
  return profile || data.bio;
}

export async function getProjects() {
  const projects = await fetchAPI("/projects");
  return projects || data.projects;
}

export async function getProject(slug: string) {
  const project = await fetchAPI(`/projects/${slug}`);
  return project || data.projects.find((p) => p.id === slug);
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
