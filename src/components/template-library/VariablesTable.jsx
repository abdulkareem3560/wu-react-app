import React from 'react';

const VariablesTable = ({
                          variables, variableTable, handleVariableChange,
                          handleExtractVariables, handleSaveWithReplacedVariables
                        }) => (
  <div className="variables-box">
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
      <h3 style={{ margin: 0 }}>Variables</h3>
      <button onClick={handleExtractVariables}>Extract Variables</button>
    </div>
    <table id="variableTable" style={{ width: "100%" }}>
      <thead>
      <tr>
        <th>Variable</th>
        <th>Value</th>
      </tr>
      </thead>
      <tbody>
      {variableTable.map((row, index) => (
        <tr key={index}>
          <td>{row.variable}</td>
          <td>
            <select
              value={row.value}
              onChange={e => handleVariableChange(index, e.target.value)}
            >
              <option value="">-- Select Value --</option>
              {variables.map((varValue, idx) => (
                <option key={idx} value={varValue}>{varValue}</option>
              ))}
            </select>
          </td>
        </tr>
      ))}
      </tbody>
    </table>
    <div style={{ alignSelf: "flex-end", margin: "10px 0" }}>
      <button onClick={handleSaveWithReplacedVariables}>Save Section</button>
    </div>
  </div>
);

export default VariablesTable;
