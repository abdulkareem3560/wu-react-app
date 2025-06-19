import React, {useState, useEffect} from 'react';

const LabelSettings = () => {
  const [currentLanguage, setCurrentLanguage] = useState('');
  const [keyValuePairs, setKeyValuePairs] = useState([["", ""]]);

  const handleLanguageChange = (event) => {
    const language = event.target.value;
    setCurrentLanguage(language);
    if (language) {
      loadResourceBundle(language);
    }
  };

  const loadResourceBundle = async (language) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/load-resource-bundle?lang=${language}`);
      const data = await res.json();
      if (data.success) {
        if (Object.entries(data.content).length === 0) {
          setKeyValuePairs([["", ""]]);
        } else {
          setKeyValuePairs(Object.entries(data.content));
        }
      }
    } catch (error) {
      console.error("Error loading resource bundle:", error);
    }
  };

  const addKeyValuePair = () => {
    setKeyValuePairs([...keyValuePairs, ['', '']]);
  };

  const removeKeyValuePair = (index) => {
    const updatedKeyValuePairs = keyValuePairs.filter((_, i) => i !== index);
    setKeyValuePairs(updatedKeyValuePairs);
  };

  const handleKeyValueChange = (index, key, value) => {
    const updatedKeyValuePairs = [...keyValuePairs];
    updatedKeyValuePairs[index] = [key, value];
    setKeyValuePairs(updatedKeyValuePairs);
  };

  const saveResourceBundle = async () => {
    const data = Object.fromEntries(keyValuePairs.map(([key, value]) => [key.trim(), value.trim()]));
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/save-resource-bundle?lang=${currentLanguage}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        alert('Resource bundle saved successfully.');
      } else {
        alert('Error saving resource bundle.');
      }
    } catch (error) {
      console.error('Error saving resource bundle:', error);
      alert('Resource bundle saved successfully.');
    }
  };

  return (
    <>
      <style>
        {`#root {
    margin: 0;
    font-family: Arial, sans-serif;
    background: #f9f9f9;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}
header {
    background-color: #ffd500;
    color: black;
    display: flex;
    align-items: center;
    padding: 10px 30px;
    font-weight: bold;
    font-size: 20px;
}
header .logo {
    width: 36px;
    height: 36px;
    background: black;
    margin-right: 10px;
    clip-path: polygon(0 0, 100% 0, 100% 50%, 30% 50%, 100% 100%, 0 100%);
}
header .title {
    flex-grow: 1;
}
.profile {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
}
.profile img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
}
nav {
    background: #f5f5f5;
    padding-left: 30px;
    display: flex;
    gap: 30px;
    border-bottom: 1px solid #ccc;
}
nav a {
    text-decoration: none;
    color: #0077cc;
    font-weight: 500;
    padding: 15px 0;
    display: inline-block;
    border-bottom: 3px solid transparent;
}
nav a.active {
    color: black;
    font-weight: 700;
    border-bottom-color: #ffd500;
}
main {
    width: 90%;
    margin: 30px auto;
    padding: 20px;
    flex: 1;
}
h2 {
    font-weight: 600;
    color: #333;
}
.main-section {
    text-align: left;
    background: #ffffff;
    border: 1px solid #ccc;
    border-radius: 6px;
    padding: 0;
    margin-bottom: 40px;
}
.main-section h3 {
    font-weight: 700;
    margin: 0;
    padding: 10px 15px;
    color: #333;
    background: #f0f0f0;
    border-radius: 6px 6px 0 0;
    border-bottom: 1px solid #ccc;
}
.section-content {
    padding: 25px;
}
.form-group {
    margin-bottom: 20px;
}
.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #333;
}
.form-group select {
    width: 300px;
    padding: 10px 12px;
    border-radius: 4px;
    border: 1px solid #bbb;
    font-size: 14px;
    background: white;
    cursor: pointer;
}
.resource-bundle-section {
    background: #ffffff;
    border: 1px solid #ccc;
    border-radius: 6px;
    padding: 0;
    margin-top: 30px;
}
.resource-bundle-section h4 {
    font-weight: 700;
    margin: 0;
    padding: 10px 15px;
    color: #333;
    background: #f0f0f0;
    border-radius: 6px 6px 0 0;
    border-bottom: 1px solid #ccc;
}
.bundle-content {
    padding: 25px;
}
.variable-header {
    display: flex;
    gap: 15px;
    margin-bottom: 15px;
    font-weight: 600;
    color: #333;
}
.variable-header .variable-label {
    flex: 1;
}
.variable-header .value-label {
    flex: 1;
}
.row {
    display: flex;
    gap: 15px;
    margin-bottom: 12px;
    align-items: center;
}
.row input[type="text"] {
    flex: 1;
    padding: 10px 12px;
    border-radius: 4px;
    border: 1px solid #bbb;
    font-size: 14px;
    background: white;
}
.row button.remove-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    color: #4a9eff;
    font-size: 18px;
    padding: 8px;
    transition: color 0.2s;
    border-radius: 4px;
}
.row button.remove-btn:hover {
    color: #0066cc;
    background: rgba(74, 158, 255, 0.1);
}
.actions {
    margin-top: 25px;
    display: flex;
    gap: 15px;
    justify-content: flex-end;
}
.actions button {
    background: black;
    color: #ffd500;
    border: none;
    padding: 10px 20px;
    border-radius: 20px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.2s;
}
.actions button:hover {
    background: #333;
}
.back-home {
    border: 1.5px solid #006aff;
    background: transparent;
    color: #006aff;
    font-weight: 600;
    font-size: 14px;
    border-radius: 20px;
    padding: 6px 16px;
    text-decoration: none;
    cursor: pointer;
}
.back-home:hover {
    background: #e5f0ff;
}
.top-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
}`}
      </style>

      <main>
        <div className="main-section">
          <h3>Manage Resource Bundles</h3>
          <div className="section-content">
            <div className="form-group">
              <label htmlFor="language-selector">Choose a Language</label>
              <select id="language-selector" value={currentLanguage} onChange={handleLanguageChange}>
                <option value="">Select</option>
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="jp">Japanese</option>
              </select>
            </div>

            {currentLanguage && (
              <div className="resource-bundle-section" id="resource-bundle-section">
                <h4>Resource Bundle</h4>
                <div className="bundle-content">
                  <div className="variable-header">
                    <div className="variable-label">Variable</div>
                    <div className="value-label">Value</div>
                    <div style={{width: '40px'}}></div>
                  </div>
                  <div id="key-value-pairs">
                    {keyValuePairs.map((pair, index) => (
                      <div className="row" key={index}>
                        <input
                          type="text"
                          className="key"
                          placeholder="Variable"
                          value={pair[0]}
                          onChange={(e) => handleKeyValueChange(index, e.target.value, pair[1])}
                        />
                        <input
                          type="text"
                          className="value"
                          placeholder="Value"
                          value={pair[1]}
                          onChange={(e) => handleKeyValueChange(index, pair[0], e.target.value)}
                        />
                        <button
                          className="remove-btn"
                          title="Remove variable"
                          onClick={() => removeKeyValuePair(index)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="15px" viewBox="0 0 50 50">
                            <path
                              d="M 21 0 C 19.355469 0 18 1.355469 18 3 L 18 5 L 10.1875 5 C 10.0625 4.976563 9.9375 4.976563 9.8125 5 L 8 5 C 7.96875 5 7.9375 5 7.90625 5 C 7.355469 5.027344 6.925781 5.496094 6.953125 6.046875 C 6.980469 6.597656 7.449219 7.027344 8 7 L 9.09375 7 L 12.6875 47.5 C 12.8125 48.898438 14.003906 50 15.40625 50 L 34.59375 50 C 35.996094 50 37.1875 48.898438 37.3125 47.5 L 40.90625 7 L 42 7 C 42.359375 7.003906 42.695313 6.816406 42.878906 6.503906 C 43.058594 6.191406 43.058594 5.808594 42.878906 5.496094 C 42.695313 5.183594 42.359375 4.996094 42 5 L 32 5 L 32 3 C 32 1.355469 30.644531 0 29 0 Z M 21 2 L 29 2 C 29.5625 2 30 2.4375 30 3 L 30 5 L 20 5 L 20 3 C 20 2.4375 20.4375 2 21 2 Z M 11.09375 7 L 38.90625 7 L 35.3125 47.34375 C 35.28125 47.691406 34.910156 48 34.59375 48 L 15.40625 48 C 15.089844 48 14.71875 47.691406 14.6875 47.34375 Z M 18.90625 9.96875 C 18.863281 9.976563 18.820313 9.988281 18.78125 10 C 18.316406 10.105469 17.988281 10.523438 18 11 L 18 44 C 17.996094 44.359375 18.183594 44.695313 18.496094 44.878906 C 18.808594 45.058594 19.191406 45.058594 19.503906 44.878906 C 19.816406 44.695313 20.003906 44.359375 20 44 L 20 11 C 20.011719 10.710938 19.894531 10.433594 19.6875 10.238281 C 19.476563 10.039063 19.191406 9.941406 18.90625 9.96875 Z M 24.90625 9.96875 C 24.863281 9.976563 24.820313 9.988281 24.78125 10 C 24.316406 10.105469 23.988281 10.523438 24 11 L 24 44 C 23.996094 44.359375 24.183594 44.695313 24.496094 44.878906 C 24.808594 45.058594 25.191406 45.058594 25.503906 44.878906 C 25.816406 44.695313 26.003906 44.359375 26 44 L 26 11 C 26.011719 10.710938 25.894531 10.433594 25.6875 10.238281 C 25.476563 10.039063 25.191406 9.941406 24.90625 9.96875 Z M 30.90625 9.96875 C 30.863281 9.976563 30.820313 9.988281 30.78125 10 C 30.316406 10.105469 29.988281 10.523438 30 11 L 30 44 C 29.996094 44.359375 30.183594 44.695313 30.496094 44.878906 C 30.808594 45.058594 31.191406 45.058594 31.503906 44.878906 C 31.816406 44.695313 32.003906 44.359375 32 44 L 32 11 C 32.011719 10.710938 31.894531 10.433594 31.6875 10.238281 C 31.476563 10.039063 31.191406 9.941406 30.90625 9.96875 Z"></path>
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="actions">
                    <button onClick={addKeyValuePair}>Add New Translation</button>
                    <button onClick={saveResourceBundle}>Save</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default LabelSettings;