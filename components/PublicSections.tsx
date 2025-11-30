import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Github, Linkedin, Mail, ExternalLink, Calendar, Briefcase, GraduationCap, ArrowRight, Code, Database, Layout, PenTool, X } from 'lucide-react';
import { Profile, Experience, Skill, Project, BlogPost } from '../types';
import { Button, Card } from './ui';

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
            <a href="#projects">
              <Button variant="outline" size="lg" className="rounded-full border-blue-500/30 hover:bg-blue-500/10 text-blue-200">
                Lihat Karya
              </Button>
            </a>
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

// --- PROJECTS SECTION ---
export const Projects = ({ projects }: { projects: Project[] }) => {
  const [filter, setFilter] = useState('all');
  const categories = ['all', ...Array.from(new Set(projects.map(p => p.category)))];

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <section id="projects" className="py-24">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <motion.h2 
             initial={{ opacity: 0, x: -20 }}
             whileInView={{ opacity: 1, x: 0 }}
             className="text-3xl md:text-4xl font-bold text-white mb-6 md:mb-0"
          >
            Proyek <span className="text-blue-500">Unggulan</span>
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="flex flex-wrap gap-2"
          >
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === cat 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' 
                    : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </motion.div>
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
                <Card className="h-full overflow-hidden border-neutral-800 bg-neutral-900/80 hover:border-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
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
                  <div className="p-6">
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

        <div className="mt-16 text-center">
             <PortfolioDownloadButton />
        </div>
      </div>
    </section>
  );
};

// Helper component
const PortfolioDownloadButton = () => {
    return null; 
};

// --- BLOG SECTION ---
export const Blog = ({ posts }: { posts: BlogPost[] }) => {
  return (
    <section id="blog" className="py-24 bg-neutral-900/30">
      <div className="container mx-auto px-6">
        <motion.h2 
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           className="text-3xl md:text-4xl font-bold text-center text-white mb-16"
        >
          Artikel <span className="text-blue-500">Terbaru</span>
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {posts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="flex flex-col md:flex-row overflow-hidden h-full group hover:border-blue-500/30 transition-all bg-neutral-900">
                <div className="w-full md:w-48 h-48 md:h-auto relative overflow-hidden shrink-0">
                   <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="p-6 flex flex-col">
                  <div className="flex items-center gap-3 text-xs text-neutral-500 mb-2">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(post.created_at).toLocaleDateString()}</span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-medium">{post.category}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">{post.title}</h3>
                  <p className="text-neutral-400 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                  <a href="#" className="mt-auto inline-flex items-center text-blue-500 text-sm font-medium hover:text-blue-400">
                    Baca Selengkapnya <ArrowRight className="w-4 h-4 ml-1" />
                  </a>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};