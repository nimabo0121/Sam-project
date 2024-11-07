import React from 'react'

export default function ChartNavbar({ intervals, setActiveComponentIndex }) {
  return (
    <div
      className="btn-toolbar mb-3"
      role="toolbar"
      aria-label="Toolbar with button groups"
    >
      <div className="btn-group me-2" role="group" aria-label="First group">
        {intervals.map((comp, index) => (
          <button
            key={index}
            onClick={() => setActiveComponentIndex(index)}
            type="button"
            className="btn btn-outline-secondary"
          >
            {comp.name}
          </button>
        ))}
      </div>
    </div>
  )
}
