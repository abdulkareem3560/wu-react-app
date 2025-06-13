import React from "react";

const SectionSelector = ({ section, setSection, sectionOptions, onLoadSection }) => (
  <div style={{ marginBottom: "1rem" }}>
    <label htmlFor="sectionSelect">Section: </label>
    <select
      id="sectionSelect"
      value={section}
      onChange={e => setSection(e.target.value)}
      style={{ marginRight: "0.5rem" }}
    >
      <option value="">Select section</option>
      {sectionOptions.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    <button type="button" onClick={onLoadSection}>Load</button>
  </div>
);

export default SectionSelector;
