import React, { useState } from 'react'; 
import ProfileCard from './components/ProfileCard';
import './App.css'; 

function App() {
  const [profileData, setProfileData] = useState({ 
    name: '', 
    age: '', 
    city: '' 
  }); 

  const [theme, setTheme] = useState('light'); 

  const handleChange = (e) => {
    const { name, value } = e.target; 
    setProfileData(prevData => ({
      ...prevData, 
      [name]: value, 
    }));
  };

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className={`app-container ${theme}-theme`}> 
      
      <h1>👤 Personal Profile Card Builder</h1>
      
      <button 
        onClick={toggleTheme}
        className="theme-toggle-button"
      >
        {theme === 'light' ? '🌙 Switch to Dark Mode' : '☀️ Switch to Light Mode'}
      </button>

      <div className="input-form">
        <h2>Enter Details</h2>
        
        <form>
          <div><label htmlFor="name">Name:</label><input type="text" id="name" name="name" value={profileData.name} onChange={handleChange} /></div>
          <div><label htmlFor="age">Age:</label><input type="number" id="age" name="age" value={profileData.age} onChange={handleChange} /></div>
          <div><label htmlFor="city">City:</label><input type="text" id="city" name="city" value={profileData.city} onChange={handleChange} /></div>
        </form>
      </div>

      <hr />

      <ProfileCard profileData={profileData} theme={theme} /> 
      
    </div>
  );
}

export default App;