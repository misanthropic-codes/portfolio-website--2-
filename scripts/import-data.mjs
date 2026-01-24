import { createClient } from 'next-sanity';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env.local manually since we are in a standalone script
const loadEnv = () => {
    try {
        const envPath = path.resolve(process.cwd(), '.env.local');
        if (fs.existsSync(envPath)) {
            const envConfig = fs.readFileSync(envPath, 'utf8');
            envConfig.split('\n').forEach((line) => {
                const [key, value] = line.split('=');
                if (key && value && !process.env[key.trim()]) {
                    process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, ''); // Remove quotes
                }
            });
            console.log('✅ Loaded .env.local');
        } else {
            console.warn('⚠️ .env.local not found, relying on process.env');
        }
    } catch (error) {
        console.error('Error loading .env.local:', error);
    }
};

loadEnv();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
    console.error('❌ Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN in .env.local');
    process.exit(1);
}

const client = createClient({
    projectId,
    dataset,
    apiVersion: '2024-01-01',
    token, // Write token required
    useCdn: false,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_PATH = path.join(process.cwd(), 'data', 'data.json');
const PUBLIC_DIR = path.join(process.cwd(), 'public');

async function uploadImage(imagePath) {
    if (!imagePath) return null;
    
    // Remove leading slash if present to make path relative to public dir
    const relativePath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    const fullPath = path.join(PUBLIC_DIR, relativePath);

    if (!fs.existsSync(fullPath)) {
        console.warn(`⚠️ Image not found: ${fullPath}`);
        return null;
    }

    try {
        const buffer = fs.readFileSync(fullPath);
        const asset = await client.assets.upload('image', buffer, {
            filename: path.basename(imagePath),
        });
        return {
            _type: 'image',
            asset: {
                _type: 'reference',
                _ref: asset._id,
            },
        };
    } catch (error) {
        console.error(`❌ Failed to upload image: ${imagePath}`, error.message);
        return null;
    }
}

async function startImport() {
    console.log('🚀 Starting Data Import...');
    
    if (!fs.existsSync(DATA_PATH)) {
        console.error(`❌ Data file not found at ${DATA_PATH}`);
        process.exit(1);
    }

    const rawData = fs.readFileSync(DATA_PATH, 'utf8');
    const data = JSON.parse(rawData);

    // 1. Import Profile (Bio)
    if (data.bio) {
        console.log('👤 Importing Profile...');
        const profileImage = await uploadImage(data.bio.profileImage);
        
        const profileDoc = {
            _type: 'profile',
            name: data.bio.name,
            title: data.bio.title,
            headline: data.bio.headline,
            summary: data.bio.summary,
            profileImage,
            email: data.bio.email,
            phone: data.bio.phone,
            location: data.bio.location,
            resumeUrl: data.bio.resumeUrl,
            socials: data.bio.socials,
        };
        
        // Use createOrReplace to avoid duplicates if we run this multiple times (using a deterministic ID or just create usually)
        // Since we don't have a unique ID for profile in json, we'll check if one exists or just create new.
        // Better: Fetch existing profile or create. For simplicity, we create.
        // Actually, for singletons like profile, we might want to query first.
        // Let's just create and user can delete old one if needed, or better, use a fixed ID.
        // 'profile' is seemingly a singleton in usage, so let's use a fixed ID.
        await client.createOrReplace({_id: 'profile-singleton', ...profileDoc});
        console.log('✅ Profile imported');
    }

    // 2. Import Skills
    if (data.skills) {
        console.log('🛠️ Importing Skills...');
        for (const skillCat of data.skills) {
            const sanitizedId = skillCat.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            const doc = {
                _type: 'skill',
                _id: `skill-${sanitizedId}`, // Deterministic ID
                category: skillCat.category,
                items: skillCat.items,
            };
            await client.createOrReplace(doc);
        }
        console.log(`✅ ${data.skills.length} Skill categories imported`);
    }

    // 3. Import Education
    if (data.education) {
        console.log('🎓 Importing Education...');
        for (const edu of data.education) {
            const doc = {
                _type: 'education',
                institution: edu.institution,
                degree: edu.degree,
                start: edu.start,
                end: edu.end,
                percentage: edu.percentage,
                location: edu.location,
                description: edu.description,
                activities: edu.activities,
            };
            await client.create(doc);
        }
        console.log(`✅ ${data.education.length} Education entries imported`);
    }

    // 4. Import Experience
    if (data.experience) {
        console.log('💼 Importing Experience...');
        for (const exp of data.experience) {
            const doc = {
                _type: 'experience',
                role: exp.role,
                company: exp.company,
                start: exp.start,
                end: exp.end,
                location: exp.location,
                description: exp.description,
                achievements: exp.achievements,
            };
            await client.create(doc);
        }
        console.log(`✅ ${data.experience.length} Experience entries imported`);
    }

    // 5. Import Projects
    if (data.projects) {
        console.log('🚀 Importing Projects...');
        for (const proj of data.projects) {
            const images = [];
            if (proj.images && proj.images.length > 0) {
                for (const imgPath of proj.images) {
                    const asset = await uploadImage(imgPath);
                    if (asset) images.push(asset);
                }
            }

            const doc = {
                _type: 'project',
                _id: `project-${proj.id}`, // Use existing ID for determinism
                title: proj.title,
                slug: { _type: 'slug', current: proj.id }, // Use ID as slug
                description: proj.description,
                problem: proj.problem,
                solution: proj.solution,
                learnings: proj.learnings,
                future: proj.future,
                tech: proj.tech,
                year: proj.year,
                liveUrl: proj.liveUrl,
                githubUrl: proj.githubUrl,
                featured: proj.featured || false,
                images: images,
            };
            await client.createOrReplace(doc);
        }
        console.log(`✅ ${data.projects.length} Projects imported`);
    }

    console.log('✨ Import completed successfully!');
}

startImport().catch((err) => {
    console.error('❌ Import failed:', err);
    process.exit(1);
});
