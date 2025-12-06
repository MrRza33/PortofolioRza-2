import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation, Link, useNavigate } from 'react-router-dom';
import { db } from './services/database';
import { Hero, About, ExperienceSection, Skills, ProjectsTeaser, BlogTeaser, ProjectsPage, BlogPage, BlogDetail, ContactPage } from './components/PublicSections';
import { AdminDashboard } from './components/AdminDashboard';
import { Profile, Experience, Skill, Project, BlogPost, ContactMessage, Subscriber } from './types';
import { Button, Input, Card } from './components/ui';
import { Loader2, Download, Home, Menu, X, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// --- NAV BAR ---
const Navbar = ({ profile }: { profile?: Profile | null }) => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    // Update deteksi halaman login ke rute rahasia
    const isLoginPage = location.pathname === '/portalreza';
    const isHomePage = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location]);

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        setMobileMenuOpen(false);
        
        if (isHomePage) {
            const element = document.getElementById(id);
            if (element) {
                const headerOffset = 80;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        } else {
            navigate('/');
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) {
                    const headerOffset = 80;
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }
            }, 100);
        }
    };

    if (location.pathname.includes('admin')) return null;

    const navLinks = [
        { name: 'About', type: 'scroll', target: 'about' },
        { name: 'Experience', type: 'scroll', target: 'experience' },
        { name: 'Skills', type: 'scroll', target: 'skills' },
        { name: 'Projects', type: 'route', target: '/projects' },
        { name: 'Blog', type: 'route', target: '/blog' },
        { name: 'Contact', type: 'route', target: '/contact' },
    ];

    return (
        <>
            <header 
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out border-b ${
                    scrolled || mobileMenuOpen || !isHomePage
                        ? 'bg-black/80 backdrop-blur-md border-white/10 py-3 shadow-lg shadow-black/20' 
                        : 'bg-transparent border-transparent py-6'
                }`}
            >
                <div className="container mx-auto px-6 flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="relative z-50 group">
                        {profile?.logo_url ? (
                            <img src={profile.logo_url} alt="Logo" className="h-10 w-auto object-contain transition-transform group-hover:scale-105" />
                        ) : (
                            <div className="text-2xl font-bold tracking-tighter font-display">
                                <span className="text-white">Reza</span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">.Dev</span>
                            </div>
                        )}
                    </Link>
                    
                    {/* Desktop Navigation */}
                    {!isLoginPage && (
                        <nav className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => (
                                link.type === 'scroll' ? (
                                    <a 
                                        key={link.name}
                                        href={`#${link.target}`}
                                        onClick={(e) => handleNavClick(e, link.target)}
                                        className="px-4 py-2 text-sm font-medium text-neutral-300 hover:text-white hover:bg-white/5 rounded-full transition-all duration-300 relative group"
                                    >
                                        {link.name}
                                    </a>
                                ) : (
                                    <Link 
                                        key={link.name}
                                        to={link.target}
                                        className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                                            location.pathname === link.target 
                                            ? 'text-white bg-white/10' 
                                            : 'text-neutral-300 hover:text-white hover:bg-white/5'
                                        }`}
                                    >
                                        {link.name}
                                    </Link>
                                )
                            ))}
                        </nav>
                    )}
                    
                    {/* Action Buttons (Desktop) */}
                    <div className="hidden md:flex items-center gap-4">
                        {/* Tombol Admin DIHAPUS agar tersembunyi */}
                        {isLoginPage && (
                            <Link to="/">
                                <Button variant="ghost" size="sm" className="gap-2">
                                    <Home className="w-4 h-4" /> Home
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    {!isLoginPage && (
                        <button 
                            className="md:hidden relative z-50 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    )}
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl pt-24 px-6 md:hidden flex flex-col"
                    >
                        <nav className="flex flex-col gap-2">
                            {navLinks.map((link, idx) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    {link.type === 'scroll' ? (
                                        <a 
                                            href={`#${link.target}`}
                                            onClick={(e) => handleNavClick(e, link.target)}
                                            className="flex items-center justify-between p-4 text-lg font-medium text-neutral-200 hover:text-white hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/10"
                                        >
                                            {link.name}
                                            <ChevronRight className="w-4 h-4 text-neutral-600" />
                                        </a>
                                    ) : (
                                        <Link 
                                            to={link.target}
                                            className={`flex items-center justify-between p-4 text-lg font-medium rounded-xl transition-all border ${
                                                location.pathname === link.target 
                                                ? 'text-white bg-blue-600/10 border-blue-500/20' 
                                                : 'text-neutral-200 hover:text-white hover:bg-white/5 border-transparent hover:border-white/10'
                                            }`}
                                        >
                                            {link.name}
                                            <ChevronRight className={`w-4 h-4 ${location.pathname === link.target ? 'text-blue-500' : 'text-neutral-600'}`} />
                                        </Link>
                                    )}
                                </motion.div>
                            ))}
                        </nav>
                        
                        {/* Link Admin di Mobile Menu juga DIHAPUS */}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

// --- FOOTER ---
const Footer = () => {
    const location = useLocation();
    if (location.pathname.includes('admin')) return null;
    return (
        <footer className="py-12 border-t border-neutral-900 bg-black text-center relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-50" />
            <div className="container mx-auto px-6 relative z-10">
                 <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-8 text-sm font-medium">
                     <Link to="/" className="text-neutral-400 hover:text-white transition-colors">Home</Link>
                     <Link to="/projects" className="text-neutral-400 hover:text-white transition-colors">Projects</Link>
                     <Link to="/blog" className="text-neutral-400 hover:text-white transition-colors">Blog</Link>
                     <Link to="/contact" className="text-neutral-400 hover:text-white transition-colors">Contact</Link>
                 </div>
                 <div className="text-neutral-600 text-sm flex flex-col gap-2">
                    <p>&copy; {new Date().getFullYear()} Reza. All rights reserved.</p>
                 </div>
            </div>
        </footer>
    );
};

// --- LOGIN PAGE ---
const Login = ({ onLogin }: { onLogin: () => void }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            // Call Supabase auth or fallback
            const success = await db.login(email, password);
            if (success) {
                onLogin();
            } else {
                setError('Invalid credentials');
            }
        } catch (err: any) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black pointer-events-none" />
            <Card className="w-full max-w-md p-8 bg-neutral-900/80 border-neutral-800 shadow-2xl backdrop-blur-md relative z-10">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2 font-display">Portal Reza</h1>
                    <p className="text-neutral-400">Restricted Access Only</p>
                </div>
                {error && <div className="p-3 mb-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded text-sm text-center">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-300">Email Address</label>
                        <Input 
                            type="email" 
                            placeholder="admin@example.com" 
                            value={email} 
                            onChange={e => setEmail(e.target.value)} 
                            required 
                            className="bg-black/50 border-neutral-800 focus:ring-blue-500 h-11"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-300">Password</label>
                        <Input 
                            type="password" 
                            placeholder="••••••••" 
                            value={password} 
                            onChange={e => setPassword(e.target.value)} 
                            required 
                            className="bg-black/50 border-neutral-800 focus:ring-blue-500 h-11"
                        />
                    </div>
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 h-11 text-base font-medium shadow-lg shadow-blue-600/20 mt-4" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
                        Sign In
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<{
        profile: Profile | null;
        experience: Experience[];
        skills: Skill[];
        projects: Project[];
        posts: BlogPost[];
        messages: ContactMessage[];
        subscribers: Subscriber[];
    }>({
        profile: null,
        experience: [],
        skills: [],
        projects: [],
        posts: [],
        messages: [],
        subscribers: []
    });

    const initApp = async () => {
        try {
            // 1. Cek Auth Session (Remember Me)
            const session = await db.getSession();
            if (session) {
                setIsAuthenticated(true);
            }

            // 2. Fetch Data
            const [profile, experience, skills, projects, posts, messages, subscribers] = await Promise.all([
                db.getProfile(),
                db.getExperiences(),
                db.getSkills(),
                db.getProjects(),
                db.getPosts(),
                // Only fetch messages/subs if auth, but for simple architecture we might fetch or return empty
                db.getMessages(),
                db.getSubscribers()
            ]);
            setData({ profile, experience, skills, projects, posts, messages, subscribers });
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        initApp();
    }, []);

    const handleLogout = async () => {
        await db.logout();
        setIsAuthenticated(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-blue-500">
                <Loader2 className="w-10 h-10 animate-spin" />
            </div>
        );
    }

    if (!data.profile) return null;

    return (
        <Router>
            <div className="bg-black min-h-screen text-neutral-200 font-sans selection:bg-blue-500/30 selection:text-blue-200">
                <Navbar profile={data.profile} />
                <Routes>
                    {/* Home Route: Hero, About, Experience, Skills */}
                    <Route path="/" element={
                        <main>
                            <Hero profile={data.profile} />
                            <About profile={data.profile} />
                            <ExperienceSection experiences={data.experience} />
                            <Skills skills={data.skills} />
                            <ProjectsTeaser projects={data.projects} />
                            <BlogTeaser posts={data.posts} />
                        </main>
                    } />
                    
                    {/* Dedicated Pages */}
                    <Route path="/projects" element={
                        <ProjectsPage projects={data.projects} portfolioUrl={data.profile.portfolio_url} />
                    } />
                    
                    <Route path="/blog" element={
                        <BlogPage posts={data.posts} />
                    } />

                    <Route path="/blog/:id" element={
                        <BlogDetail posts={data.posts} />
                    } />

                    <Route path="/contact" element={
                        <ContactPage />
                    } />

                    {/* Secret Admin Routes */}
                    {/* Rute Rahasia untuk Login */}
                    <Route path="/portalreza" element={
                        isAuthenticated ? <Navigate to="/admin" /> : <Login onLogin={() => setIsAuthenticated(true)} />
                    } />
                    
                    {/* Dashboard Admin - Redirect ke Home jika belum login (Stealth Mode) */}
                    <Route path="/admin" element={
                        isAuthenticated ? (
                            <AdminDashboard 
                                data={data as any} 
                                refreshData={initApp} 
                                onLogout={handleLogout} 
                            />
                        ) : (
                            <Navigate to="/" />
                        )
                    } />
                    
                    {/* Tangani rute /login lama agar tidak bisa diakses */}
                    <Route path="/login" element={<Navigate to="/" />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}