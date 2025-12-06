
import { createClient } from '@supabase/supabase-js';
import { Profile, Experience, Skill, Project, BlogPost, Comment, ContactMessage, Subscriber } from '../types';

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
    id: 'd9b2d63d-a1f2-4f3b-b6c8-e2f4a5b6c7d8',
    name: 'Alex Pradana',
    tagline: 'Digital Marketer & Creative Generalist',
    bio: 'Saya membantu brand bertumbuh melalui strategi digital yang terukur dan visual yang memikat. Sebagai seorang Creative Generalist dengan dasar teknis WordPress, saya menjembatani kesenjangan antara desain yang estetis, konten yang engaging, dan performa website yang optimal.',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=400&h=400',
    logo_url: '', 
    cv_url: '#',
    portfolio_url: '#',
    years_experience: '4+',
    brands_handled: '20+',
    email: 'alex@example.com',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com'
  },
  experience: [
    { id: 'e1b2d63d-a1f2-4f3b-b6c8-e2f4a5b6c7d1', role: 'Digital Marketing Lead', company: 'Growth Agency Indonesia', period: '2022 - Sekarang', description: 'Mengelola budget iklan bulanan IDR 100jt+ untuk klien lintas industri. Meningkatkan ROAS (Return on Ad Spend) rata-rata sebesar 300% melalui optimasi Meta Ads dan Google Ads.', type: 'work' },
    { id: 'e1b2d63d-a1f2-4f3b-b6c8-e2f4a5b6c7d2', role: 'Content Specialist & Web Admin', company: 'Creative Studio', period: '2020 - 2022', description: 'Bertanggung jawab atas strategi konten media sosial dan maintenance website klien berbasis WordPress. Berhasil menaikkan organic traffic website sebesar 150% dalam 1 tahun.', type: 'work' },
    { id: 'e1b2d63d-a1f2-4f3b-b6c8-e2f4a5b6c7d3', role: 'Freelance WordPress Developer', company: 'Self Employed', period: '2019 - 2020', description: 'Membangun landing page dan company profile untuk UMKM menggunakan Elementor dan kustomisasi CSS ringan.', type: 'work' },
    { id: 'e1b2d63d-a1f2-4f3b-b6c8-e2f4a5b6c7d4', role: 'S1 Ilmu Komunikasi', company: 'Universitas Indonesia', period: '2015 - 2019', description: 'Fokus studi pada Periklanan dan Hubungan Masyarakat. Lulus dengan predikat Cum Laude.', type: 'education' },
    { id: 'e1b2d63d-a1f2-4f3b-b6c8-e2f4a5b6c7d5', role: 'Google Ads & Analytics Certified', company: 'Google Skillshop', period: '2023', description: 'Sertifikasi profesional untuk Search, Display, dan Google Analytics 4 (GA4).', type: 'education' }
  ],
  skills: [
    // Marketing
    { id: 's1b2d63d-a1f2-4f3b-b6c8-e2f4a5b6c7d1', name: 'SEO & SEM', category: 'Marketing', level: 90 },
    { id: 's1b2d63d-a1f2-4f3b-b6c8-e2f4a5b6c7d2', name: 'Meta Ads (FB/IG)', category: 'Marketing', level: 95 },
    { id: 's1b2d63d-a1f2-4f3b-b6c8-e2f4a5b6c7d3', name: 'Google Analytics 4', category: 'Marketing', level: 85 },
    { id: 's1b2d63d-a1f2-4f3b-b6c8-e2f4a5b6c7d4', name: 'Copywriting', category: 'Marketing', level: 90 },
    // Creative / Tools
    { id: 's1b2d63d-a1f2-4f3b-b6c8-e2f4a5b6c7d9', name: 'Canva & Photoshop', category: 'Creative', level: 85 },
    { id: 's1b2d63d-a1f2-4f3b-b6c8-e2f4a5b6c7d0', name: 'Video Editing (CapCut/Premiere)', category: 'Creative', level: 80 },
    // Tech / Web
    { id: 's1b2d63d-a1f2-4f3b-b6c8-e2f4a5b6c7d5', name: 'WordPress', category: 'Web Dev', level: 90 },
    { id: 's1b2d63d-a1f2-4f3b-b6c8-e2f4a5b6c7d6', name: 'Elementor Pro', category: 'Web Dev', level: 95 },
    { id: 's1b2d63d-a1f2-4f3b-b6c8-e2f4a5b6c7d7', name: 'HTML/CSS Basic', category: 'Web Dev', level: 75 },
    // Soft Skills
    { id: 's1b2d63d-a1f2-4f3b-b6c8-e2f4a5b6c7da', name: 'Strategic Planning', category: 'Soft Skills', level: 85 },
    { id: 's1b2d63d-a1f2-4f3b-b6c8-e2f4a5b6c7db', name: 'Client Management', category: 'Soft Skills', level: 90 }
  ],
  projects: [
    { 
      id: 'p1b2d63d-a1f2-4f3b-b6c8-e2f4a5b6c7d1', 
      title: 'Growth Marketing UMKM Fashion', 
      description: 'Kampanye digital 360 derajat untuk brand fashion lokal. Kombinasi SEO on-page, strategi konten Instagram Reels, dan Meta Ads conversion. Menghasilkan kenaikan omzet 200% dalam 3 bulan.', 
      image_url: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=800&q=80', 
      gallery: [
        'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['Meta Ads', 'SEO', 'Content Strategy'], 
      category: 'Digital Marketing', 
      demo_url: '#', 
      repo_url: '' 
    },
    { 
      id: 'p1b2d63d-a1f2-4f3b-b6c8-e2f4a5b6c7d2', 
      title: 'Company Profile Corporate', 
      description: 'Pengembangan website perusahaan konstruksi menggunakan WordPress dan Elementor. Fokus pada kecepatan loading (Core Web Vitals) dan tampilan profesional yang mobile-friendly.', 
      image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      gallery: [],
      tags: ['WordPress', 'Elementor', 'CSS'], 
      category: 'WordPress Dev', 
      demo_url: '#', 
      repo_url: '' 
    },
    { 
      id: 'p1b2d63d-a1f2-4f3b-b6c8-e2f4a5b6c7d3', 
      title: 'Rebranding Coffee Shop', 
      description: 'Proyek rebranding visual identitas untuk kedai kopi, mencakup desain logo, menu, packaging, dan feed Instagram. Menciptakan tone of voice yang baru untuk menjangkau Gen Z.', 
      image_url: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80', 
      gallery: [],
      tags: ['Branding', 'Photoshop', 'Social Media'], 
      category: 'Creative', 
      demo_url: '#', 
      repo_url: '' 
    },
    { 
      id: 'p1b2d63d-a1f2-4f3b-b6c8-e2f4a5b6c7d4', 
      title: 'Lead Generation Property', 
      description: 'Strategi Google Ads (SEM) untuk developer properti. Mengoptimalkan landing page dan keyword bidding untuk mendapatkan leads berkualitas tinggi dengan CPC rendah.', 
      image_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80', 
      gallery: [],
      tags: ['Google Ads', 'Landing Page', 'Copywriting'], 
      category: 'Performance', 
      demo_url: '#', 
      repo_url: '' 
    },
    { 
      id: 'p1b2d63d-a1f2-4f3b-b6c8-e2f4a5b6c7d5', 
      title: 'Personal Blog Traveler', 
      description: 'Pembuatan website blog travel dengan fitur integrasi peta dan galeri foto. Kustomisasi tema WordPress agar ringan dan SEO friendly untuk keyword "Travel Budget".', 
      image_url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80', 
      gallery: [],
      tags: ['WordPress', 'SEO', 'Blogging'], 
      category: 'WordPress Dev', 
      demo_url: '#', 
      repo_url: '' 
    },
    { 
      id: 'p1b2d63d-a1f2-4f3b-b6c8-e2f4a5b6c7d6', 
      title: 'Viral TikTok Campaign', 
      description: 'Konsep dan eksekusi kampanye video pendek untuk peluncuran produk snack. Mencapai 1 juta views organik dalam seminggu melalui storytelling dan penggunaan sound trending.', 
      image_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80', 
      gallery: [],
      tags: ['TikTok', 'Video Editing', 'Viral Marketing'], 
      category: 'Social Media', 
      demo_url: '#', 
      repo_url: '' 
    }
  ],
  posts: [
    { id: 'b1b2d63d-a1f2-4f3b-b6c8-e2f4a5b6c7d1', title: 'Strategi SEO di Tahun 2024', excerpt: 'Algoritma Google terus berubah. Simak panduan lengkap agar website Anda tetap berada di halaman pertama pencarian.', content: 'Lorem ipsum...', cover_image: 'https://images.unsplash.com/photo-1571721795195-a2ca2d337096?auto=format&fit=crop&w=800&q=80', created_at: '2023-10-15', category: 'SEO' },
    { id: 'b1b2d63d-a1f2-4f3b-b6c8-e2f4a5b6c7d2', title: 'WordPress vs Web Builder Lain', excerpt: 'Mengapa WordPress masih menjadi raja CMS untuk bisnis jangka panjang dibandingkan Wix atau Squarespace.', content: 'Lorem ipsum...', cover_image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80', created_at: '2023-11-20', category: 'WordPress' },
    { id: 'b1b2d63d-a1f2-4f3b-b6c8-e2f4a5b6c7d3', title: 'Psikologi Warna dalam Branding', excerpt: 'Bagaimana pemilihan warna logo mempengaruhi persepsi pelanggan terhadap bisnis Anda secara bawah sadar.', content: 'Lorem ipsum...', cover_image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80', created_at: '2024-01-10', category: 'Branding' },
    { id: 'b1b2d63d-a1f2-4f3b-b6c8-e2f4a5b6c7d4', title: 'Copywriting yang Menjual', excerpt: 'Tips menulis headline dan CTA (Call to Action) yang terbukti meningkatkan konversi penjualan.', content: 'Lorem ipsum...', cover_image: 'https://images.unsplash.com/photo-1519337265831-281ec6cc8514?auto=format&fit=crop&w=800&q=80', created_at: '2024-02-05', category: 'Copywriting' }
  ],
  messages: [
    { id: 'm1', name: 'Client Example', email: 'client@example.com', message: 'Halo, saya ingin menanyakan tentang jasa konsultasi SEO.', created_at: new Date().toISOString() }
  ],
  subscribers: [
    { id: 'sub1', email: 'fan@example.com', created_at: new Date().toISOString() }
  ]
};

// Generic CRUD implementations
// Helper to remove invalid ID "1" if present
const sanitizePayload = (item: any) => {
  const payload = { ...item };
  if (payload.id === '1' || payload.id.length < 10) {
    delete payload.id;
  }
  return payload;
};

// Helper to merge default local data with fetched data if fields are missing (e.g. logo_url)
const mergeWithDefaults = (fetchedProfile: any) => {
    return { ...MOCK_DATA.profile, ...fetchedProfile };
};


export const db = {
  async getProfile(): Promise<Profile> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('profiles').select('*').single();
        if (data) return mergeWithDefaults(data);
      } catch (e) {
        console.warn('Supabase fetch failed', e);
      }
    }
    // Check Local Storage
    const local = localStorage.getItem('profile');
    if (local) return mergeWithDefaults(JSON.parse(local));
    
    return MOCK_DATA.profile;
  },

  async updateProfile(profile: Profile): Promise<void> {
    if (!isSupabaseConfigured || !supabase) throw new Error("Database not connected");

    const payload = { ...profile };
    // Smart ID handling: If ID is mock/short, try to find existing profile in DB to get real ID
    if (payload.id && payload.id.length < 32) {
       const { data: existing } = await supabase.from('profiles').select('id').limit(1).single();
       if (existing) {
         payload.id = existing.id;
       } else {
         delete (payload as any).id;
       }
    }

    const { error } = await supabase.from('profiles').upsert(payload);
    if (error) {
       // Deteksi error spesifik tentang kolom yang hilang
       if (error.message.includes("Could not find the") && error.message.includes("column")) {
          throw new Error("Skema Database Belum Update: Silahkan jalankan script SQL migrasi di Supabase untuk menambahkan kolom 'years_experience', 'brands_handled', atau 'logo_url'.");
       }
       throw new Error(error.message);
    }
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
    const { error } = await supabase.from('experiences').upsert(sanitizePayload(item));
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
    const { error } = await supabase.from('skills').upsert(sanitizePayload(item));
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
    const { error } = await supabase.from('projects').upsert(sanitizePayload(item));
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
    const { error } = await supabase.from('posts').upsert(sanitizePayload(item));
    if (error) throw new Error(error.message);
  },

  async deletePost(id: string): Promise<void> {
    if (!isSupabaseConfigured || !supabase) throw new Error("Database not connected");
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },

  // COMMENTS
  async getComments(postId: string): Promise<Comment[]> {
    if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
            .from('comments')
            .select('*')
            .eq('post_id', postId)
            .order('created_at', { ascending: false });
        
        if (data) return data as Comment[];
        if (error) console.warn("Comments fetch error (Table might not exist yet):", error.message);
    }
    return [];
  },

  async saveComment(comment: Omit<Comment, 'id' | 'created_at'>): Promise<void> {
    if (!isSupabaseConfigured || !supabase) throw new Error("Database not connected");
    const { error } = await supabase.from('comments').insert(comment);
    if (error) throw new Error(error.message);
  },

  // MESSAGES (INBOX)
  async getMessages(): Promise<ContactMessage[]> {
     if (isSupabaseConfigured && supabase) {
        const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
        if (data && data.length > 0) return data as any[];
     }
     return MOCK_DATA.messages as ContactMessage[];
  },

  async saveMessage(message: Omit<ContactMessage, 'id' | 'created_at'>): Promise<void> {
     if (!isSupabaseConfigured || !supabase) throw new Error("Database not connected");
     const { error } = await supabase.from('messages').insert(message);
     if (error) throw new Error(error.message);
  },

  async deleteMessage(id: string): Promise<void> {
     if (!isSupabaseConfigured || !supabase) throw new Error("Database not connected");
     const { error } = await supabase.from('messages').delete().eq('id', id);
     if (error) throw new Error(error.message);
  },

  // SUBSCRIBERS
  async getSubscribers(): Promise<Subscriber[]> {
     if (isSupabaseConfigured && supabase) {
        const { data } = await supabase.from('subscribers').select('*').order('created_at', { ascending: false });
        if (data && data.length > 0) return data as any[];
     }
     return MOCK_DATA.subscribers as Subscriber[];
  },

  async saveSubscriber(email: string): Promise<void> {
     if (!isSupabaseConfigured || !supabase) throw new Error("Database not connected");
     // Cek duplikat jika perlu, tapi Supabase unique constraint lebih baik
     const { error } = await supabase.from('subscribers').insert({ email });
     if (error) throw new Error(error.message);
  },

  async deleteSubscriber(id: string): Promise<void> {
     if (!isSupabaseConfigured || !supabase) throw new Error("Database not connected");
     const { error } = await supabase.from('subscribers').delete().eq('id', id);
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
