import React, {useEffect, useState} from 'react';
import {BACKEND_BASE_URL} from "../config.js";
import NavMenu from "../components/NavMenu.jsx";

const DataSettings = () => {
  const [globals, setGlobals] = useState([]);
  const [dataMappings, setDataMappings] = useState([]);

  useEffect(() => {
    loadGlobals();
    loadDataMapping();
  }, []);

  const loadGlobals = async () => {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}globals`);
      const data = await res.json();
      setGlobals(Object.entries(data));
    } catch (error) {
      setGlobals([
        ['callcenter_phno', '1890003889'],
        ['US-CustomerCare', '1800998733'],
        ['colarado', '4782077583'],
      ]);
    }
  };

  const loadDataMapping = async () => {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}datamapping`);
      const data = await res.json();
      setDataMappings(Object.entries(data));
    } catch (error) {
      setDataMappings([
        ['callcenter_phno', '1890003889'],
        ['US-CustomerCare', '1800998733'],
        ['colarado', '4782077583'],
      ]);
    }
  };

  const handleSaveGlobals = async () => {
    const globalsData = globals.reduce((acc, [key, value]) => {
      if (key.trim()) {
        acc[key] = value.trim();
      }
      return acc;
    }, {});

    try {
      await fetch(`${BACKEND_BASE_URL}globals`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(globalsData),
      });
      alert('Globals saved successfully');
    } catch (err) {
      alert('Failed to save globals');
    }
  };

  const handleSaveDataMapping = async () => {
    const mappingsData = dataMappings.reduce((acc, [key, value]) => {
      if (key.trim()) {
        acc[key] = value.trim();
      }
      return acc;
    }, {});

    try {
      await fetch(`${BACKEND_BASE_URL}datamapping`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(mappingsData),
      });
      alert('Data mapping saved successfully');
    } catch (err) {
      alert('Failed to save data mapping');
    }
  };

  const addGlobalRow = () => {
    setGlobals([...globals, ['', '']]);
  };

  const addDataMappingRow = () => {
    setDataMappings([...dataMappings, ['', '']]);
  };

  const handleGlobalChange = (index, field, value) => {
    const updatedGlobals = [...globals];
    updatedGlobals[index][field] = value;
    setGlobals(updatedGlobals);
  };

  const handleDataMappingChange = (index, field, value) => {
    const updatedMappings = [...dataMappings];
    updatedMappings[index][field] = value;
    setDataMappings(updatedMappings);
  };

  return (
    <>
      <style>
        {`
          body {
            margin: 0;
            font-family: Arial, sans-serif;
            background: #f9f9f9;
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
        main {
            max-width: 900px;
            margin: 30px auto;
            padding: 0 20px;
        }
        h2 {
            margin-bottom: 20px;
            font-weight: 600;
            color: #333;
        }
        section {
            background: #ffffff;
            border: 1px solid #ccc;
            border-radius: 6px;
            padding: 0;
            margin-bottom: 40px;
        }
        section h3 {
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
            font-size: 14px;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        .actions button:hover {
            background: #333;
        }
        footer {
            background: black;
            color: white;
            text-align: center;
            padding: 15px 0;
            margin-top: auto;
            font-size: 14px;
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
        .top-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
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
        `}
      </style>
      <NavMenu activeItem={2} />

      <main>
        <div className="top-row">
          <h2>Data Settings</h2>
          <a href="admin" className="back-home">Back to Home</a>
        </div>

        <section id="globalVariablesSection">
          <h3>Global Variables</h3>
          <div className="section-content">
            <div className="variable-header">
              <div className="variable-label">Variable</div>
              <div className="value-label">Value</div>
              <div style={{width: '40px'}}></div>
            </div>
            {globals.map((row, index) => (
              <div className="row" key={index}>
                <input
                  type="text"
                  placeholder="Variable"
                  value={row[0]}
                  onChange={(e) => handleGlobalChange(index, 0, e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={row[1]}
                  onChange={(e) => handleGlobalChange(index, 1, e.target.value)}
                />
                <button
                  className="remove-btn"
                  onClick={() => setGlobals(globals.filter((_, i) => i !== index))}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="15px" viewBox="0 0 50 50">
                    <path
                      d="M 21 0 C 19.355469 0 18 1.355469 18 3 L 18 5 L 10.1875 5 C 10.0625 4.976563 9.9375 4.976563 9.8125 5 L 8 5 C 7.96875 5 7.9375 5 7.90625 5 C 7.355469 5.027344 6.925781 5.496094 6.953125 6.046875 C 6.980469 6.597656 7.449219 7.027344 8 7 L 9.09375 7 L 12.6875 47.5 C 12.8125 48.898438 14.003906 50 15.40625 50 L 34.59375 50 C 35.996094 50 37.1875 48.898438 37.3125 47.5 L 40.90625 7 L 42 7 C 42.359375 7.003906 42.695313 6.816406 42.878906 6.503906 C 43.058594 6.191406 43.058594 5.808594 42.878906 5.496094 C 42.695313 5.183594 42.359375 4.996094 42 5 L 32 5 L 32 3 C 32 1.355469 30.644531 0 29 0 Z M 21 2 L 29 2 C 29.5625 2 30 2.4375 30 3 L 30 5 L 20 5 L 20 3 C 20 2.4375 20.4375 2 21 2 Z M 11.09375 7 L 38.90625 7 L 35.3125 47.34375 C 35.28125 47.691406 34.910156 48 34.59375 48 L 15.40625 48 C 15.089844 48 14.71875 47.691406 14.6875 47.34375 Z M 18.90625 9.96875 C 18.863281 9.976563 18.820313 9.988281 18.78125 10 C 18.316406 10.105469 17.988281 10.523438 18 11 L 18 44 C 17.996094 44.359375 18.183594 44.695313 18.496094 44.878906 C 18.808594 45.058594 19.191406 45.058594 19.503906 44.878906 C 19.816406 44.695313 20.003906 44.359375 20 44 L 20 11 C 20.011719 10.710938 19.894531 10.433594 19.6875 10.238281 C 19.476563 10.039063 19.191406 9.941406 18.90625 9.96875 Z M 24.90625 9.96875 C 24.863281 9.976563 24.820313 9.988281 24.78125 10 C 24.316406 10.105469 23.988281 10.523438 24 11 L 24 44 C 23.996094 44.359375 24.183594 44.695313 24.496094 44.878906 C 24.808594 45.058594 25.191406 45.058594 25.503906 44.878906 C 25.816406 44.695313 26.003906 44.359375 26 44 L 26 11 C 26.011719 10.710938 25.894531 10.433594 25.6875 10.238281 C 25.476563 10.039063 25.191406 9.941406 24.90625 9.96875 Z M 30.90625 9.96875 C 30.863281 9.976563 30.820313 9.988281 30.78125 10 C 30.316406 10.105469 29.988281 10.523438 30 11 L 30 44 C 29.996094 44.359375 30.183594 44.695313 30.496094 44.878906 C 30.808594 45.058594 31.191406 45.058594 31.503906 44.878906 C 31.816406 44.695313 32.003906 44.359375 32 44 L 32 11 C 32.011719 10.710938 31.894531 10.433594 31.6875 10.238281 C 31.476563 10.039063 31.191406 9.941406 30.90625 9.96875 Z"></path>
                  </svg>
                </button>
              </div>
            ))}
            <div className="actions">
              <button onClick={addGlobalRow}>Add Variable</button>
              <button onClick={handleSaveGlobals}>Save</button>
            </div>
          </div>
        </section>

        <section id="dataMappingSection">
          <h3>Data Mapping</h3>
          <div className="section-content">
            <div className="variable-header">
              <div className="variable-label">Variable</div>
              <div className="value-label">Value</div>
              <div style={{width: '40px'}}></div>
            </div>
            {dataMappings.map((row, index) => (
              <div className="row" key={index}>
                <input
                  type="text"
                  placeholder="Variable"
                  value={row[0]}
                  onChange={(e) => handleDataMappingChange(index, 0, e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={row[1]}
                  onChange={(e) => handleDataMappingChange(index, 1, e.target.value)}
                />
                <button
                  className="remove-btn"
                  onClick={() => setDataMappings(dataMappings.filter((_, i) => i !== index))}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="15px" viewBox="0 0 50 50">
                    <path
                      d="M 21 0 C 19.355469 0 18 1.355469 18 3 L 18 5 L 10.1875 5 C 10.0625 4.976563 9.9375 4.976563 9.8125 5 L 8 5 C 7.96875 5 7.9375 5 7.90625 5 C 7.355469 5.027344 6.925781 5.496094 6.953125 6.046875 C 6.980469 6.597656 7.449219 7.027344 8 7 L 9.09375 7 L 12.6875 47.5 C 12.8125 48.898438 14.003906 50 15.40625 50 L 34.59375 50 C 35.996094 50 37.1875 48.898438 37.3125 47.5 L 40.90625 7 L 42 7 C 42.359375 7.003906 42.695313 6.816406 42.878906 6.503906 C 43.058594 6.191406 43.058594 5.808594 42.878906 5.496094 C 42.695313 5.183594 42.359375 4.996094 42 5 L 32 5 L 32 3 C 32 1.355469 30.644531 0 29 0 Z M 21 2 L 29 2 C 29.5625 2 30 2.4375 30 3 L 30 5 L 20 5 L 20 3 C 20 2.4375 20.4375 2 21 2 Z M 11.09375 7 L 38.90625 7 L 35.3125 47.34375 C 35.28125 47.691406 34.910156 48 34.59375 48 L 15.40625 48 C 15.089844 48 14.71875 47.691406 14.6875 47.34375 Z M 18.90625 9.96875 C 18.863281 9.976563 18.820313 9.988281 18.78125 10 C 18.316406 10.105469 17.988281 10.523438 18 11 L 18 44 C 17.996094 44.359375 18.183594 44.695313 18.496094 44.878906 C 18.808594 45.058594 19.191406 45.058594 19.503906 44.878906 C 19.816406 44.695313 20.003906 44.359375 20 44 L 20 11 C 20.011719 10.710938 19.894531 10.433594 19.6875 10.238281 C 19.476563 10.039063 19.191406 9.941406 18.90625 9.96875 Z M 24.90625 9.96875 C 24.863281 9.976563 24.820313 9.988281 24.78125 10 C 24.316406 10.105469 23.988281 10.523438 24 11 L 24 44 C 23.996094 44.359375 24.183594 44.695313 24.496094 44.878906 C 24.808594 45.058594 25.191406 45.058594 25.503906 44.878906 C 25.816406 44.695313 26.003906 44.359375 26 44 L 26 11 C 26.011719 10.710938 25.894531 10.433594 25.6875 10.238281 C 25.476563 10.039063 25.191406 9.941406 24.90625 9.96875 Z M 30.90625 9.96875 C 30.863281 9.976563 30.820313 9.988281 30.78125 10 C 30.316406 10.105469 29.988281 10.523438 30 11 L 30 44 C 29.996094 44.359375 30.183594 44.695313 30.496094 44.878906 C 30.808594 45.058594 31.191406 45.058594 31.503906 44.878906 C 31.816406 44.695313 32.003906 44.359375 32 44 L 32 11 C 32.011719 10.710938 31.894531 10.433594 31.6875 10.238281 C 31.476563 10.039063 31.191406 9.941406 30.90625 9.96875 Z"></path>
                  </svg>
                </button>
              </div>
            ))}
            <div className="actions">
              <button onClick={addDataMappingRow}>Add Mapping</button>
              <button onClick={handleSaveDataMapping}>Save</button>
            </div>
          </div>
        </section>
      </main>

      <footer>© 2025 Western Union Holdings, Inc. All Rights Reserved</footer>
    </>
  );
};

export default DataSettings;
