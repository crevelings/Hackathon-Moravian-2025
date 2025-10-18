import React from 'react';

const universities = ['Moravian', 'Lehigh', 'DeSales'];

const UniversitySelector = ({ onSelect }) => {
  return (
    <div className="selector">
      {universities.map((u) => (
        <button key={u} onClick={() => onSelect(u)} className="uni-btn">
          {u}
        </button>
      ))}
    </div>
  );
};

export default UniversitySelector;
