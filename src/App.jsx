/* src/App.jsx */
import React, { useState, useEffect, useMemo } from 'react'; 
import ProfileCard from './components/ProfileCard';
import ProfileForm from './components/ProfileForm';
import './styles/App.css'; 

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9]{10}$/;

function App() {
  const initialFormState = { 
    name: '', age: '', city: '', bio: '', skills: '', email: '', phone: '', photo: '' 
  };

  const [formData, setFormData] = useState(initialFormState); 
  const [profiles, setProfiles] = useState(() => {
    try {
      const saved = localStorage.getItem('profile-card-list');
      return saved ? JSON.parse(saved) : [];
    } catch (error) { return []; }
  });

  const [theme, setTheme] = useState(() => localStorage.getItem('profile-card-theme') || 'light');
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // Phase 15: Search feature

  const CHARACTER_LIMIT = 20;
  const BIO_LIMIT = 150;

  // Phase 15: Calculate Profile Completion Progress
  const completionPercentage = useMemo(() => {
    const fields = Object.values(formData);
    const filledFields = fields.filter(field => field !== '' && field !== null).length;
    return Math.round((filledFields / fields.length) * 100);
  }, [formData]);

  // Phase 15: Filtered Profiles based on Search
  const filteredProfiles = profiles.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    localStorage.setItem('profile-card-list', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem('profile-card-theme', theme);
  }, [theme]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) return alert("Upload JPG/PNG.");
      if (file.size > 1024 * 1024) return alert("File under 1MB required.");
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, photo: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target; 
    if (name === 'bio' && value.length > BIO_LIMIT) return;
    if ((name === 'name' || name === 'city') && value.length > CHARACTER_LIMIT) return;
    setFormData(prev => ({ ...prev, [name]: value }));

    let errorMsg = '';
    if (name === 'name' && value.length > 0 && value.length < 3) errorMsg = 'Min 3 chars.';
    else if (name === 'age' && value !== '' && (value < 1 || value > 100)) errorMsg = 'Age 1-100.';
    else if (name === 'email' && value !== '' && !EMAIL_REGEX.test(value)) errorMsg = 'Invalid Email.';
    else if (name === 'phone' && value !== '' && !PHONE_REGEX.test(value)) errorMsg = '10 digits required.';
    setErrors(prev => ({ ...prev, [name]: errorMsg }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(errors).some(err => err) || !formData.name) return alert("Fix errors first.");

    if (editingId) {
      setProfiles(prev => prev.map(p => p.id === editingId ? { ...formData, id: editingId, lastUpdated: Date.now() } : p));
      setEditingId(null);
    } else {
      setProfiles(prev => [{ ...formData, id: Date.now(), lastUpdated: Date.now() }, ...prev]);
    }
    
    setFormData(initialFormState);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleEdit = (profile) => {
    setFormData(profile);
    setEditingId(profile.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this profile permanently?")) {
      setProfiles(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleReset = () => {
    if (editingId) { setEditingId(null); setFormData(initialFormState); }
    else if (window.confirm("Delete all data?")) {
      setProfiles([]); setFormData(initialFormState); setErrors({}); localStorage.clear();
    }
  };

  return (
    <div className={`app-container ${theme}-theme`}> 
      <header className="app-header">
        <h1>👤 Profile Manager Pro</h1>
        <button 
          aria-label="Toggle Dark Mode"
          onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')} 
          className="theme-toggle-button"
        >
          {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>
      </header>

      {showSuccess && <div className="success-banner">✅ Operation Successful!</div>}

      <div className="main-content">
        <section className="form-section">
          {/* Phase 15: Progress Bar */}
          <div className="progress-container">
            <span className="progress-label">Profile Completion: {completionPercentage}%</span>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${completionPercentage}%` }}></div>
            </div>
          </div>

          <ProfileForm 
            formData={formData} 
            editingId={editingId}
            handleChange={handleChange} 
            handlePhotoChange={handlePhotoChange}
            handleSubmit={handleSubmit}
            handleReset={handleReset} 
            errors={errors} 
            charLimit={CHARACTER_LIMIT}
            bioLimit={BIO_LIMIT}
          />
        </section>

        <hr />

        <section className="list-section">
          {/* Phase 15: Search Input */}
          <div className="search-container">
            <input 
              type="text" 
              placeholder="🔍 Search by name or city..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-bar"
            />
          </div>

          <div className="profiles-grid">
            {filteredProfiles.map((profile) => (
              <ProfileCard 
                key={profile.id} 
                profileData={profile} 
                theme={theme} 
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
          {filteredProfiles.length === 0 && <p className="empty-msg">No profiles match your search.</p>}
        </section>
      </div>
    </div>
  );
}

export default App;