import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { Download, Github, Linkedin, Mail, ExternalLink, Calendar, Briefcase, GraduationCap, ArrowRight, Code, Database, Layout, PenTool, Send, CheckCircle, MessageSquare, User } from 'lucide-react';
import { Profile, Experience, Skill, Project, BlogPost, Comment } from '../types';
import { Button, Card, Input, Textarea, Label } from './ui';
import { db } from '../services/database';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// --- COMPONENTS UTILS ---

const SubscriptionCTA = () => {
    return (
        <div className="py-16 bg-blue-900/10 border-y border-blue-900/30">
            <div className="container mx-auto px-6 text-center max-w-2xl">
                <h3 className="text-2xl font-bold text-white mb-4">Berlangganan Newsletter</h3>
                <p className="text-neutral-400 mb-6">Dapatkan update terbaru tentang artikel teknologi, tutorial coding, dan proyek terbaru saya langsung di inbox Anda.</p>
                <div className="flex gap-2 flex-col sm:flex-row">
                    <Input placeholder="Masukkan email Anda" className="bg-black/50 border-neutral-700" />
                    <Button className="shrink-0 bg-blue-600 hover:bg-blue-500">Subscribe</Button>
                </div>
            </div>
        </div>
    );
};

// --- HERO SECTION ---
export const Hero = ({ profile }: { profile: Profile }) => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-12">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="flex-1 text-center md:text-left"
        >
          <motion.div variants={fadeInUp} className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-blue-400 uppercase bg-blue-500/10 rounded-full">
            Portfolio Resmi
          </motion.div>
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Halo, saya <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
              {profile.name}
            </span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-xl text-neutral-400 mb-8 max-w-2xl mx-auto md:mx-0 leading-relaxed">
            {profile.tagline}
          </motion.p>
          <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 justify-center md:justify-start">
             <a href={profile.cv_url} target="_blank" rel="noreferrer">
              <Button size="lg" className="rounded-full bg-blue-600 hover:bg-blue-500 border-none shadow-blue-600/20">
                <Download className="w-5 h-5 mr-2" /> Download CV
              </Button>
            </a>
            {/* LINK KE HALAMAN PROJECTS */}
            <Link to="/projects">
              <Button variant="outline" size="lg" className="rounded-full border-blue-500/30 hover:bg-blue-500/10 text-blue-200">
                Lihat Karya
              </Button>
            </Link>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex gap-6 mt-12 justify-center md:justify-start">
            {[
              { icon: Github, href: profile.github },
              { icon: Linkedin, href: profile.linkedin },
              { icon: Mail, href: `mailto:${profile.email}` }
            ].map((social, idx) => (
              <a key={idx} href={social.href} target="_blank" rel="noreferrer" className="text-neutral-500 hover:text-blue-400 transition-colors transform hover:scale-110">
                <social.icon className="w-6 h-6" />
              </a>
            ))}
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex-1 relative max-w-md md:max-w-lg"
        >
          <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" />
          <div className="relative z-10 rounded-2xl overflow-hidden border-2 border-neutral-800 shadow-2xl">
            <img src={profile.avatar_url} alt={profile.name} className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// --- ABOUT SECTION ---
export const About = ({ profile }: { profile: Profile }) => {
  return (
    <section id="about" className="py-24 bg-neutral-900/30">
      <div className="container mx-auto px-6">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">Tentang <span className="text-blue-500">Saya</span></h2>
          <Card className="p-8 md:p-12 bg-neutral-900 border-blue-900/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-bl-full -mr-8 -mt-8" />
            <div className="flex flex-col md:flex-row gap-8 items-center">
               <div className="flex-1 space-y-4 text-neutral-300 leading-relaxed text-lg">
                  <p>{profile.bio}</p>
                  <div className="pt-4 grid grid-cols-2 gap-4">
                    <div className="p-4 bg-black/50 rounded-lg border border-neutral-800 text-center">
                       <h3 className="text-2xl font-bold text-blue-400">5+</h3>
                       <p className="text-sm text-neutral-500">Tahun Pengalaman</p>
                    </div>
                    <div className="p-4 bg-black/50 rounded-lg border border-neutral-800 text-center">
                       <h3 className="text-2xl font-bold text-blue-400">30+</h3>
                       <p className="text-sm text-neutral-500">Proyek Selesai</p>
                    </div>
                  </div>
               </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

// --- EXPERIENCE SECTION ---
export const ExperienceSection = ({ experiences }: { experiences: Experience[] }) => {
  return (
    <section id="experience" className="py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white">Pengalaman & <span className="text-blue-500">Pendidikan</span></h2>
        </motion.div>

        <div className="max-w-3xl mx-auto relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-blue-500/50 before:to-transparent">
          {experiences.map((exp, index) => (
            <motion.div 
              key={exp.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-blue-500 bg-black shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 shadow-[0_0_15px_theme('colors.blue.600')]">
                {exp.type === 'work' ? <Briefcase className="w-5 h-5 text-blue-400" /> : <GraduationCap className="w-5 h-5 text-blue-400" />}
              </div>
              
              <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 hover:border-blue-500/40 transition-colors bg-neutral-900/80">
                <div className="flex items-center justify-between mb-2">
                   <h3 className="font-bold text-lg text-white">{exp.role}</h3>
                   <span className="text-xs px-2 py-1 rounded bg-neutral-800 text-blue-400 border border-blue-500/20">{exp.period}</span>
                </div>
                <div className="text-blue-500 font-medium text-sm mb-3">{exp.company}</div>
                <p className="text-neutral-400 text-sm">{exp.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- SKILLS SECTION ---
export const Skills = ({ skills }: { skills: Skill[] }) => {
  const categories = [
    { id: 'frontend', label: 'Frontend', icon: Layout },
    { id: 'backend', label: 'Backend', icon: Database },
    { id: 'tools', label: 'Tools', icon: PenTool },
  ];

  return (
    <section id="skills" className="py-24 bg-neutral-900/30">
      <div className="container mx-auto px-6">
        <motion.h2 
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           className="text-3xl md:text-4xl font-bold text-center text-white mb-16"
        >
          Keahlian <span className="text-blue-500">Teknis</span>
        </motion.h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((cat) => {
            const categorySkills = skills.filter(s => s.category === cat.id);
            if (categorySkills.length === 0) return null;
            
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <cat.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-200 capitalize">{cat.label}</h3>
                </div>
                
                <div className="space-y-4">
                  {categorySkills.map((skill) => (
                    <div key={skill.id} className="group">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-neutral-300">{skill.name}</span>
                        <span className="text-sm font-medium text-neutral-500">{skill.level}%</span>
                      </div>
                      <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full relative"
                        >
                            <div className="absolute inset-0 bg-white/20 group-hover:animate-pulse" />
                        </motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// --- PROJECTS TEASER (FOR HOME) ---
export const ProjectsTeaser = ({ projects }: { projects: Project[] }) => {
  const displayProjects = projects.slice(0, 3); // Limit to 3 items
  
  return (
    <section className="py-24 bg-black">
       <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Proyek <span className="text-blue-500">Terbaru</span></h2>
            <p className="text-neutral-400">Beberapa karya pilihan yang telah saya kerjakan.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
             {displayProjects.map((project, idx) => (
                <motion.div
                   key={project.id}
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: idx * 0.1 }}
                >
                   <Card className="h-full overflow-hidden border-neutral-800 bg-neutral-900/50 hover:border-blue-500/30 transition-all flex flex-col group">
                      <div className="relative h-48 overflow-hidden">
                         <img src={project.image_url} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                         <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white font-medium border border-white/30 px-4 py-2 rounded-full backdrop-blur-sm">Lihat Detail</span>
                         </div>
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                         <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{project.title}</h3>
                         <p className="text-neutral-400 text-sm mb-4 line-clamp-3">{project.description}</p>
                         <div className="mt-auto flex flex-wrap gap-2">
                             {project.tags.slice(0,3).map(tag => (
                               <span key={tag} className="text-xs px-2 py-1 bg-neutral-800 text-neutral-400 rounded">{tag}</span>
                             ))}
                         </div>
                      </div>
                   </Card>
                </motion.div>
             ))}
          </div>

          <div className="text-center">
             <Link to="/projects">
                <Button size="lg" className="rounded-full px-8 bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700">
                   Lihat Semua Karya <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
             </Link>
          </div>
       </div>
    </section>
  );
};

// --- BLOG TEASER (FOR HOME) ---
export const BlogTeaser = ({ posts }: { posts: BlogPost[] }) => {
  const displayPosts = posts.slice(0, 3); // Limit to 3 items

  return (
    <section className="py-24 bg-neutral-900/30">
       <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Tulisan <span className="text-blue-500">Terbaru</span></h2>
            <p className="text-neutral-400">Berbagi pengetahuan dan pengalaman seputar teknologi.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
             {displayPosts.map((post, idx) => (
                <motion.div
                   key={post.id}
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: idx * 0.1 }}
                >
                   <Card className="h-full border-neutral-800 bg-neutral-900 flex flex-col group hover:border-blue-500/30 transition-all">
                      <div className="p-6 flex flex-col flex-1">
                         <div className="text-xs text-blue-400 mb-2 uppercase font-semibold tracking-wider">{post.category}</div>
                         <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">{post.title}</h3>
                         <p className="text-neutral-400 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                         <div className="mt-auto pt-4 border-t border-neutral-800 flex justify-between items-center">
                            <span className="text-xs text-neutral-500">{new Date(post.created_at).toLocaleDateString('id-ID', {year: 'numeric', month: 'short', day: 'numeric'})}</span>
                            <Link to={`/blog/${post.id}`} className="text-sm font-medium text-white hover:text-blue-400 flex items-center">
                               Baca <ArrowRight className="w-3 h-3 ml-1" />
                            </Link>
                         </div>
                      </div>
                   </Card>
                </motion.div>
             ))}
          </div>

          <div className="text-center">
             <Link to="/blog">
                <Button size="lg" className="rounded-full px-8 bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20">
                   Lihat Semua Artikel <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
             </Link>
          </div>
       </div>
    </section>
  );
};

// --- PROJECTS PAGE ---
export const ProjectsPage = ({ projects, portfolioUrl }: { projects: Project[], portfolioUrl?: string }) => {
  const [filter, setFilter] = useState('all');
  const categories = ['all', ...Array.from(new Set(projects.map(p => p.category)))];

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.category === filter);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-24 min-h-screen bg-black">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <motion.h1 
             initial={{ opacity: 0, y: -20 }}
             animate={{ opacity: 1, y: 0 }}
             className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Portfolio <span className="text-blue-500">Proyek</span>
          </motion.h1>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            Kumpulan proyek terbaik yang pernah saya kerjakan, mulai dari aplikasi web, mobile, hingga sistem backend yang kompleks.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  filter === cat 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25 scale-105' 
                    : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
        </div>

        <motion.div 
           layout
           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode='popLayout'>
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative"
              >
                <Card className="h-full overflow-hidden border-neutral-800 bg-neutral-900/80 hover:border-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={project.image_url} 
                      alt={project.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      {project.demo_url && (
                        <a href={project.demo_url} target="_blank" rel="noreferrer" className="p-2 bg-blue-600 rounded-full text-white hover:bg-blue-500 transition-transform hover:scale-110">
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                      {project.repo_url && (
                        <a href={project.repo_url} target="_blank" rel="noreferrer" className="p-2 bg-neutral-800 rounded-full text-white hover:bg-neutral-700 transition-transform hover:scale-110">
                          <Github className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                       <h3 className="font-bold text-xl text-white group-hover:text-blue-400 transition-colors">{project.title}</h3>
                    </div>
                    <p className="text-neutral-400 text-sm mb-4 line-clamp-3">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {project.tags.map(tag => (
                        <span key={tag} className="text-xs px-2 py-1 bg-neutral-800 text-blue-300 rounded border border-blue-500/10">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {portfolioUrl && (
            <div className="mt-20 text-center">
                 <div className="p-8 bg-neutral-900 rounded-2xl border border-neutral-800 inline-block max-w-2xl w-full">
                    <h3 className="text-xl font-bold text-white mb-2">Tertarik melihat lebih detail?</h3>
                    <p className="text-neutral-400 mb-6">Unduh versi PDF lengkap dari portofolio saya untuk melihat studi kasus mendalam.</p>
                    <a href={portfolioUrl} target="_blank" rel="noreferrer">
                        <Button size="lg" className="gap-2 shadow-xl shadow-blue-500/20 bg-blue-600 hover:bg-blue-500 border-none w-full sm:w-auto">
                            <Download className="w-4 h-4" /> Download Portofolio PDF
                        </Button>
                    </a>
                 </div>
            </div>
         )}
      </div>
    </div>
  );
};

// --- BLOG LIST PAGE ---
export const BlogPage = ({ posts }: { posts: BlogPost[] }) => {
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <div className="pt-24 min-h-screen bg-black">
            <div className="container mx-auto px-6 py-12">
                <div className="text-center mb-16">
                    <motion.h1 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-white mb-6"
                    >
                        Blog & <span className="text-blue-500">Artikel</span>
                    </motion.h1>
                    <p className="text-neutral-400 max-w-2xl mx-auto">
                        Pemikiran, tutorial, dan wawasan seputar teknologi web development, software engineering, dan karir di dunia tech.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {posts.map((post, idx) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Card className="flex flex-col h-full overflow-hidden group hover:border-blue-500/30 transition-all bg-neutral-900">
                                <div className="h-48 relative overflow-hidden shrink-0">
                                    <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 text-xs rounded-full bg-blue-600 text-white font-medium shadow-lg">
                                            {post.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col flex-1">
                                    <div className="flex items-center gap-2 text-xs text-neutral-500 mb-3">
                                        <Calendar className="w-3 h-3" /> 
                                        {new Date(post.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">{post.title}</h3>
                                    <p className="text-neutral-400 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                                    <div className="mt-auto pt-4 border-t border-neutral-800">
                                        <Link to={`/blog/${post.id}`} className="inline-flex items-center text-blue-500 text-sm font-medium hover:text-blue-400 group/link">
                                            Baca Selengkapnya <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover/link:translate-x-1" />
                                        </Link>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
            <SubscriptionCTA />
        </div>
    );
};

// --- BLOG DETAIL PAGE ---
export const BlogDetail = ({ posts }: { posts: BlogPost[] }) => {
    const { id } = useParams();
    const post = posts.find(p => p.id === id);
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentName, setCommentName] = useState('');
    const [commentContent, setCommentContent] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);

    useEffect(() => { window.scrollTo(0, 0); }, [id]);

    useEffect(() => {
        if (id) {
            db.getComments(id).then(setComments);
        }
    }, [id]);

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id || !commentContent.trim()) return;

        setSubmittingComment(true);
        try {
            const newComment = {
                post_id: id,
                user_name: commentName.trim() || 'Anonymous',
                content: commentContent
            };
            await db.saveComment(newComment);
            
            // Refresh comments
            const updated = await db.getComments(id);
            setComments(updated);
            
            setCommentContent('');
            setCommentName('');
        } catch (error) {
            alert("Gagal mengirim komentar. Pastikan tabel database sudah dibuat.");
        } finally {
            setSubmittingComment(false);
        }
    };

    if (!post) {
        return (
            <div className="min-h-screen pt-32 text-center container mx-auto px-6">
                <h2 className="text-2xl font-bold text-white mb-4">Artikel tidak ditemukan</h2>
                <Link to="/blog"><Button>Kembali ke Blog</Button></Link>
            </div>
        );
    }

    return (
        <div className="pt-24 min-h-screen bg-black">
            <article className="container mx-auto px-6 max-w-4xl py-12">
                <Link to="/blog" className="inline-flex items-center text-neutral-500 hover:text-white mb-8 transition-colors">
                    <ArrowRight className="w-4 h-4 mr-2 rotate-180" /> Kembali ke Daftar Artikel
                </Link>
                
                <header className="mb-12 text-center">
                    <div className="inline-block px-3 py-1 mb-6 text-sm font-medium text-blue-400 border border-blue-500/20 rounded-full bg-blue-500/10">
                        {post.category}
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                        {post.title}
                    </h1>
                    <div className="flex items-center justify-center gap-4 text-neutral-400 text-sm">
                         <span>{new Date(post.created_at).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                </header>

                <div className="mb-12 rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl">
                    <img src={post.cover_image} alt={post.title} className="w-full h-auto max-h-[500px] object-cover" />
                </div>

                <div className="prose prose-invert prose-lg max-w-none text-neutral-300 leading-loose mb-16">
                    {/* Render content with line breaks */}
                    {post.content.split('\n').map((paragraph, idx) => (
                        <p key={idx} className="mb-6">{paragraph}</p>
                    ))}
                </div>

                {/* --- COMMENT SECTION --- */}
                <div className="border-t border-neutral-800 pt-16">
                    <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                        <MessageSquare className="w-6 h-6 text-blue-500" /> Diskusi ({comments.length})
                    </h3>

                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Form */}
                        <Card className="p-6 bg-neutral-900 h-fit">
                            <h4 className="font-bold text-white mb-4">Tulis Komentar</h4>
                            <form onSubmit={handleCommentSubmit} className="space-y-4">
                                <div>
                                    <Label>Nama (Opsional)</Label>
                                    <Input 
                                        placeholder="Anonymous" 
                                        value={commentName}
                                        onChange={e => setCommentName(e.target.value)}
                                        className="bg-black/50"
                                    />
                                </div>
                                <div>
                                    <Label>Komentar</Label>
                                    <Textarea 
                                        placeholder="Tulis pendapat Anda..." 
                                        required
                                        value={commentContent}
                                        onChange={e => setCommentContent(e.target.value)}
                                        className="bg-black/50 min-h-[100px]"
                                    />
                                </div>
                                <Button type="submit" disabled={submittingComment} className="w-full">
                                    {submittingComment ? 'Mengirim...' : 'Kirim Komentar'}
                                </Button>
                            </form>
                        </Card>

                        {/* List */}
                        <div className="space-y-6">
                            {comments.length === 0 ? (
                                <p className="text-neutral-500 italic">Belum ada komentar. Jadilah yang pertama!</p>
                            ) : (
                                comments.map(comment => (
                                    <div key={comment.id} className="flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center shrink-0">
                                            <User className="w-5 h-5 text-neutral-400" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-white">{comment.user_name}</span>
                                                <span className="text-xs text-neutral-600">• {new Date(comment.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-neutral-300 text-sm leading-relaxed">{comment.content}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </article>
            <SubscriptionCTA />
        </div>
    );
};

// --- CONTACT PAGE ---
export const ContactPage = () => {
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        // Simulate sending
        setTimeout(() => setSubmitted(false), 3000);
    };

    return (
        <div className="pt-24 min-h-screen bg-black flex flex-col">
            <div className="container mx-auto px-6 py-12 flex-1">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <motion.h1 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-bold text-white mb-6"
                        >
                            Hubungi <span className="text-blue-500">Saya</span>
                        </motion.h1>
                        <p className="text-neutral-400 max-w-xl mx-auto">
                            Punya ide proyek menarik atau ingin berdiskusi tentang peluang kerjasama? Jangan ragu untuk mengirimkan pesan.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Contact Info */}
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                            <Card className="p-8 bg-neutral-900 border-neutral-800 h-full">
                                <h3 className="text-2xl font-bold text-white mb-6">Informasi Kontak</h3>
                                <div className="space-y-6">
                                    <a href="mailto:email@example.com" className="flex items-center gap-4 text-neutral-300 hover:text-blue-400 transition-colors p-4 rounded-lg hover:bg-neutral-800">
                                        <div className="p-3 bg-blue-500/10 rounded-full text-blue-500"><Mail className="w-6 h-6" /></div>
                                        <div>
                                            <div className="text-xs text-neutral-500 uppercase font-bold tracking-wider mb-1">Email</div>
                                            <div className="font-medium">alex@example.com</div>
                                        </div>
                                    </a>
                                    <a href="#" className="flex items-center gap-4 text-neutral-300 hover:text-blue-400 transition-colors p-4 rounded-lg hover:bg-neutral-800">
                                        <div className="p-3 bg-blue-500/10 rounded-full text-blue-500"><Linkedin className="w-6 h-6" /></div>
                                        <div>
                                            <div className="text-xs text-neutral-500 uppercase font-bold tracking-wider mb-1">LinkedIn</div>
                                            <div className="font-medium">linkedin.com/in/alex</div>
                                        </div>
                                    </a>
                                    <a href="#" className="flex items-center gap-4 text-neutral-300 hover:text-blue-400 transition-colors p-4 rounded-lg hover:bg-neutral-800">
                                        <div className="p-3 bg-blue-500/10 rounded-full text-blue-500"><Github className="w-6 h-6" /></div>
                                        <div>
                                            <div className="text-xs text-neutral-500 uppercase font-bold tracking-wider mb-1">GitHub</div>
                                            <div className="font-medium">github.com/alex</div>
                                        </div>
                                    </a>
                                </div>
                            </Card>
                        </motion.div>

                        {/* Form */}
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                            <Card className="p-8 bg-neutral-900 border-neutral-800">
                                {submitted ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center py-12">
                                        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mb-6">
                                            <CheckCircle className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2">Pesan Terkirim!</h3>
                                        <p className="text-neutral-400">Terima kasih telah menghubungi. Saya akan membalas secepatnya.</p>
                                        <Button className="mt-8" variant="outline" onClick={() => setSubmitted(false)}>Kirim Pesan Lagi</Button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                                            <Label htmlFor="name">Nama Lengkap</Label>
                                            <Input id="name" placeholder="John Doe" required className="bg-black/50 border-neutral-700" />
                                        </div>
                                        <div>
                                            <Label htmlFor="email">Email</Label>
                                            <Input id="email" type="email" placeholder="john@example.com" required className="bg-black/50 border-neutral-700" />
                                        </div>
                                        <div>
                                            <Label htmlFor="message">Pesan</Label>
                                            <Textarea id="message" placeholder="Ceritakan tentang proyek Anda..." required rows={5} className="bg-black/50 border-neutral-700" />
                                        </div>
                                        <Button type="submit" className="w-full h-12 text-lg font-medium bg-blue-600 hover:bg-blue-500">
                                            <Send className="w-4 h-4 mr-2" /> Kirim Pesan
                                        </Button>
                                    </form>
                                )}
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
            <SubscriptionCTA />
        </div>
    );
};