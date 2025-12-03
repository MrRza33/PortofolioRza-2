import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation, Link, useNavigate } from 'react-router-dom';
import { db } from './services/database';
import { Hero, About, ExperienceSection, Skills, ProjectsTeaser, BlogTeaser, ProjectsPage, BlogPage, BlogDetail, ContactPage } from './components/PublicSections';
import { AdminDashboard } from './components/AdminDashboard';
import { Profile, Experience, Skill, Project, BlogPost } from './types';
import { Button, Input, Card } from './components/ui';
import { Loader2, Download, Home } from 'lucide-react';

// --- NAV BAR ---
const Navbar = ({ profile }: { profile?: Profile | null }) => {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const isLoginPage = location.pathname === '/login';
    const isHomePage = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Function to handle scrolling to sections
    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        if (isHomePage) {
            // If on home page, smooth scroll
            const element = document.getElementById(id);
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        } else {
            // If on other pages, navigate to home then scroll
            navigate('/');
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    };

    // Hide navbar on admin dashboard
    if (location.pathname.includes('admin')) return null;

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || !isHomePage ? 'bg-black/90 backdrop-blur-md border-b border-neutral-900 py-3' : 'bg-transparent py-5'}`}>
            <div className="container mx-auto px-6 flex justify-between items-center">
                <Link to="/" className="text-xl font-bold tracking-tighter text-white flex items-center gap-2">
                    {profile?.logo_url ? (
                        <img src={profile.logo_url} alt="Logo" className="h-8 w-auto object-contain" />
                    ) : (
                        <>Alex<span className="text-blue-500">.Dev</span></>
                    )}
                </Link>
                
                {isLoginPage ? (
                    <Link to="/">
                        <Button variant="ghost" size="sm" className="gap-2">
                            <Home className="w-4 h-4" /> Kembali ke Home
                        </Button>
                    </Link>
                ) : (
                    <>
                        <nav className="hidden md:flex gap-8 items-center">
                            {/* Scroll Links for Home Sections */}
                            {['About', 'Experience', 'Skills'].map((item) => (
                                <a 
                                    key={item} 
                                    href={`#${item.toLowerCase()}`}
                                    onClick={(e) => handleNavClick(e, item.toLowerCase())}
                                    className="text-sm font-medium text-neutral-300 hover:text-blue-400 transition-colors cursor-pointer"
                                >
                                    {item}
                                </a>
                            ))}
                            
                            {/* Direct Page Links */}
                            <Link to="/projects" className={`text-sm font-medium transition-colors ${location.pathname === '/projects' ? 'text-blue-400' : 'text-neutral-300 hover:text-blue-400'}`}>Projects</Link>
                            <Link to="/blog" className={`text-sm font-medium transition-colors ${location.pathname.includes('/blog') ? 'text-blue-400' : 'text-neutral-300 hover:text-blue-400'}`}>Blog</Link>
                            <Link to="/contact" className={`text-sm font-medium transition-colors ${location.pathname === '/contact' ? 'text-blue-400' : 'text-neutral-300 hover:text-blue-400'}`}>Contact</Link>
                        </nav>
                        
                        <div className="flex gap-4 items-center">
                             <Link to="/contact" className="md:hidden">
                                <Button size="sm" variant="primary">Contact</Button>
                             </Link>
                             <Link to="/login">
                                <Button variant="outline" size="sm" className="hidden md:flex border-neutral-700 hover:border-blue-500 hover:text-blue-400">Admin</Button>
                             </Link>
                        </div>
                    </>
                )}
            </div>
        </header>
    );
};

// --- FOOTER ---
const Footer = () => {
    const location = useLocation();
    if (location.pathname.includes('admin')) return null;
    return (
        <footer className="py-8 border-t border-neutral-900 bg-black text-center text-neutral-500 text-sm">
            <div className="container mx-auto px-6">
                 <div className="flex justify-center gap-6 mb-4">
                     <Link to="/" className="hover:text-white">Home</Link>
                     <Link to="/projects" className="hover:text-white">Projects</Link>
                     <Link to="/blog" className="hover:text-white">Blog</Link>
                     <Link to="/contact" className="hover:text-white">Contact</Link>
                 </div>
                 <p>&copy; {new Date().getFullYear()} Alex Pradana. Built with React & Tailwind.</p>
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
        <div className="min-h-screen flex items-center justify-center bg-black p-4 pt-20">
            <Card className="w-full max-w-md p-8 bg-neutral-900 border-neutral-800 shadow-2xl shadow-blue-900/10">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white mb-2">Admin Login</h1>
                    <p className="text-neutral-400">Masuk untuk mengelola portofolio</p>
                </div>
                {error && <div className="p-3 mb-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded text-sm text-center">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Input 
                            type="email" 
                            placeholder="Email" 
                            value={email} 
                            onChange={e => setEmail(e.target.value)} 
                            required 
                            className="bg-black border-neutral-800 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <Input 
                            type="password" 
                            placeholder="Password" 
                            value={password} 
                            onChange={e => setPassword(e.target.value)} 
                            required 
                            className="bg-black border-neutral-800 focus:ring-blue-500"
                        />
                    </div>
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
                        Login
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
    }>({
        profile: null,
        experience: [],
        skills: [],
        projects: [],
        posts: []
    });

    const initApp = async () => {
        try {
            // 1. Cek Auth Session (Remember Me)
            const session = await db.getSession();
            if (session) {
                setIsAuthenticated(true);
            }

            // 2. Fetch Data
            const [profile, experience, skills, projects, posts] = await Promise.all([
                db.getProfile(),
                db.getExperiences(),
                db.getSkills(),
                db.getProjects(),
                db.getPosts()
            ]);
            setData({ profile, experience, skills, projects, posts });
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

                    {/* Admin Routes */}
                    <Route path="/login" element={
                        isAuthenticated ? <Navigate to="/admin" /> : <Login onLogin={() => setIsAuthenticated(true)} />
                    } />
                    <Route path="/admin" element={
                        isAuthenticated ? (
                            <AdminDashboard 
                                data={data as any} 
                                refreshData={initApp} 
                                onLogout={handleLogout} 
                            />
                        ) : (
                            <Navigate to="/login" />
                        )
                    } />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}