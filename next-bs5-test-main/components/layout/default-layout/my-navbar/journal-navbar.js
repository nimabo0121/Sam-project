import React from 'react';

export default function JournalNavbar({ components, setActiveComponentIndex }) {
  return (
    <div>
      {components.map((comp, index) => (
        <button
          key={index}
          onClick={() => setActiveComponentIndex(index)}
          className="btn btn-primary me-2"
        >
          {comp.name}
        </button>
      ))}
    </div>
  );
}
