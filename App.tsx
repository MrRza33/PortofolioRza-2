
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link, useNavigate } from 'react-router-dom';
import { db } from './services/database';
import { Hero, About, ExperienceSection, Skills, ProjectsTeaser, BlogTeaser, ProjectsPage, BlogPage, BlogDetail, ContactPage } from './components/PublicSections';
import { AdminDashboard } from './components/AdminDashboard';
import { Profile, Experience, Skill, Project, BlogPost, ContactMessage, Subscriber, Music } from './types';
import { Button, Input, Card } from './components/ui';
import { Loader2, Download, Home, Menu, X, ChevronRight, Music2, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// --- SCROLL TO TOP UTILITY ---
// Memastikan halaman kembali ke posisi paling atas saat pindah rute
const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

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

    // Handler khusus untuk Logo dan Home Link agar aman di Preview Environment
    const handleSafeHomeNavigate = (e: React.MouseEvent) => {
        e.preventDefault();
        if (isHomePage) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            navigate('/');
        }
        setMobileMenuOpen(false);
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
                    {/* Logo - Menggunakan Safe Handler untuk mencegah error preview */}
                    <a href="/" onClick={handleSafeHomeNavigate} className="relative z-50 group cursor-pointer">
                        {profile?.logo_url ? (
                            <img src={profile.logo_url} alt="Logo" className="h-10 w-auto object-contain transition-transform group-hover:scale-105" />
                        ) : (
                            <div className="text-2xl font-bold tracking-tighter font-display">
                                <span className="text-white">Reza</span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">.Dev</span>
                            </div>
                        )}
                    </a>
                    
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
                        {isLoginPage && (
                            <a href="/" onClick={handleSafeHomeNavigate} className="cursor-pointer">
                                <Button variant="ghost" size="sm" className="gap-2">
                                    <Home className="w-4 h-4" /> Home
                                </Button>
                            </a>
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
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

// --- FOOTER ---
const Footer = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Safe navigation for footer links too
    const handleSafeNavigate = (e: React.MouseEvent, path: string) => {
        e.preventDefault();
        if (location.pathname === path) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            navigate(path);
        }
    };

    if (location.pathname.includes('admin')) return null;
    return (
        <footer className="py-12 border-t border-neutral-900 bg-black text-center relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-50" />
            <div className="container mx-auto px-6 relative z-10">
                 <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-8 text-sm font-medium">
                     <a href="/" onClick={(e) => handleSafeNavigate(e, '/')} className="text-neutral-400 hover:text-white transition-colors cursor-pointer">Home</a>
                     <a href="/projects" onClick={(e) => handleSafeNavigate(e, '/projects')} className="text-neutral-400 hover:text-white transition-colors cursor-pointer">Projects</a>
                     <a href="/blog" onClick={(e) => handleSafeNavigate(e, '/blog')} className="text-neutral-400 hover:text-white transition-colors cursor-pointer">Blog</a>
                     <a href="/contact" onClick={(e) => handleSafeNavigate(e, '/contact')} className="text-neutral-400 hover:text-white transition-colors cursor-pointer">Contact</a>
                 </div>
                 <div className="text-neutral-600 text-sm flex flex-col gap-2">
                    <p>&copy; {new Date().getFullYear()} Reza. All rights reserved.</p>
                 </div>
            </div>
        </footer>
    );
};

// --- MUSIC PLAYER ---
const MusicPlayer = ({ musics }: { musics: Music[] }) => {
    // Memoize valid tracks so reference doesn't change on route change re-renders
    const validTracks = React.useMemo(() => musics.filter(m => m.is_active && m.audio_url), [musics]);
    
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true); // Default to true for autoplay
    const [isMuted, setIsMuted] = useState(false);
    const [showPlayer, setShowPlayer] = useState(false);
    const audioRef = React.useRef<HTMLAudioElement | null>(null);
    const hasInteracted = React.useRef(false);

    // Initialize audio ref
    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio();
            audioRef.current.loop = true;
        }
    }, []);

    // Change track when index changes without resetting if the same track is playing
    useEffect(() => {
        if (validTracks.length > 0 && audioRef.current) {
            const newSrc = validTracks[currentTrackIndex].audio_url;
            // Only update src if it's different to prevent restarting audio
            if (!audioRef.current.src.endsWith(newSrc)) {
                audioRef.current.src = newSrc;
                if (isPlaying) {
                    audioRef.current.play().catch(e => console.log('Autoplay restricted:', e));
                }
            }
        }
    }, [currentTrackIndex, validTracks]);

    // Update audio properties (play/pause/mute)
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.muted = isMuted;
            if (isPlaying) {
                audioRef.current.play().catch(e => {
                    console.log('Autoplay restricted:', e);
                    // Do not set isPlaying to false here so it can play on next interaction
                });
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, isMuted]);

    // Attempt to start playing on first user interaction if blocked
    useEffect(() => {
        const handleInteraction = () => {
            if (!hasInteracted.current) {
                hasInteracted.current = true;
                if (isPlaying && audioRef.current && audioRef.current.paused) {
                    audioRef.current.play().catch(e => console.log('Autoplay restricted on interaction:', e));
                }
            }
        };

        window.addEventListener('click', handleInteraction, { once: true });
        window.addEventListener('touchstart', handleInteraction, { once: true });
        window.addEventListener('scroll', handleInteraction, { once: true });
        window.addEventListener('keydown', handleInteraction, { once: true });
        
        return () => {
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('touchstart', handleInteraction);
            window.removeEventListener('scroll', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
        };
    }, [isPlaying]);

    if (validTracks.length === 0) return null;

    const currentTrack = validTracks[currentTrackIndex];

    const togglePlay = () => setIsPlaying(!isPlaying);
    const toggleMute = () => setIsMuted(!isMuted);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex items-end justify-end flex-col gap-2">
             <AnimatePresence>
                 {showPlayer && (
                     <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 shadow-xl shadow-black/50 w-64 backdrop-blur-xl bg-opacity-90"
                     >
                         <h4 className="text-sm font-bold text-white mb-1 truncate">{currentTrack.title}</h4>
                         <p className="text-xs text-neutral-400 mb-3 truncate">{currentTrack.artist || 'Unknown Artist'}</p>
                         
                         <div className="flex items-center justify-between">
                            <button 
                                onClick={togglePlay} 
                                className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center text-white transition-colors"
                            >
                                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
                            </button>
                            
                            <div className="flex gap-2">
                                {validTracks.length > 1 && (
                                    <button onClick={() => setCurrentTrackIndex((prev) => (prev + 1) % validTracks.length)} className="p-2 text-neutral-400 hover:text-white transition-colors" title="Next Track">
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                )}
                                <button onClick={toggleMute} className="p-2 text-neutral-400 hover:text-white transition-colors" title={isMuted ? "Unmute" : "Mute"}>
                                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                                </button>
                            </div>
                         </div>
                     </motion.div>
                 )}
             </AnimatePresence>

             <button 
                onClick={() => setShowPlayer(!showPlayer)}
                className={`w-12 h-12 rounded-full shadow-lg shadow-black/30 flex items-center justify-center transition-all ${isPlaying ? 'bg-blue-600 hover:bg-blue-500 animate-pulse' : 'bg-neutral-800 border border-neutral-700 hover:bg-neutral-700'}`}
             >
                 <Music2 className={`w-5 h-5 ${isPlaying ? 'text-white' : 'text-neutral-400'}`} />
                 {isPlaying && !showPlayer && (
                     <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full" />
                 )}
             </button>
        </div>
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

function AppContent() {
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
        musics: Music[];
    }>({
        profile: null,
        experience: [],
        skills: [],
        projects: [],
        posts: [],
        messages: [],
        subscribers: [],
        musics: []
    });

    const initApp = async () => {
        try {
            // 1. Cek Auth Session (Remember Me)
            const session = await db.getSession();
            if (session) {
                setIsAuthenticated(true);
            }

            // 2. Fetch Data
            const [profile, experience, skills, projects, posts, messages, subscribers, musics] = await Promise.all([
                db.getProfile(),
                db.getExperiences(),
                db.getSkills(),
                db.getProjects(),
                db.getPosts(),
                // Only fetch messages/subs if auth, but for simple architecture we might fetch or return empty
                db.getMessages(),
                db.getSubscribers(),
                db.getMusics()
            ]);
            setData({ profile, experience, skills, projects, posts, messages, subscribers, musics });
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

    const location = useLocation();
    const isAdminRoute = location.pathname.includes('/admin') || location.pathname === '/portalreza';

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-blue-500">
                <Loader2 className="w-10 h-10 animate-spin" />
            </div>
        );
    }

    if (!data.profile) return null;

    return (
        <div className="bg-black min-h-screen text-neutral-200 font-sans selection:bg-blue-500/30 selection:text-blue-200">
            <ScrollToTop />
            <Navbar profile={data.profile} />
            {!isAdminRoute && data.musics && data.musics.length > 0 && (
                <MusicPlayer musics={data.musics} />
            )}
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

                    {/* Blog Detail Route - Supports Slug or ID */}
                    <Route path="/blog/:slug" element={
                        <BlogDetail posts={data.posts} />
                    } />

                    <Route path="/contact" element={
                        <ContactPage profile={data.profile} />
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
                            <Navigate to="/" replace />
                        )
                    } />
                    
                    {/* Tangani rute /login lama agar tidak bisa diakses */}
                    <Route path="/login" element={<Navigate to="/" replace />} />

                    {/* Fallback route to catch unknown paths (e.g., AI Studio preview URLs) and redirect to home */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                <Footer />
            </div>
    );
}

export default function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}
