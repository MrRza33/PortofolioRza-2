import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, Save, X, LogOut, LayoutDashboard, Briefcase, Code, Folder, FileText, User, Upload } from 'lucide-react';
import { Profile, Experience, Skill, Project, BlogPost } from '../types';
import { Button, Input, Textarea, Card, Label } from './ui';
import { db } from '../services/database';

type Tab = 'profile' | 'experience' | 'skills' | 'projects' | 'blog';

interface AdminProps {
  data: {
    profile: Profile;
    experience: Experience[];
    skills: Skill[];
    projects: Project[];
    posts: BlogPost[];
  };
  refreshData: () => void;
  onLogout: () => void;
}

export const AdminDashboard = ({ data, refreshData, onLogout }: AdminProps) => {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [isEditing, setIsEditing] = useState<string | null>(null); // ID of item being edited
  const [formData, setFormData] = useState<any>(null); // Generic form data
  const [uploading, setUploading] = useState(false);

  // Handlers for switching forms
  const startEdit = (item: any) => {
    // Ensure all optional fields exist for Profile to ensure form generation loop picks them up
    if (activeTab === 'profile') {
        const fullProfile = {
            ...item,
            logo_url: item.logo_url || '',
            portfolio_url: item.portfolio_url || ''
        };
        setFormData(fullProfile);
        setIsEditing(item.id);
    } else {
        setFormData({ ...item });
        setIsEditing(item.id);
    }
  };

  const startNew = (type: Tab) => {
    const emptyModels: any = {
      experience: { id: Date.now().toString(), role: '', company: '', period: '', description: '', type: 'work' },
      skills: { id: Date.now().toString(), name: '', category: 'frontend', level: 50 },
      projects: { id: Date.now().toString(), title: '', description: '', image_url: '', tags: [], category: 'Web', demo_url: '', repo_url: '' },
      blog: { id: Date.now().toString(), title: '', excerpt: '', content: '', cover_image: '', created_at: new Date().toISOString(), category: 'General' }
    };
    setFormData(emptyModels[type]);
    setIsEditing('new');
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
    } catch (e) {
      alert('Gagal menyimpan data');
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus?')) return;
    try {
      if (activeTab === 'experience') await db.deleteExperience(id);
      else if (activeTab === 'skills') await db.deleteSkill(id);
      else if (activeTab === 'projects') await db.deleteProject(id);
      else if (activeTab === 'blog') await db.deletePost(id);
      refreshData();
    } catch (e) {
      alert('Gagal menghapus');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldKey: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
        const url = await db.uploadFile(file);
        setFormData((prev: any) => ({ ...prev, [fieldKey]: url }));
    } catch (err) {
        console.error(err);
        alert('Gagal mengupload file');
    } finally {
        setUploading(false);
    }
  };

  // --- RENDER CONTENT ---
  const renderContent = () => {
    if (isEditing) {
      return (
        <Card className="p-6 max-w-3xl mx-auto border-neutral-800 bg-neutral-900">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">{isEditing === 'new' ? 'Tambah Baru' : 'Edit Item'}</h3>
            <Button variant="ghost" onClick={() => { setIsEditing(null); setFormData(null); }}><X className="w-5 h-5" /></Button>
          </div>
          
          <div className="space-y-4">
             {/* Dynamic Form Generation based on activeTab and formData structure */}
             {Object.keys(formData).map((key) => {
                if (key === 'id') return null;
                
                // Image/File Upload Fields
                // Detects _url suffix, 'image' in name, or specific keys like 'cover_image'
                if (key.includes('_url') || key.includes('image') || key === 'cover_image') {
                    const isDoc = key.includes('cv') || key.includes('pdf') || key.includes('portfolio');
                    return (
                        <div key={key} className="space-y-2">
                            <Label className="capitalize">{key.replace('_', ' ')}</Label>
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
                                        <input
                                            type="file"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onChange={(e) => handleFileUpload(e, key)}
                                            accept={isDoc ? '.pdf,.doc,.docx' : 'image/*'}
                                        />
                                    </Button>
                                </div>
                                <span className="text-xs text-neutral-500">
                                    {isDoc ? 'PDF/Doc (Max 10MB)' : 'JPG/PNG (Max 5MB)'}
                                </span>
                            </div>
                            {/* Preview for images */}
                            {(formData[key] && !isDoc) && (
                                <div className="mt-2 relative group w-fit">
                                    <img src={formData[key]} alt="Preview" className="h-32 w-auto object-contain bg-black rounded border border-neutral-700" />
                                </div>
                            )}
                            {/* Link preview for docs */}
                            {(formData[key] && isDoc) && (
                                <div className="mt-2">
                                    <a href={formData[key]} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline text-sm">
                                        View Uploaded File
                                    </a>
                                </div>
                            )}
                        </div>
                    );
                }

                // Textareas
                if (key === 'description' || key === 'bio' || key === 'content' || key === 'excerpt') {
                   return (
                     <div key={key}>
                       <Label className="capitalize">{key.replace('_', ' ')}</Label>
                       <Textarea 
                          value={formData[key]} 
                          onChange={e => setFormData({...formData, [key]: e.target.value})} 
                          rows={key === 'content' ? 10 : 5}
                       />
                     </div>
                   );
                }
                // Tags Array
                if (key === 'tags') {
                    return (
                        <div key={key}>
                            <Label>Tags (Comma separated)</Label>
                            <Input 
                                value={Array.isArray(formData[key]) ? formData[key].join(', ') : formData[key]}
                                onChange={e => setFormData({...formData, [key]: e.target.value.split(',').map((s: string) => s.trim())})}
                            />
                        </div>
                    )
                }
                // Selects
                if (key === 'type' && activeTab === 'experience') {
                    return (
                        <div key={key}>
                            <Label>Type</Label>
                            <select 
                                className="flex h-10 w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData[key]}
                                onChange={e => setFormData({...formData, [key]: e.target.value})}
                            >
                                <option value="work">Work</option>
                                <option value="education">Education</option>
                            </select>
                        </div>
                    )
                }
                if (key === 'category' && activeTab === 'skills') {
                    return (
                        <div key={key}>
                            <Label>Category</Label>
                            <select 
                                className="flex h-10 w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData[key]}
                                onChange={e => setFormData({...formData, [key]: e.target.value})}
                            >
                                <option value="frontend">Frontend</option>
                                <option value="backend">Backend</option>
                                <option value="tools">Tools</option>
                                <option value="soft">Soft Skills</option>
                            </select>
                        </div>
                    )
                }

                return (
                  <div key={key}>
                    <Label className="capitalize">{key.replace('_', ' ')}</Label>
                    <Input 
                      type={typeof formData[key] === 'number' ? 'number' : 'text'}
                      value={formData[key]} 
                      onChange={e => setFormData({...formData, [key]: e.target.type === 'number' ? Number(e.target.value) : e.target.value})} 
                    />
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

    // List Views
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
                    <Label>Kontak</Label>
                    <p className="text-sm text-neutral-400">{data.profile.email}</p>
                </div>
             </Card>
          </div>
        );

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
                       {/* Show image thumbnail for projects/posts */}
                       {(item.image_url || item.cover_image) && (
                           <img src={item.image_url || item.cover_image} alt="" className="w-12 h-12 rounded object-cover bg-neutral-800" />
                       )}
                       <div>
                           <h4 className="font-bold text-neutral-200">{item.role || item.name || item.title}</h4>
                           <p className="text-sm text-neutral-500">{item.company || item.category || item.created_at}</p>
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