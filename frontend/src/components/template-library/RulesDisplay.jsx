import React from 'react';

const RulesDisplay = ({ section, openRuleModalForSection, savedRules }) => (
  <div className="rules-box" id="savedRulesDisplay">
    <h3>Rules</h3>
    <div id="savedSectionRules">
      {/* You can render section rules here using savedRules prop */}
    </div>
    <div id="savedVariableRules">
      {/* You can render variable rules here using savedRules prop */}
    </div>
    <button
      style={{ alignSelf: "flex-end", margin: "10px 0" }}
      onClick={() => openRuleModalForSection(section)}
      id="addRuleBtn"
    >
      Edit Rules
    </button>
  </div>
);

export default RulesDisplay;
