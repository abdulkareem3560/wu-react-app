const RuleRow = ({ rule, index, onChange, onDelete }) => {
  return (
    <div className="rule-row">
      <span style={{ marginRight: '8px' }}>{index + 1}. </span>
      <select value={rule.field} onChange={e => onChange(index, 'field', e.target.value)}>
        {['Country', 'Region', 'Customer', 'Agent'].map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <select value={rule.condition} onChange={e => onChange(index, 'condition', e.target.value)}>
        {['Equal to', 'Not equal to', 'Contains', 'Greater than', 'Less than'].map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <input
        type="text"
        value={rule.value}
        onChange={e => onChange(index, 'value', e.target.value)}
      />
      <button type="button" onClick={() => onDelete(index)}>🗑</button>
    </div>
  );
};

const RuleModal = ({
                     visible,
                     activeTab,
                     setActiveTab,
                     rules,
                     setRules,
                     onClose,
                     logicExpression,
                     setLogicExpression,
                     variables,
                     variableTable,
                     handleVariableChange,
                     displayIfExists,
                     handleDisplayToggle,
                     variableLogic,
                     handleLogicChange
                   }) => {
  if (!visible) return null;

  const handleRuleChange = (index, field, value) => {
    const updated = [...rules];
    updated[index][field] = value;
    setRules(updated);
  };

  const addRule = () => {
    setRules([...rules, { field: 'Country', condition: 'Equal to', value: '' }]);
  };

  const deleteRule = (index) => {
    const updated = rules.filter((_, i) => i !== index);
    setRules(updated);
  };

  return (
    <div className="modal" style={{ display: 'flex' }}>
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

        {activeTab === 'section' && (
          <>
            <h3>Section Rules</h3>
            {rules.map((rule, idx) => (
              <RuleRow
                key={idx}
                index={idx}
                rule={rule}
                onChange={handleRuleChange}
                onDelete={deleteRule}
              />
            ))}
            <button onClick={addRule}>+ Add Section Rule</button>

            <div style={{ marginTop: '10px' }}>
              <label>
                <strong>Logic Expression</strong>
              </label>
              <input
                type="text"
                style={{ width: '100%' }}
                value={logicExpression}
                onChange={e => setLogicExpression(e.target.value)}
                placeholder="Enter logic like 1 OR (2 AND 3)"
              />
            </div>

            <button style={{ marginTop: '15px' }} onClick={onClose}>Save Rules</button>
          </>
        )}

        {activeTab === 'variables' && (
          <div className="container-2">
            {variables.map((variable, index) => (
              <div key={variable} style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <strong>{variable}</strong>
                  <label>
                    <input
                      type="checkbox"
                      checked={!!displayIfExists[variable]}
                      onChange={() => handleDisplayToggle(variable)}
                    />
                    Display if value exists
                  </label>
                </div>

                <div style={{ marginTop: '10px' }}>
                  <label>Value:</label>
                  <select
                    value={variableTable[index]?.value || ''}
                    onChange={(e) => handleVariableChange(index, e.target.value)}
                    style={{ marginLeft: '10px' }}
                  >
                    <option value="">-- Select Value --</option>
                    {variables.map((v, idx) => (
                      <option key={idx} value={v}>{v}</option>
                    ))}
                  </select>
                </div>

                <div style={{ marginTop: '10px' }}>
                  <label>Logic Expression:</label>
                  <input
                    type="text"
                    style={{ width: '100%', marginTop: '5px' }}
                    value={variableLogic[variable] || ''}
                    onChange={(e) => handleLogicChange(variable, e.target.value)}
                    placeholder="Enter logic like 1 OR (2 AND 3)"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export { RuleRow, RuleModal };