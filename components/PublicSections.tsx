
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { Download, Github, Linkedin, Mail, ExternalLink, Calendar, Briefcase, GraduationCap, ArrowRight, Code, Database, Layout, PenTool, Send, CheckCircle, MessageSquare, User, Box, X, ChevronLeft, ChevronRight, Loader2, Tag } from 'lucide-react';
import { Profile, Experience, Skill, Project, BlogPost, Comment } from '../types';
import { Button, Card, Input, Textarea, Label, MarkdownRenderer } from './ui';
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
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubscribe = async () => {
        if (!email || !email.includes('@')) {
            alert("Mohon masukkan email yang valid.");
            return;
        }
        setStatus('loading');
        try {
            await db.saveSubscriber(email);
            setStatus('success');
            setEmail('');
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    return (
        <div className="py-16 bg-blue-900/10 border-y border-blue-900/30">
            <div className="container mx-auto px-6 text-center max-w-2xl">
                <h3 className="text-2xl font-bold text-white mb-4">Berlangganan Newsletter</h3>
                <p className="text-neutral-400 mb-6">Dapatkan update terbaru tentang artikel teknologi, tutorial coding, dan proyek terbaru saya langsung di inbox Anda.</p>
                
                {status === 'success' ? (
                    <div className="p-4 bg-green-500/10 text-green-500 rounded-lg flex items-center justify-center gap-2">
                        <CheckCircle className="w-5 h-5" /> Terima kasih telah berlangganan!
                    </div>
                ) : (
                    <div className="flex gap-2 flex-col sm:flex-row">
                        <Input 
                            placeholder="Masukkan email Anda" 
                            className="bg-black/50 border-neutral-700" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Button 
                            className="shrink-0 bg-blue-600 hover:bg-blue-500"
                            onClick={handleSubscribe}
                            disabled={status === 'loading'}
                        >
                            {status === 'loading' ? 'Menyimpan...' : 'Subscribe'}
                        </Button>
                    </div>
                )}
                {status === 'error' && <p className="text-red-500 text-sm mt-2">Gagal berlangganan. Pastikan tabel database sudah ada.</p>}
            </div>
        </div>
    );
};

// --- PROJECT MODAL (CAROUSEL) ---
const ProjectModal = ({ project, onClose }: { project: Project, onClose: () => void }) => {
    // Collect all images: Gallery + Main Image if not in gallery
    const images = project.gallery && project.gallery.length > 0 
        ? project.gallery 
        : [project.image_url];
    
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-neutral-900 w-full max-w-6xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-neutral-800 z-[101]"
            >
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Left: Image Carousel */}
                <div className="w-full md:w-2/3 bg-black relative flex items-center justify-center overflow-hidden h-[40vh] md:h-auto group">
                    <AnimatePresence mode='wait'>
                        <motion.img 
                            key={currentImageIndex}
                            src={images[currentImageIndex]}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="w-full h-full object-contain"
                            alt={project.title}
                        />
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    {images.length > 1 && (
                        <>
                            <button 
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-blue-600 transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button 
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-blue-600 transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                            
                            {/* Indicators */}
                            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                                {images.map((_, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-blue-500 w-4' : 'bg-white/50 hover:bg-white'}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Right: Content */}
                <div className="w-full md:w-1/3 p-8 flex flex-col overflow-y-auto">
                    <div className="mb-6">
                        <span className="text-blue-500 font-bold text-sm tracking-wider uppercase mb-2 block">{project.category}</span>
                        <h2 className="text-3xl font-bold text-white mb-4">{project.title}</h2>
                        
                        <div className="flex flex-wrap gap-2 mb-6">
                            {project.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-neutral-800 text-neutral-300 rounded-full text-xs font-medium border border-neutral-700">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div className="prose prose-invert prose-sm text-neutral-400 mb-8">
                            <p>{project.description}</p>
                        </div>
                    </div>

                    <div className="mt-auto space-y-4 pt-6 border-t border-neutral-800">
                        {project.demo_url && (
                            <a href={project.demo_url} target="_blank" rel="noreferrer" className="flex items-center justify-center w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors">
                                <ExternalLink className="w-4 h-4 mr-2" /> Live Demo / Visit Link
                            </a>
                        )}
                        {project.repo_url && (
                            <a href={project.repo_url} target="_blank" rel="noreferrer" className="flex items-center justify-center w-full py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-medium transition-colors">
                                <Github className="w-4 h-4 mr-2" /> View Repository
                            </a>
                        )}
                    </div>
                </div>
            </motion.div>
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
            Introduction by me
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
          {/* Efek Glow di belakang */}
          <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" />
          
          {/* Container Gambar tanpa border */}
          <div className="relative z-10 overflow-hidden">
            <img 
                src={profile.avatar_url} 
                alt={profile.name} 
                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700 rounded-2xl" 
            />
            
            {/* Overlay Gradient untuk menyatukan dengan background */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent rounded-2xl pointer-events-none" />
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
                       <h3 className="text-2xl font-bold text-blue-400">{profile.years_experience || '5+'}</h3>
                       <p className="text-sm text-neutral-500">Tahun Pengalaman</p>
                    </div>
                    <div className="p-4 bg-black/50 rounded-lg border border-neutral-800 text-center">
                       <h3 className="text-2xl font-bold text-blue-400">{profile.brands_handled || '12+'}</h3>
                       <p className="text-sm text-neutral-500">Brand pernah dihandle</p>
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
  const uniqueCategories = Array.from(new Set(skills.map(s => s.category)));

  const getCategoryIcon = (category: string) => {
      const lower = category.toLowerCase();
      if (lower.includes('front')) return Layout;
      if (lower.includes('back')) return Database;
      if (lower.includes('tool')) return PenTool;
      if (lower.includes('soft')) return User;
      if (lower.includes('mobile')) return Box;
      return Code;
  };

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
          {uniqueCategories.map((catName) => {
            const categorySkills = skills.filter(s => s.category === catName);
            const Icon = getCategoryIcon(catName);
            
            return (
              <motion.div
                key={catName}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <Icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-200 capitalize">{catName}</h3>
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

// --- PROJECTS TEASER (FOR HOME - BENTO STYLE) ---
export const ProjectsTeaser = ({ projects }: { projects: Project[] }) => {
  const displayProjects = projects.slice(0, 3); // Max 3 items
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  return (
    <section className="py-24 bg-black">
       <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Proyek <span className="text-blue-500">Terbaru</span></h2>
            <p className="text-neutral-400">Beberapa karya pilihan yang telah saya kerjakan.</p>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-12 auto-rows-[300px]">
             {displayProjects.map((project, idx) => {
                let spanClass = "";
                if (idx === 0) spanClass = "md:col-span-2 md:row-span-2";
                else spanClass = "md:col-span-2 md:row-span-1";

                return (
                    <motion.div
                       key={project.id}
                       initial={{ opacity: 0, y: 20 }}
                       whileInView={{ opacity: 1, y: 0 }}
                       viewport={{ once: true }}
                       transition={{ delay: idx * 0.1 }}
                       className={`group relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 ${spanClass} cursor-pointer`}
                       onClick={() => setSelectedProject(project)}
                    >
                       <img 
                            src={project.image_url} 
                            alt={project.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                       />
                       
                       <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300" />
                       
                       <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 md:translate-y-6 group-hover:translate-y-0 transition-transform duration-300">
                           <div className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">{project.category}</div>
                           <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                           <p className="text-neutral-300 text-sm line-clamp-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 delay-75">
                               {project.description}
                           </p>
                           <div className="mt-4 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                <span className="text-sm font-medium text-white hover:text-blue-400 inline-flex items-center">
                                    Lihat Detail <ArrowRight className="w-4 h-4 ml-1" />
                                </span>
                           </div>
                       </div>
                    </motion.div>
                );
             })}
          </div>

          <div className="text-center">
             <Link to="/projects">
                <Button size="lg" className="rounded-full px-8 bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700">
                   Lihat Semua Karya <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
             </Link>
          </div>
       </div>

       {/* Modal */}
       <AnimatePresence>
            {selectedProject && (
                <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
            )}
       </AnimatePresence>
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
            <p className="text-neutral-400">Berbagi peinformasi, pengetahuan, dan pengalaman seputar teknologi.</p>
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
                            <Link to={`/blog/${post.slug || post.id}`} className="text-sm font-medium text-white hover:text-blue-400 flex items-center">
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

// --- PROJECTS PAGE (MOSAIC/MASONRY FEEL) ---
export const ProjectsPage = ({ projects, portfolioUrl }: { projects: Project[], portfolioUrl?: string }) => {
  const [filter, setFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const categories = ['all', ...Array.from(new Set(projects.map(p => p.category)))];

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.category === filter);

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
            Kumpulan proyek terbaik yang pernah saya kerjakan...
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

        {/* Mosaic Grid Layout */}
        <motion.div 
           layout
           className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]"
        >
          <AnimatePresence mode='popLayout'>
            {filteredProjects.map((project, idx) => {
              const spanClass = (idx % 4 === 0) ? "md:col-span-2" : "";

              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`group relative rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-blue-500/50 transition-all duration-300 ${spanClass} cursor-pointer`}
                  onClick={() => setSelectedProject(project)}
                >
                    <img 
                      src={project.image_url} 
                      alt={project.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Dark Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-8 text-center">
                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <span className="text-blue-400 text-sm font-bold uppercase tracking-wider mb-2 block">{project.category}</span>
                            <h3 className="text-2xl font-bold text-white mb-4">{project.title}</h3>
                            <p className="text-neutral-300 text-sm mb-6 line-clamp-3">{project.description}</p>
                            
                            <div className="flex flex-wrap gap-2 justify-center mt-6">
                                {project.tags.slice(0, 3).map(tag => (
                                    <span key={tag} className="text-xs px-2 py-1 bg-white/10 text-white rounded-md backdrop-blur-sm">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {portfolioUrl && (
            <div className="mt-20 text-center">
                 <div className="p-8 bg-neutral-900 rounded-2xl border border-neutral-800 inline-block max-w-2xl w-full relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <h3 className="text-xl font-bold text-white mb-2 relative z-10">Tertarik melihat lebih detail?</h3>
                    <p className="text-neutral-400 mb-6 relative z-10">Unduh versi PDF lengkap dari portofolio saya untuk melihat studi kasus mendalam.</p>
                    <a href={portfolioUrl} target="_blank" rel="noreferrer" className="relative z-10">
                        <Button size="lg" className="gap-2 shadow-xl shadow-blue-500/20 bg-blue-600 hover:bg-blue-500 border-none w-full sm:w-auto">
                            <Download className="w-4 h-4" /> Download Portofolio PDF
                        </Button>
                    </a>
                 </div>
            </div>
         )}
      </div>

       {/* Modal */}
       <AnimatePresence>
            {selectedProject && (
                <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
            )}
       </AnimatePresence>
    </div>
  );
};

// --- BLOG LIST PAGE ---
export const BlogPage = ({ posts }: { posts: BlogPost[] }) => {
    const featuredPost = posts[0];
    const otherPosts = posts.slice(1);

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
                        Pemikiran, tutorial, dan wawasan seputar dunia Digital Marketing, Branding, dan WordPress.
                    </p>
                </div>

                {/* FEATURED POST */}
                {featuredPost && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-20"
                    >
                         <Link to={`/blog/${featuredPost.slug || featuredPost.id}`} className="group block relative rounded-3xl overflow-hidden border border-neutral-800 aspect-[2/1] md:aspect-[2.5/1]">
                             <img src={featuredPost.cover_image} alt={featuredPost.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                             <div className="absolute bottom-0 left-0 p-8 md:p-12 max-w-3xl">
                                  <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-blue-900 uppercase bg-blue-400 rounded-full">
                                    Featured Article
                                  </span>
                                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight group-hover:text-blue-400 transition-colors">
                                      {featuredPost.title}
                                  </h2>
                                  <p className="text-lg text-neutral-300 mb-6 line-clamp-2 md:line-clamp-3">
                                      {featuredPost.excerpt}
                                  </p>
                                  <div className="flex items-center gap-4 text-sm font-medium text-white">
                                      <span>Baca Selengkapnya</span>
                                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                                          <ArrowRight className="w-4 h-4" />
                                      </div>
                                  </div>
                             </div>
                         </Link>
                    </motion.div>
                )}

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {otherPosts.map((post, idx) => (
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
                                        <span className="px-3 py-1 text-xs rounded-full bg-black/50 backdrop-blur text-white font-medium border border-white/10">
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
                                    
                                    {/* Tags Preview */}
                                    {post.tags && post.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {post.tags.slice(0, 2).map(tag => (
                                                <span key={tag} className="text-[10px] text-neutral-500 px-2 py-0.5 border border-neutral-800 rounded">#{tag}</span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="mt-auto pt-4 border-t border-neutral-800">
                                        <Link to={`/blog/${post.slug || post.id}`} className="inline-flex items-center text-blue-500 text-sm font-medium hover:text-blue-400 group/link">
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
    // We expect slug now, but fallback to ID logic if needed
    const { slug } = useParams();
    
    // Cari post berdasarkan SLUG atau ID
    const post = posts.find(p => p.slug === slug || p.id === slug);
    
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentName, setCommentName] = useState('');
    const [commentContent, setCommentContent] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);

    useEffect(() => {
        if (post) {
            db.getComments(post.id).then(setComments);
        }
    }, [post]);

    // SEO Side Effect - Manual Meta Injection for client-side navigation
    useEffect(() => {
        if (post) {
            document.title = post.meta_title || post.title;
            
            // Function to set meta tag
            const setMeta = (name: string, content: string, attr: string = 'name') => {
                let element = document.querySelector(`meta[${attr}="${name}"]`);
                if (!element) {
                    element = document.createElement('meta');
                    element.setAttribute(attr, name);
                    document.head.appendChild(element);
                }
                element.setAttribute('content', content);
            };

            const desc = post.meta_description || post.excerpt;
            setMeta('description', desc);
            setMeta('og:title', post.meta_title || post.title, 'property');
            setMeta('og:description', desc, 'property');
            setMeta('og:image', post.cover_image, 'property');
            setMeta('og:type', 'article', 'property');
            
        } else {
            document.title = "Blog - Reza.Dev";
        }
    }, [post]);

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!post || !commentContent.trim()) return;

        setSubmittingComment(true);
        try {
            const newComment = {
                post_id: post.id,
                user_name: commentName.trim() || 'Anonymous',
                content: commentContent
            };
            await db.saveComment(newComment);
            
            // Refresh comments
            const updated = await db.getComments(post.id);
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

                <div className="prose prose-invert prose-lg max-w-none text-neutral-300 leading-loose mb-12">
                     {/* Markdown Renderer handling formatting */}
                     <MarkdownRenderer content={post.content} />
                </div>

                {/* Tags Footer */}
                {post.tags && post.tags.length > 0 && (
                    <div className="mb-16 pt-8 border-t border-neutral-800">
                        <div className="flex items-center gap-2 mb-4 text-neutral-400 text-sm font-bold uppercase tracking-wider">
                            <Tag className="w-4 h-4" /> Related Tags
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-neutral-900 border border-neutral-700 rounded-md text-neutral-300 hover:text-white hover:border-blue-500 transition-colors cursor-pointer text-sm">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

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
                                        placeholder="Tulis pesan kamu..." 
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
export const ContactPage = ({ profile }: { profile: Profile }) => {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
             await db.saveMessage(formData);
             setSubmitted(true);
             setFormData({ name: '', email: '', message: '' });
        } catch (e: any) {
             console.error(e);
             alert("Gagal mengirim pesan. Pastikan tabel database sudah ada.");
        } finally {
             setLoading(false);
        }
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
                                    <a href={`mailto:${profile.email}`} className="flex items-center gap-4 text-neutral-300 hover:text-blue-400 transition-colors p-4 rounded-lg hover:bg-neutral-800">
                                        <div className="p-3 bg-blue-500/10 rounded-full text-blue-500"><Mail className="w-6 h-6" /></div>
                                        <div>
                                            <div className="text-xs text-neutral-500 uppercase font-bold tracking-wider mb-1">Email</div>
                                            <div className="font-medium truncate max-w-[200px]">{profile.email}</div>
                                        </div>
                                    </a>
                                    <a href={profile.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-4 text-neutral-300 hover:text-blue-400 transition-colors p-4 rounded-lg hover:bg-neutral-800">
                                        <div className="p-3 bg-blue-500/10 rounded-full text-blue-500"><Linkedin className="w-6 h-6" /></div>
                                        <div>
                                            <div className="text-xs text-neutral-500 uppercase font-bold tracking-wider mb-1">LinkedIn</div>
                                            <div className="font-medium">Connect on LinkedIn</div>
                                        </div>
                                    </a>
                                    <a href={profile.github} target="_blank" rel="noreferrer" className="flex items-center gap-4 text-neutral-300 hover:text-blue-400 transition-colors p-4 rounded-lg hover:bg-neutral-800">
                                        <div className="p-3 bg-blue-500/10 rounded-full text-blue-500"><Github className="w-6 h-6" /></div>
                                        <div>
                                            <div className="text-xs text-neutral-500 uppercase font-bold tracking-wider mb-1">GitHub</div>
                                            <div className="font-medium">Follow on GitHub</div>
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
                                            <Input 
                                                id="name" 
                                                placeholder="Reza" 
                                                required 
                                                className="bg-black/50 border-neutral-700"
                                                value={formData.name}
                                                onChange={e => setFormData({...formData, name: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="email">Email</Label>
                                            <Input 
                                                id="email" 
                                                type="email" 
                                                placeholder="reza@example.com" 
                                                required 
                                                className="bg-black/50 border-neutral-700" 
                                                value={formData.email}
                                                onChange={e => setFormData({...formData, email: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="message">Pesan</Label>
                                            <Textarea 
                                                id="message" 
                                                placeholder="Ceritakan tentang proyek Anda..." 
                                                required 
                                                rows={5} 
                                                className="bg-black/50 border-neutral-700" 
                                                value={formData.message}
                                                onChange={e => setFormData({...formData, message: e.target.value})}
                                            />
                                        </div>
                                        <Button type="submit" className="w-full h-12 text-lg font-medium bg-blue-600 hover:bg-blue-500" disabled={loading}>
                                            {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                                            Kirim Pesan
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
