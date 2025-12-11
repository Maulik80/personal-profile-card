import React from 'react';
import './ProfileCard.css'; 

function ProfileCard({ profileData , theme }) { 
  
  const { name, age, city } = profileData;

  return (
    <div className={`profile-card ${theme}-card`}>
      
      <h2>Live Profile Preview</h2>
      <hr />
      
      <div className="card-content">
        <p>
          <strong>Name:</strong> 
          <span className="data-field"> {name || 'Not Entered'}</span> 
        </p>
        
        <p>
          <strong>Age:</strong> 
          <span className="data-field"> {age ? `${age} years old` : 'Not Entered'}</span>
        </p>
        
        <p>
          <strong>City:</strong> 
          <span className="data-field"> {city || 'Not Entered'}</span>
        </p>
      </div>
      
    </div>
  );
}

export default ProfileCard;