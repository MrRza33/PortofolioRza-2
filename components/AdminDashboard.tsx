
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, Save, X, LogOut, LayoutDashboard, Briefcase, Code, Folder, FileText, User, Upload, Image as ImageIcon, Mail, Users, Calendar, Bold, Italic, List, Heading, Link as LinkIcon, Eye, Settings, Check } from 'lucide-react';
import { Profile, Experience, Skill, Project, BlogPost, ContactMessage, Subscriber } from '../types';
import { Button, Input, Textarea, Card, Label, MarkdownRenderer } from './ui';
import { db } from '../services/database';

type Tab = 'profile' | 'experience' | 'skills' | 'projects' | 'blog' | 'messages' | 'subscribers';

interface AdminProps {
  data: {
    profile: Profile;
    experience: Experience[];
    skills: Skill[];
    projects: Project[];
    posts: BlogPost[];
    messages: ContactMessage[];
    subscribers: Subscriber[];
  };
  refreshData: () => void;
  onLogout: () => void;
}

// Helper untuk membuat UUID yang valid
function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export const AdminDashboard = ({ data, refreshData, onLogout }: AdminProps) => {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  
  // Blog Editor Specific States
  const [blogTab, setBlogTab] = useState<'content' | 'seo'>('content');
  const [showPreview, setShowPreview] = useState(false);
  
  // Link Modal State
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkSelection, setLinkSelection] = useState<{start: number, end: number, text: string} | null>(null);
  const linkInputRef = useRef<HTMLInputElement>(null);

  // Focus input when link modal opens
  useEffect(() => {
    if (showLinkModal && linkInputRef.current) {
        setTimeout(() => linkInputRef.current?.focus(), 100);
    }
  }, [showLinkModal]);

  // Handlers for switching forms
  const startEdit = (item: any) => {
    if (activeTab === 'profile') {
        const fullProfile = {
            ...item,
            logo_url: item.logo_url || '',
            portfolio_url: item.portfolio_url || '',
            years_experience: item.years_experience || '5+',
            brands_handled: item.brands_handled || '12+'
        };
        setFormData(fullProfile);
    } else if (activeTab === 'blog') {
        setFormData({
            ...item,
            slug: item.slug || '',
            meta_title: item.meta_title || '',
            meta_description: item.meta_description || '',
            tags: item.tags || []
        });
        setBlogTab('content'); // Reset to content tab
        setShowPreview(false);
    } else {
        setFormData({ ...item });
    }
    setIsEditing(item.id);
  };

  const startNew = (type: Tab) => {
    const newId = generateUUID();
    
    const emptyModels: any = {
      experience: { id: newId, role: '', company: '', period: '', description: '', type: 'work' },
      skills: { id: newId, name: '', category: 'Frontend', level: 50 },
      projects: { id: newId, title: '', description: '', image_url: '', gallery: [], tags: [], category: 'Web', demo_url: '', repo_url: '' },
      blog: { id: newId, title: '', excerpt: '', content: '', cover_image: '', created_at: new Date().toISOString(), category: 'General', slug: '', meta_title: '', meta_description: '', tags: [] }
    };
    
    if (emptyModels[type]) {
        setFormData(emptyModels[type]);
        setIsEditing('new');
        if (type === 'blog') {
            setBlogTab('content');
            setShowPreview(false);
        }
    }
  };

  const handleSave = async () => {
    if (!formData) return;
    try {
      if (activeTab === 'profile') await db.updateProfile(formData);
      else if (activeTab === 'experience') await db.saveExperience(formData);
      else if (activeTab === 'skills') await db.saveSkill(formData);
      else if (activeTab === 'projects') await db.saveProject(formData);
      else if (activeTab === 'blog') await db.savePost(formData);
      
      refreshData();
      setIsEditing(null);
      setFormData(null);
    } catch (e: any) {
      console.error(e);
      alert(`Gagal menyimpan data: ${e.message || e.error_description || JSON.stringify(e)}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus?')) return;
    try {
      if (activeTab === 'experience') await db.deleteExperience(id);
      else if (activeTab === 'skills') await db.deleteSkill(id);
      else if (activeTab === 'projects') await db.deleteProject(id);
      else if (activeTab === 'blog') await db.deletePost(id);
      else if (activeTab === 'messages') await db.deleteMessage(id);
      else if (activeTab === 'subscribers') await db.deleteSubscriber(id);
      refreshData();
    } catch (e: any) {
      console.error(e);
      alert(`Gagal menghapus: ${e.message || JSON.stringify(e)}`);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldKey: string, isArray: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
        const url = await db.uploadFile(file);
        if (isArray) {
            const currentArray = Array.isArray(formData[fieldKey]) ? formData[fieldKey] : [];
            setFormData((prev: any) => ({ ...prev, [fieldKey]: [...currentArray, url] }));
        } else {
            setFormData((prev: any) => ({ ...prev, [fieldKey]: url }));
        }
    } catch (err: any) {
        alert(`Gagal mengupload file: ${err.message}`);
    } finally {
        setUploading(false);
    }
  };

  // Blog Editor Toolbar Helper
  const insertMarkdown = (syntax: string, placeholder: string = '') => {
      const textarea = document.getElementById('blog-content-area') as HTMLTextAreaElement;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const selection = text.substring(start, end);

      // Handle Link Logic specifically
      if (syntax === 'LINK') {
          setLinkSelection({ start, end, text: selection });
          setLinkUrl('');
          setShowLinkModal(true);
          return;
      }
      
      const before = text.substring(0, start);
      const after = text.substring(end, text.length);
      
      let newText = '';
      if (syntax === 'B') newText = `**${selection || placeholder}**`;
      else if (syntax === 'I') newText = `*${selection || placeholder}*`;
      else if (syntax === 'H2') newText = `\n## ${selection || placeholder}\n`;
      else if (syntax === 'UL') newText = `\n- ${selection || placeholder}\n`;

      const newValue = before + newText + after;
      setFormData({...formData, content: newValue});
  };

  const handleInsertLink = () => {
    if (!linkSelection) return;
    
    const textarea = document.getElementById('blog-content-area') as HTMLTextAreaElement;
    const text = formData.content;
    const before = text.substring(0, linkSelection.start);
    const after = text.substring(linkSelection.end, text.length);
    
    // Format: [Text](URL)
    const linkText = linkSelection.text || 'Link Text';
    const finalUrl = linkUrl || '#';
    const newText = `[${linkText}](${finalUrl})`;
    
    setFormData({...formData, content: before + newText + after});
    setShowLinkModal(false);
    setLinkUrl('');
    setLinkSelection(null);
  };

  // --- RENDER CONTENT ---
  const renderContent = () => {
    if (isEditing) {
      
      // --- CUSTOM BLOG EDITOR ---
      if (activeTab === 'blog') {
          return (
              <div className="max-w-5xl mx-auto h-full flex flex-col relative">
                  {/* Link Modal Popup */}
                  {showLinkModal && (
                      <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                          <div className="bg-neutral-900 border border-neutral-700 p-6 rounded-xl shadow-2xl w-full max-w-md transform transition-all scale-100">
                              <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                  <LinkIcon className="w-5 h-5 text-blue-500" /> Masukkan Link URL
                              </h4>
                              <div className="space-y-4">
                                  <div>
                                      <Label>URL Tujuan</Label>
                                      <Input 
                                          ref={linkInputRef}
                                          placeholder="https://example.com" 
                                          value={linkUrl}
                                          onChange={(e) => setLinkUrl(e.target.value)}
                                          onKeyDown={(e) => {
                                              if (e.key === 'Enter') handleInsertLink();
                                          }}
                                          className="bg-black/50"
                                      />
                                  </div>
                                  <div className="flex justify-end gap-2">
                                      <Button variant="secondary" size="sm" onClick={() => setShowLinkModal(false)}>Batal</Button>
                                      <Button size="sm" onClick={handleInsertLink}>
                                          <Check className="w-4 h-4 mr-2" /> Masukkan Link
                                      </Button>
                                  </div>
                              </div>
                          </div>
                      </div>
                  )}

                  {/* Editor Header */}
                  <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-4">
                            <h3 className="text-xl font-bold text-white">{isEditing === 'new' ? 'Tulis Artikel Baru' : 'Edit Artikel'}</h3>
                            <div className="flex bg-neutral-900 rounded-lg p-1 border border-neutral-800">
                                <button onClick={() => setBlogTab('content')} className={`px-4 py-1.5 text-sm rounded-md transition-all ${blogTab === 'content' ? 'bg-blue-600 text-white shadow' : 'text-neutral-400 hover:text-white'}`}>
                                    Content
                                </button>
                                <button onClick={() => setBlogTab('seo')} className={`px-4 py-1.5 text-sm rounded-md transition-all ${blogTab === 'seo' ? 'bg-blue-600 text-white shadow' : 'text-neutral-400 hover:text-white'}`}>
                                    SEO & Meta
                                </button>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setShowPreview(!showPreview)} className={showPreview ? "bg-blue-500/10 text-blue-400 border-blue-500/50" : ""}>
                                <Eye className="w-4 h-4 mr-2" /> {showPreview ? 'Edit Mode' : 'Preview'}
                            </Button>
                            <Button variant="secondary" onClick={() => { setIsEditing(null); setFormData(null); }}><X className="w-5 h-5" /></Button>
                        </div>
                  </div>

                  {/* Main Editor Area */}
                  <div className="flex-1 flex gap-6 overflow-hidden">
                      {/* Left: Form */}
                      <Card className={`flex-1 flex flex-col bg-neutral-900 border-neutral-800 p-6 overflow-y-auto ${showPreview ? 'hidden md:flex' : 'flex'}`}>
                          {blogTab === 'content' ? (
                              <div className="space-y-6">
                                  <div>
                                      <Label>Judul Artikel</Label>
                                      <Input 
                                          value={formData.title} 
                                          onChange={e => setFormData({...formData, title: e.target.value})}
                                          className="text-lg font-bold"
                                          placeholder="Contoh: Strategi Digital Marketing 2024"
                                      />
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-4">
                                      <div>
                                          <Label>Kategori</Label>
                                          <Input value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                                      </div>
                                      <div>
                                          <Label>Tanggal</Label>
                                          <Input type="date" value={formData.created_at.split('T')[0]} onChange={e => setFormData({...formData, created_at: new Date(e.target.value).toISOString()})} />
                                      </div>
                                  </div>

                                  <div>
                                      <Label>Cover Image</Label>
                                      <div className="flex gap-2">
                                          <Input value={formData.cover_image} onChange={e => setFormData({...formData, cover_image: e.target.value})} className="flex-1" />
                                          <label className="cursor-pointer bg-neutral-800 hover:bg-neutral-700 text-white px-3 py-2 rounded-md border border-neutral-700 flex items-center">
                                              <Upload className="w-4 h-4" />
                                              <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'cover_image')} accept="image/*" />
                                          </label>
                                      </div>
                                  </div>

                                  <div>
                                      <Label>Ringkasan (Excerpt)</Label>
                                      <Textarea value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} rows={3} />
                                  </div>

                                  <div className="flex-1 flex flex-col min-h-[400px]">
                                      <div className="flex justify-between items-center mb-2">
                                          <Label>Konten (Markdown Supported)</Label>
                                          <div className="flex gap-1">
                                              <button onClick={() => insertMarkdown('B')} className="p-1.5 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white" title="Bold"><Bold className="w-4 h-4" /></button>
                                              <button onClick={() => insertMarkdown('I')} className="p-1.5 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white" title="Italic"><Italic className="w-4 h-4" /></button>
                                              <button onClick={() => insertMarkdown('H2')} className="p-1.5 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white" title="Heading"><Heading className="w-4 h-4" /></button>
                                              <button onClick={() => insertMarkdown('UL')} className="p-1.5 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white" title="List"><List className="w-4 h-4" /></button>
                                              <button onClick={() => insertMarkdown('LINK')} className="p-1.5 hover:bg-neutral-800 rounded text-neutral-400 hover:text-blue-400" title="Insert Link"><LinkIcon className="w-4 h-4" /></button>
                                          </div>
                                      </div>
                                      <Textarea 
                                          id="blog-content-area"
                                          value={formData.content} 
                                          onChange={e => setFormData({...formData, content: e.target.value})} 
                                          className="flex-1 font-mono text-sm leading-relaxed"
                                          placeholder="Tulis artikel di sini..."
                                      />
                                  </div>
                              </div>
                          ) : (
                              <div className="space-y-6">
                                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm text-blue-300">
                                      <h4 className="font-bold flex items-center gap-2 mb-2"><Settings className="w-4 h-4" /> Konfigurasi SEO</h4>
                                      <p>Pengaturan ini membantu artikel Anda ditemukan di Google. Pastikan Slug unik.</p>
                                  </div>

                                  <div>
                                      <Label>URL Slug</Label>
                                      <div className="flex items-center">
                                          <span className="bg-neutral-800 text-neutral-500 px-3 py-2 rounded-l-md border border-neutral-700 border-r-0 text-sm">/blog/</span>
                                          <Input 
                                              value={formData.slug} 
                                              onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                                              className="rounded-l-none"
                                              placeholder="judul-artikel-anda"
                                          />
                                      </div>
                                  </div>

                                  <div>
                                      <Label>Meta Title (Max 60 chars)</Label>
                                      <Input 
                                          value={formData.meta_title} 
                                          onChange={e => setFormData({...formData, meta_title: e.target.value})} 
                                          placeholder="Judul menarik untuk hasil pencarian Google"
                                          maxLength={60}
                                      />
                                      <div className="text-right text-xs text-neutral-500 mt-1">{(formData.meta_title || '').length}/60</div>
                                  </div>

                                  <div>
                                      <Label>Meta Description (Max 160 chars)</Label>
                                      <Textarea 
                                          value={formData.meta_description} 
                                          onChange={e => setFormData({...formData, meta_description: e.target.value})} 
                                          placeholder="Deskripsi singkat yang muncul di bawah judul di Google"
                                          maxLength={160}
                                          rows={3}
                                      />
                                      <div className="text-right text-xs text-neutral-500 mt-1">{(formData.meta_description || '').length}/160</div>
                                  </div>

                                  <div>
                                      <Label>Tags / Keywords</Label>
                                      <Input 
                                          value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags}
                                          onChange={e => setFormData({...formData, tags: e.target.value.split(',').map((s: string) => s.trim())})}
                                          placeholder="Digital Marketing, SEO, Tips (Pisahkan dengan koma)"
                                      />
                                      <div className="flex flex-wrap gap-2 mt-3">
                                          {Array.isArray(formData.tags) && formData.tags.map((tag: string, idx: number) => (
                                              tag && <span key={idx} className="bg-neutral-800 text-neutral-300 px-2 py-1 rounded text-xs border border-neutral-700">{tag}</span>
                                          ))}
                                      </div>
                                  </div>
                              </div>
                          )}
                      </Card>
                      
                      {/* Right: Preview (Visible if toggled) */}
                      {showPreview && (
                          <div className="flex-1 bg-black rounded-xl border border-neutral-800 overflow-hidden flex flex-col">
                              <div className="p-3 border-b border-neutral-800 bg-neutral-900 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                                  Live Preview
                              </div>
                              <div className="p-8 overflow-y-auto prose prose-invert max-w-none">
                                  <span className="text-blue-500 text-sm font-bold uppercase">{formData.category}</span>
                                  <h1 className="text-3xl font-bold mt-2 mb-4">{formData.title}</h1>
                                  {formData.cover_image && <img src={formData.cover_image} alt="" className="w-full h-48 object-cover rounded-lg mb-6" />}
                                  <MarkdownRenderer content={formData.content} />
                              </div>
                          </div>
                      )}
                  </div>
                  
                  {/* Footer Actions */}
                  <div className="mt-4 flex justify-end">
                       <Button onClick={handleSave} size="lg" className="gap-2 w-full md:w-auto" disabled={uploading}>
                         <Save className="w-5 h-5" /> {uploading ? 'Menyimpan...' : 'Simpan Artikel'}
                       </Button>
                  </div>
              </div>
          )
      }

      // --- STANDARD EDITOR (Generic) ---
      return (
        <Card className="p-6 max-w-3xl mx-auto border-neutral-800 bg-neutral-900">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">{isEditing === 'new' ? 'Tambah Baru' : 'Edit Item'}</h3>
            <Button variant="ghost" onClick={() => { setIsEditing(null); setFormData(null); }}><X className="w-5 h-5" /></Button>
          </div>
          
          <div className="space-y-4">
             {Object.keys(formData).map((key) => {
                if (key === 'id') return null;
                
                // GALLERY HANDLING
                if (key === 'gallery') {
                    const galleryImages = Array.isArray(formData[key]) ? formData[key] : [];
                    return (
                        <div key={key} className="space-y-2 border border-neutral-800 p-4 rounded-lg bg-neutral-950/50">
                            <Label>Project Gallery (Carousel Images)</Label>
                            <p className="text-xs text-neutral-500 mb-2">Upload multiple images to show in the project popup.</p>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                {galleryImages.map((img: string, idx: number) => (
                                    <div key={idx} className="relative group aspect-square rounded overflow-hidden border border-neutral-700">
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                        <button 
                                            onClick={() => {
                                                const newArr = galleryImages.filter((_: any, i: number) => i !== idx);
                                                setFormData({...formData, [key]: newArr});
                                            }}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                                <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-neutral-700 rounded-lg hover:bg-neutral-800 cursor-pointer transition-colors">
                                    <Plus className="w-6 h-6 text-neutral-500" />
                                    <span className="text-xs text-neutral-500 mt-2">Add Image</span>
                                    <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, key, true)} accept="image/*" />
                                </label>
                            </div>
                        </div>
                    )
                }

                // Image/File Upload Fields
                if (key.includes('_url') || key.includes('image') || key === 'cover_image') {
                    const isDoc = key.includes('cv') || key.includes('pdf') || key.includes('portfolio');
                    const label = key === 'image_url' ? 'Thumbnail / Cover Image' : key.replace('_', ' ');
                    
                    return (
                        <div key={key} className="space-y-2">
                            <Label className="capitalize">{label}</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={formData[key] || ''}
                                    onChange={e => setFormData({...formData, [key]: e.target.value})}
                                    placeholder={isDoc ? "URL to document..." : "URL to image..."}
                                    className="flex-1"
                                />
                            </div>
                            <div className="flex items-center gap-4 mt-2">
                                <div className="relative">
                                    <Button type="button" variant="outline" size="sm" disabled={uploading} className="relative cursor-pointer hover:bg-neutral-800">
                                        <Upload className="w-4 h-4 mr-2" /> 
                                        {uploading ? 'Uploading...' : 'Upload File'}
                                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileUpload(e, key, false)} accept={isDoc ? '.pdf,.doc,.docx' : 'image/*'} />
                                    </Button>
                                </div>
                                <span className="text-xs text-neutral-500">{isDoc ? 'PDF/Doc (Max 10MB)' : 'JPG/PNG (Max 5MB)'}</span>
                            </div>
                            {(formData[key] && !isDoc) && <div className="mt-2 relative group w-fit"><img src={formData[key]} alt="Preview" className="h-32 w-auto object-contain bg-black rounded border border-neutral-700" /></div>}
                        </div>
                    );
                }

                if (key === 'description' || key === 'bio' || key === 'content' || key === 'excerpt') {
                   return (
                     <div key={key}>
                       <Label className="capitalize">{key.replace('_', ' ')}</Label>
                       <Textarea value={formData[key]} onChange={e => setFormData({...formData, [key]: e.target.value})} rows={key === 'content' ? 10 : 5} />
                     </div>
                   );
                }
                
                if (key === 'tags') {
                    return (
                        <div key={key}>
                            <Label>Tags (Comma separated)</Label>
                            <Input value={Array.isArray(formData[key]) ? formData[key].join(', ') : formData[key]} onChange={e => setFormData({...formData, [key]: e.target.value.split(',').map((s: string) => s.trim())})} />
                        </div>
                    )
                }

                if (key === 'type' && activeTab === 'experience') {
                    return (
                        <div key={key}>
                            <Label>Type</Label>
                            <select className="flex h-10 w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData[key]} onChange={e => setFormData({...formData, [key]: e.target.value})}>
                                <option value="work">Work</option>
                                <option value="education">Education</option>
                            </select>
                        </div>
                    )
                }

                return (
                  <div key={key}>
                    <Label className="capitalize">{key.replace('_', ' ')}</Label>
                    <Input type={typeof formData[key] === 'number' ? 'number' : 'text'} value={formData[key]} onChange={e => setFormData({...formData, [key]: e.target.type === 'number' ? Number(e.target.value) : e.target.value})} />
                  </div>
                );
             })}

             <div className="pt-4 flex justify-end gap-2">
               <Button variant="secondary" onClick={() => { setIsEditing(null); setFormData(null); }}>Batal</Button>
               <Button onClick={handleSave} className="gap-2" disabled={uploading}>
                 <Save className="w-4 h-4" /> {uploading ? 'Uploading...' : 'Simpan'}
               </Button>
             </div>
          </div>
        </Card>
      );
    }

    // List Views (UNCHANGED)
    switch(activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
             <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-white">Profil Diri</h3>
                <Button onClick={() => startEdit(data.profile)}><Edit2 className="w-4 h-4 mr-2" /> Edit Profil</Button>
             </div>
             <Card className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-neutral-900 border-neutral-800">
                <div>
                   <Label>Nama</Label>
                   <p className="text-lg text-white mb-4">{data.profile.name}</p>
                   <Label>Tagline</Label>
                   <p className="text-neutral-300 mb-4">{data.profile.tagline}</p>
                   <Label>Bio</Label>
                   <p className="text-neutral-400">{data.profile.bio}</p>
                   <div className="mt-4 flex flex-col gap-2">
                     <div>
                       <Label>CV URL</Label>
                       <a href={data.profile.cv_url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline text-sm truncate block">{data.profile.cv_url}</a>
                     </div>
                     <div>
                        <Label>Portfolio URL (PDF)</Label>
                        <a href={data.profile.portfolio_url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline text-sm truncate block">{data.profile.portfolio_url}</a>
                     </div>
                   </div>
                </div>
                <div>
                    <Label className="mb-2 block">Logo Website</Label>
                    {data.profile.logo_url ? (
                         <img src={data.profile.logo_url} alt="Logo" className="h-16 w-auto object-contain mb-6 border border-neutral-700 p-2 rounded bg-black" />
                    ) : (
                        <div className="h-16 w-32 bg-neutral-800 rounded mb-6 flex items-center justify-center text-xs text-neutral-500 border border-neutral-800">No Logo</div>
                    )}

                    <Label className="mb-2 block">Foto Profil</Label>
                    <img src={data.profile.avatar_url} alt="Avatar" className="w-32 h-32 rounded-full object-cover mb-4 border-2 border-neutral-700 bg-neutral-800" />
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <Label>Pengalaman</Label>
                            <p className="text-lg text-white">{data.profile.years_experience || '5+'}</p>
                        </div>
                        <div>
                            <Label>Brand Dihandle</Label>
                            <p className="text-lg text-white">{data.profile.brands_handled || '12+'}</p>
                        </div>
                    </div>

                    <Label>Kontak</Label>
                    <p className="text-sm text-neutral-400">{data.profile.email}</p>
                </div>
             </Card>
          </div>
        );

      case 'messages':
        return (
            <div className="space-y-6">
                 <h3 className="text-2xl font-bold text-white">Inbox Pesan</h3>
                 <div className="grid gap-4">
                    {data.messages.map((msg) => (
                        <Card key={msg.id} className="p-6 bg-neutral-900 border-neutral-800 group hover:border-blue-500/30 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-500 font-bold">
                                        {msg.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">{msg.name}</h4>
                                        <p className="text-sm text-blue-400">{msg.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                     <span className="text-xs text-neutral-500 flex items-center gap-1">
                                         <Calendar className="w-3 h-3" />
                                         {new Date(msg.created_at).toLocaleDateString()}
                                     </span>
                                     <Button size="sm" variant="danger" onClick={() => handleDelete(msg.id)}><Trash2 className="w-4 h-4" /></Button>
                                </div>
                            </div>
                            <div className="pl-13 border-l-2 border-neutral-800 pl-4 ml-5">
                                <p className="text-neutral-300 whitespace-pre-line">{msg.message}</p>
                            </div>
                        </Card>
                    ))}
                    {data.messages.length === 0 && <p className="text-center text-neutral-500 py-12">Belum ada pesan masuk.</p>}
                 </div>
            </div>
        )

      case 'subscribers':
        return (
             <div className="space-y-6">
                 <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold text-white">Subscribers Newsletter ({data.subscribers.length})</h3>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-neutral-800 text-neutral-500 text-sm">
                                <th className="py-3 px-4">Email</th>
                                <th className="py-3 px-4">Bergabung Pada</th>
                                <th className="py-3 px-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                            {data.subscribers.map((sub) => (
                                <tr key={sub.id} className="hover:bg-neutral-800/50">
                                    <td className="py-3 px-4 text-white font-medium">{sub.email}</td>
                                    <td className="py-3 px-4 text-neutral-400 text-sm">{new Date(sub.created_at).toLocaleDateString()}</td>
                                    <td className="py-3 px-4 text-right">
                                        <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-400 hover:bg-red-500/10" onClick={() => handleDelete(sub.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {data.subscribers.length === 0 && <p className="text-center text-neutral-500 py-12">Belum ada subscriber.</p>}
                 </div>
             </div>
        )

      case 'experience':
      case 'skills':
      case 'projects':
      case 'blog':
        const listData = activeTab === 'experience' ? data.experience : 
                         activeTab === 'skills' ? data.skills : 
                         activeTab === 'projects' ? data.projects : 
                         data.posts;
        return (
          <div className="space-y-6">
             <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold capitalize text-white">{activeTab}</h3>
                <Button onClick={() => startNew(activeTab)}><Plus className="w-4 h-4 mr-2" /> Tambah Baru</Button>
             </div>
             <div className="grid gap-4">
                {(listData as any[]).map((item) => (
                  <Card key={item.id} className="p-4 flex justify-between items-center group hover:bg-neutral-800/50 bg-neutral-900 border-neutral-800">
                    <div className="flex items-center gap-4">
                       {(item.image_url || item.cover_image) && (
                           <img src={item.image_url || item.cover_image} alt="" className="w-12 h-12 rounded object-cover bg-neutral-800" />
                       )}
                       <div>
                           <h4 className="font-bold text-neutral-200">{item.role || item.name || item.title}</h4>
                           <p className="text-sm text-neutral-500">{item.company || item.category || item.created_at}</p>
                           {activeTab === 'projects' && (item.gallery?.length > 0) && (
                                <span className="text-xs text-blue-400 flex items-center gap-1 mt-1"><ImageIcon className="w-3 h-3" /> {item.gallery.length} photos</span>
                           )}
                           {activeTab === 'blog' && item.slug && <span className="text-xs text-green-500 mt-1 block">/{item.slug}</span>}
                       </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <Button size="sm" variant="outline" onClick={() => startEdit(item)}><Edit2 className="w-3 h-3" /></Button>
                       <Button size="sm" variant="danger" onClick={() => handleDelete(item.id)}><Trash2 className="w-3 h-3" /></Button>
                    </div>
                  </Card>
                ))}
                {listData.length === 0 && <p className="text-center text-neutral-500 py-8">Belum ada data.</p>}
             </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-black flex text-neutral-200">
      {/* Sidebar */}
      <div className="w-64 bg-neutral-950 border-r border-neutral-900 p-4 flex flex-col fixed h-full z-20">
         <div className="mb-8 px-2 flex items-center gap-2">
            <LayoutDashboard className="text-blue-500" />
            <span className="font-bold text-xl text-white">Admin Panel</span>
         </div>
         
         <nav className="space-y-1 flex-1">
            {[
              { id: 'profile', icon: User, label: 'Profile' },
              { id: 'experience', icon: Briefcase, label: 'Experience' },
              { id: 'skills', icon: Code, label: 'Skills' },
              { id: 'projects', icon: Folder, label: 'Projects' },
              { id: 'blog', icon: FileText, label: 'Blog' },
              { id: 'messages', icon: Mail, label: 'Inbox Messages' },
              { id: 'subscribers', icon: Users, label: 'Newsletter Subs' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id as Tab); setIsEditing(null); }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${activeTab === item.id ? 'bg-blue-600/10 text-blue-400' : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'}`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
         </nav>

         <Button variant="ghost" className="justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={onLogout}>
            <LogOut className="w-5 h-5 mr-2" /> Logout
         </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8 overflow-y-auto h-screen bg-black">
         {renderContent()}
      </div>
    </div>
  );
};
