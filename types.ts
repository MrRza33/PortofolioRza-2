
export type SectionType = 'hero' | 'about' | 'experience' | 'skills' | 'projects' | 'blog';

export interface Profile {
  id: string;
  name: string;
  tagline: string;
  bio: string;
  avatar_url: string;
  logo_url?: string; // New field for custom logo
  cv_url: string;
  portfolio_url?: string;
  years_experience?: string; // Editable statistic
  brands_handled?: string;   // Editable statistic
  email: string;
  github: string;
  linkedin: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  type: 'work' | 'education';
}

export interface Skill {
  id: string;
  name: string;
  category: string; // Changed from restricted union type to string for flexibility
  level: number; // 0-100
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string; // Main Thumbnail
  gallery?: string[]; // Array of images for carousel
  tags: string[];
  demo_url?: string;
  repo_url?: string;
  category: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string;
  created_at: string;
  category: string;
  // SEO Fields
  slug?: string;
  meta_title?: string;
  meta_description?: string;
  tags?: string[]; // Array of strings for SEO tags
}

export interface Comment {
  id: string;
  post_id: string;
  user_name: string;
  content: string;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export interface Subscriber {
  id: string;
  email: string;
  created_at: string;
}

export interface UserSession {
  user: {
    email: string;
  } | null;
}
