import { createClient } from '@supabase/supabase-js';
import { Profile, Experience, Skill, Project, BlogPost } from '../types';

// Supabase Configuration from User Input
const SUPABASE_URL = 'https://iqxushprpibrpuuzmooj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxeHVzaHBycGlicnB1dXptb29qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1MTQ0ODUsImV4cCI6MjA4MDA5MDQ4NX0.jlSUJ2htQ1G3NYwvQ-UeIhAi3F23WLQK0PnwC1p6-OQ';

const isSupabaseConfigured = SUPABASE_URL && SUPABASE_KEY;

export const supabase = isSupabaseConfigured 
  ? createClient(SUPABASE_URL, SUPABASE_KEY) 
  : null;

// Mock Data for Initial Load (Only used if database is empty)
const MOCK_DATA = {
  profile: {
    id: '1',
    name: 'Alex Pradana',
    tagline: 'Senior Fullstack Engineer & UI Designer',
    bio: 'Saya adalah pengembang web yang berdedikasi dengan spesialisasi dalam membangun pengalaman digital yang luar biasa. Saat ini fokus pada React, TypeScript, dan desain sistem yang scalable. Saya suka memecahkan masalah kompleks dan mengubahnya menjadi antarmuka yang sederhana dan indah.',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=400&h=400',
    logo_url: '', 
    cv_url: '#',
    portfolio_url: '#',
    email: 'alex@example.com',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com'
  },
  experience: [
    { id: '1', role: 'Senior Frontend Engineer', company: 'Tech Unicorn Indonesia', period: '2022 - Sekarang', description: 'Memimpin tim frontend beranggotakan 8 orang, menginisiasi migrasi ke Next.js App Router, dan meningkatkan skor Core Web Vitals sebesar 40%.', type: 'work' },
    { id: '2', role: 'Software Engineer', company: 'Global Digital Agency', period: '2020 - 2022', description: 'Mengembangkan aplikasi web responsif untuk klien internasional. Implementasi design system menggunakan Tailwind CSS dan Storybook.', type: 'work' },
    { id: '3', role: 'Junior Web Developer', company: 'StartUp Studio', period: '2019 - 2020', description: 'Bekerja pada pengembangan fitur backend menggunakan Node.js dan Express, serta integrasi API pihak ketiga.', type: 'work' },
    { id: '4', role: 'Sarjana Teknik Informatika', company: 'Institut Teknologi Bandung', period: '2015 - 2019', description: 'Lulus dengan predikat Cum Laude (GPA 3.8). Ketua Himpunan Mahasiswa Informatika 2018.', type: 'education' },
    { id: '5', role: 'Google Developer Certification', company: 'Google Developers', period: '2023', description: 'Associate Android Developer Certification & Google Cloud Professional Data Engineer.', type: 'education' }
  ],
  skills: [
    { id: '1', name: 'React & Next.js', category: 'frontend', level: 95 },
    { id: '2', name: 'TypeScript', category: 'frontend', level: 90 },
    { id: '3', name: 'Tailwind CSS', category: 'frontend', level: 95 },
    { id: '4', name: 'Framer Motion', category: 'frontend', level: 85 },
    { id: '5', name: 'Node.js', category: 'backend', level: 85 },
    { id: '6', name: 'PostgreSQL', category: 'backend', level: 80 },
    { id: '7', name: 'Supabase', category: 'backend', level: 85 },
    { id: '8', name: 'Docker', category: 'tools', level: 75 },
    { id: '9', name: 'Figma', category: 'tools', level: 85 },
    { id: '10', name: 'Git & CI/CD', category: 'tools', level: 90 },
    { id: '11', name: 'Team Leadership', category: 'soft', level: 85 },
    { id: '12', name: 'Public Speaking', category: 'soft', level: 80 }
  ],
  projects: [
    { id: '1', title: 'E-Commerce Dashboard', description: 'Dashboard analitik real-time untuk platform e-commerce menggunakan Next.js, Tremor, dan Supabase. Fitur visualisasi data penjualan harian dan manajemen inventaris.', image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80', tags: ['React', 'Next.js', 'Supabase'], category: 'Web App', demo_url: '#', repo_url: '#' },
    { id: '2', title: 'Travel Booking App', description: 'Aplikasi mobile cross-platform untuk pemesanan tiket perjalanan dan hotel dengan integrasi payment gateway Midtrans.', image_url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80', tags: ['React Native', 'Node.js', 'Redux'], category: 'Mobile', demo_url: '#', repo_url: '#' },
    { id: '3', title: 'AI Content Generator', description: 'Platform SaaS untuk generate konten marketing, caption sosmed, dan artikel blog menggunakan Google Gemini API.', image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80', tags: ['AI', 'Python', 'FastAPI', 'Gemini'], category: 'AI', demo_url: '#', repo_url: '#' },
    { id: '4', title: 'Health Tracker', description: 'Aplikasi pelacak kesehatan pribadi yang terhubung dengan smartwatch untuk memantau detak jantung dan kualitas tidur.', image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80', tags: ['Flutter', 'Firebase'], category: 'Mobile', demo_url: '#', repo_url: '#' },
    { id: '5', title: 'Finance Management', description: 'Web app manajemen keuangan pribadi dengan fitur budgeting, tracking pengeluaran, dan export laporan bulanan.', image_url: 'https://images.unsplash.com/photo-1554224155-98406856d03f?auto=format&fit=crop&w=800&q=80', tags: ['Vue.js', 'Laravel', 'MySQL'], category: 'Web App', demo_url: '#', repo_url: '#' },
    { id: '6', title: 'Smart Home Hub', description: 'Interface kontrol rumah pintar berbasis IoT untuk mengatur lampu, suhu, dan keamanan rumah secara terpusat.', image_url: 'https://images.unsplash.com/photo-1558002038-109177381792?auto=format&fit=crop&w=800&q=80', tags: ['IoT', 'React', 'MQTT'], category: 'IoT', demo_url: '#', repo_url: '#' }
  ],
  posts: [
    { id: '1', title: 'Membangun Arsitektur Microfrontends', excerpt: 'Panduan lengkap strategi memecah monolith frontend menjadi microfrontends yang scalable dan mudah dipelihara oleh tim besar.', content: 'Lorem ipsum...', cover_image: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=800&q=80', created_at: '2023-10-15', category: 'Engineering' },
    { id: '2', title: 'Masa Depan AI dalam Web Development', excerpt: 'Bagaimana Artificial Intelligence dan LLM mengubah cara kita menulis kode, mendesain antarmuka, dan mengoptimalkan UX.', content: 'Lorem ipsum...', cover_image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80', created_at: '2023-11-20', category: 'AI' },
    { id: '3', title: 'Tutorial React Server Components', excerpt: 'Mendalami konsep Server Components pada React 18 dan Next.js 13+ untuk performa aplikasi yang lebih baik.', content: 'Lorem ipsum...', cover_image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80', created_at: '2024-01-10', category: 'Tutorial' },
    { id: '4', title: 'Optimasi Core Web Vitals 2024', excerpt: 'Tips dan trik terbaru untuk meningkatkan skor INP (Interaction to Next Paint) dan LCP website Anda.', content: 'Lorem ipsum...', cover_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80', created_at: '2024-02-05', category: 'Performance' }
  ]
};

// Generic CRUD implementations
// NOTE: KITA HANYA MENGGUNAKAN SUPABASE. 
// Login hanya berhasil jika kredensial Supabase valid.

export const db = {
  async getProfile(): Promise<Profile> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('profiles').select('*').single();
        if (data) return data;
        // Jika belum ada profile di DB, return MOCK tapi jangan save dulu
      } catch (e) {
        console.warn('Supabase fetch failed', e);
      }
    }
    // Return MOCK_DATA agar tampilan tidak rusak saat pertama kali load
    return MOCK_DATA.profile;
  },

  async updateProfile(profile: Profile): Promise<void> {
    if (!isSupabaseConfigured || !supabase) throw new Error("Database not connected");

    const payload = { ...profile };
    // Remove invalid ID if necessary or ensure it matches DB
    if (payload.id && payload.id.length < 32) delete (payload as any).id;

    const { error } = await supabase.from('profiles').upsert(payload);
    if (error) throw new Error(error.message);
  },

  async getExperiences(): Promise<Experience[]> {
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.from('experiences').select('*').order('period', { ascending: false });
      if (data && data.length > 0) return (data as any[]).map(d => ({...d, type: d.type as 'work'|'education'}));
    }
    return MOCK_DATA.experience as Experience[];
  },

  async saveExperience(item: Experience): Promise<void> {
    if (!isSupabaseConfigured || !supabase) throw new Error("Database not connected");
    const { error } = await supabase.from('experiences').upsert(item);
    if (error) throw new Error(error.message);
  },

  async deleteExperience(id: string): Promise<void> {
    if (!isSupabaseConfigured || !supabase) throw new Error("Database not connected");
    const { error } = await supabase.from('experiences').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },

  async getSkills(): Promise<Skill[]> {
    if (isSupabaseConfigured && supabase) {
        const { data } = await supabase.from('skills').select('*');
        if (data && data.length > 0) return data as any[];
    }
    return MOCK_DATA.skills as Skill[];
  },

  async saveSkill(item: Skill): Promise<void> {
    if (!isSupabaseConfigured || !supabase) throw new Error("Database not connected");
    const { error } = await supabase.from('skills').upsert(item);
    if (error) throw new Error(error.message);
  },

  async deleteSkill(id: string): Promise<void> {
    if (!isSupabaseConfigured || !supabase) throw new Error("Database not connected");
    const { error } = await supabase.from('skills').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },

  async getProjects(): Promise<Project[]> {
    if (isSupabaseConfigured && supabase) {
        const { data } = await supabase.from('projects').select('*');
        if (data && data.length > 0) return data as any[];
    }
    return MOCK_DATA.projects;
  },

  async saveProject(item: Project): Promise<void> {
    if (!isSupabaseConfigured || !supabase) throw new Error("Database not connected");
    const { error } = await supabase.from('projects').upsert(item);
    if (error) throw new Error(error.message);
  },

  async deleteProject(id: string): Promise<void> {
    if (!isSupabaseConfigured || !supabase) throw new Error("Database not connected");
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },

  async getPosts(): Promise<BlogPost[]> {
    if (isSupabaseConfigured && supabase) {
        const { data } = await supabase.from('posts').select('*');
        if (data && data.length > 0) return data as any[];
    }
    return MOCK_DATA.posts;
  },

  async savePost(item: BlogPost): Promise<void> {
    if (!isSupabaseConfigured || !supabase) throw new Error("Database not connected");
    const { error } = await supabase.from('posts').upsert(item);
    if (error) throw new Error(error.message);
  },

  async deletePost(id: string): Promise<void> {
    if (!isSupabaseConfigured || !supabase) throw new Error("Database not connected");
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },

  async uploadFile(file: File, bucket: string = 'portfolio'): Promise<string> {
    if (!isSupabaseConfigured || !supabase) throw new Error("Database not connected");

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload ke Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) {
      console.error("Supabase Storage Upload Error:", uploadError);
      throw new Error(`Upload failed: ${uploadError.message}`); 
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
  },

  async login(email: string, password?: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) {
        console.error("Supabase configuration missing");
        return false;
    }

    if (!password) {
        console.warn("Password required for Supabase login");
        return false;
    }

    // Melakukan login sesungguhnya ke Supabase Auth
    // Ini PENTING agar Row Level Security (RLS) mengizinkan kita melakukan penulisan (INSERT/UPDATE)
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
       console.error("Supabase Login Failed:", error.message);
       throw new Error(error.message);
    }

    return true;
  },

  // Periksa apakah user sudah login sebelumnya (Persistence)
  async getSession() {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data } = await supabase.auth.getSession();
    return data.session;
  },

  // Logout dari Supabase
  async logout() {
    if (!isSupabaseConfigured || !supabase) return;
    await supabase.auth.signOut();
  }
};