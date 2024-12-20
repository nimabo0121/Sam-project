import React from 'react'

export default function JournalNavbar({
  components,
  setActiveComponentIndex,
  activeComponentIndex,
}) {
  return (
    <div
      className="btn-toolbar mb-3"
      role="toolbar"
      aria-label="Toolbar with button groups"
    >
      <div className="btn-group me-2" role="group" aria-label="First group">
        {components.map((comp, index) => (
          <button
            key={index}
            onClick={() => setActiveComponentIndex(index)}
            type="button"
            className={`btn #f0f8ff ${
              index === activeComponentIndex ? 'btn-secondary ' : ''
            }`}
          >
            {comp.name}
          </button>
        ))}
      </div>
    </div>
  )
}
