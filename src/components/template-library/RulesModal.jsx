import React from 'react';

const RulesModal = ({
                      open, onClose, activeTab, setActiveTab,
                      sectionLogic, setSectionLogic, sectionLogicExpr, setSectionLogicExpr,
                      // ...other props as needed
                    }) => {
  if (!open) return null;
  return (
    <div className="modal" style={{ display: open ? 'flex' : 'none' }} id="ruleModal">
      <div className="modal-content">
        <span className="close-btn" onClick={onClose}>&times;</span>
        <div className="tabs">
          <div
            className={`tab ${activeTab === 'section' ? 'active' : ''}`}
            onClick={() => setActiveTab('section')}
          >
            Section
          </div>
          <div
            className={`tab ${activeTab === 'variables' ? 'active' : ''}`}
            onClick={() => setActiveTab('variables')}
          >
            Variables
          </div>
        </div>
        <div id="section" className={`tab-content ${activeTab === 'section' ? 'active' : ''}`}>
          {/* Section rules UI goes here */}
          <div style={{ marginTop: '10px' }}>
            <label htmlFor="sectionLogicInput">
              <strong>Logic Expression (e.g., 1 OR (2 AND 3))</strong>
            </label>
            <br />
            <input
              id="sectionLogicInput"
              type="text"
              style={{ width: '100%', padding: '4px' }}
              placeholder="Enter logic like 1 OR (2 AND 3)"
              value={sectionLogic}
              onChange={e => setSectionLogic(e.target.value)}
            />
          </div>
          <div style={{ marginTop: '10px' }}>
            <label htmlFor="sectionLogicExpr">
              <strong>Section Logic Expression</strong> (e.g., "1 OR (2 AND 3)"):</label>
            <input
              type="text"
              id="sectionLogicExpr"
              style={{ width: '99%' }}
              value={sectionLogicExpr}
              onChange={e => setSectionLogicExpr(e.target.value)}
            />
          </div>
        </div>
        <div id="variables" className={`tab-content ${activeTab === 'variables' ? 'active' : ''}`}>
          {/* Variables rules UI goes here */}
        </div>
        <button style={{ margin: '10px 0' }}>Save Rules</button>
      </div>
    </div>
  );
};

export default RulesModal;
