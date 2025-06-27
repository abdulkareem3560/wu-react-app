import React, {useState, useRef, useEffect, useCallback} from 'react';
import html2canvas from 'html2canvas';
import NavMenu from "../components/NavMenu.jsx";

const GRID_SIZE = 10;
const DEFAULT_OBJECT = {
  width: 323,
  height: 70,
  label: 'Text',
  align: 'left',
  x: 100,
  y: 100,
};

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

const LayoutLibraryAdminPortal = () => {
  // State declarations
  const [layoutObjects, setLayoutObjects] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [isGridShown, setIsGridShown] = useState(true);
  const [layoutName, setLayoutName] = useState('');
  const [propWidth, setPropWidth] = useState('');
  const [propHeight, setPropHeight] = useState('');
  const [propLabel, setPropLabel] = useState('');
  const [propAlign, setPropAlign] = useState('left');
  const [layoutRegion, setLayoutRegion] = useState('');
  const [clipboardObject, setClipboardObject] = useState(null);
  const [fixedSections, setFixedSections] = useState([]);

  const canvasRef = useRef(null);

  const getLabel = (index) => {
    switch (index) {
      case 1:
        return `Section ${index} (Header)`
      case 20:
        return `Section ${index} (Footer)`
      default:
        return `Section ${index}`
    }
  }

  // Save state for undo/redo
  const saveState = useCallback(() => {
    setUndoStack(stack => [...stack, deepClone(layoutObjects)]);
    setRedoStack([]);
  }, [layoutObjects]);

  const fixedSectionOptions = Array.from({length: 30}, (_, i) => ({
    label: getLabel(i),
    value: i + 1
  }));

  // Handler for adding a fixed section
  const handleAddFixedSection = (e) => {
    const value = Number(e.target.value);
    if (!value) return;
    if (!fixedSections.includes(value)) {
      setFixedSections(prev => [...prev, value]);
    }
  };

// Handler for deleting a fixed section
  const handleDeleteFixedSection = (sectionValue) => {
    setFixedSections(prev => prev.filter(val => val !== sectionValue));
  };

  // Undo/redo functionality
  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;
    setRedoStack(stack => [...stack, deepClone(layoutObjects)]);
    const prev = undoStack[undoStack.length - 1];
    setLayoutObjects(deepClone(prev));
    setUndoStack(stack => stack.slice(0, -1));
    setSelectedId(null);
  }, [layoutObjects, undoStack]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    setUndoStack(stack => [...stack, deepClone(layoutObjects)]);
    const next = redoStack[redoStack.length - 1];
    setLayoutObjects(deepClone(next));
    setRedoStack(stack => stack.slice(0, -1));
    setSelectedId(null);
  }, [layoutObjects, redoStack]);

  // Object manipulation
// When adding a new object, default fixedSection to null
  const addObject = useCallback((x = 100, y = 100, data = {}) => {
    saveState();
    setLayoutObjects(objs => [
      ...objs,
      {
        id: Date.now() + Math.random(),
        x, y,
        ...DEFAULT_OBJECT,
        fixedSection: null, // <-- new property
        ...data,
      },
    ]);
  }, [saveState]);


  const updateObject = useCallback((id, updates) => {
    setLayoutObjects(objs =>
      objs.map(obj => obj.id === id ? {...obj, ...updates} : obj)
    );
  }, []);

  const removeObject = useCallback((id) => {
    saveState();
    setLayoutObjects(objs => objs.filter(obj => obj.id !== id));
    setSelectedId(null);
  }, [saveState]);

  // Event handlers
  const handleDrop = useCallback(e => {
    e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    addObject(x, y);
  }, [addObject]);

  const handleDragStart = useCallback(e => {
    e.dataTransfer.setData("text/plain", "Section");
  }, []);

  const selectObject = useCallback(id => {
    setSelectedId(id);
    const obj = layoutObjects.find(o => o.id === id);
    if (obj) {
      setPropWidth(obj.width);
      setPropHeight(obj.height);
      setPropLabel(obj.label);
      setPropAlign(obj.align);
    }
  }, [layoutObjects]);

  // Property handlers
  const handlePropWidthChange = useCallback(e => {
    setPropWidth(e.target.value);
    if (selectedId) updateObject(selectedId, {width: Number(e.target.value)});
  }, [selectedId, updateObject]);

  const handlePropHeightChange = useCallback(e => {
    setPropHeight(e.target.value);
    if (selectedId) updateObject(selectedId, {height: Number(e.target.value)});
  }, [selectedId, updateObject]);

  const handlePropLabelChange = useCallback(e => {
    setPropLabel(e.target.value);
    if (selectedId) updateObject(selectedId, {label: e.target.value});
  }, [selectedId, updateObject]);

  const handlePropAlignChange = useCallback(e => {
    setPropAlign(e.target.value);
    if (selectedId) updateObject(selectedId, {align: e.target.value});
  }, [selectedId, updateObject]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = e => {
      // Arrow keys movement
      if (selectedId) {
        const obj = layoutObjects.find(o => o.id === selectedId);
        if (obj) {
          let dx = 0, dy = 0;
          if (e.key === "ArrowUp") dy = -GRID_SIZE;
          if (e.key === "ArrowDown") dy = GRID_SIZE;
          if (e.key === "ArrowLeft") dx = -GRID_SIZE;
          if (e.key === "ArrowRight") dx = GRID_SIZE;

          if (dx || dy) {
            saveState();
            updateObject(selectedId, {
              x: obj.x + dx,
              y: obj.y + dy,
            });
            e.preventDefault();
          }
        }
      }

      // Delete key
      if (e.key === "Delete" && selectedId) {
        removeObject(selectedId);
        e.preventDefault();
      }

      // Copy/paste
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "c" && selectedId) {
        const obj = layoutObjects.find(o => o.id === selectedId);
        if (obj) setClipboardObject({...obj});
        e.preventDefault();
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "v" && clipboardObject) {
        saveState();
        const newObj = {
          ...clipboardObject,
          id: Date.now() + Math.random(),
          x: clipboardObject.x + 20,
          y: clipboardObject.y + 20,
        };
        setLayoutObjects(objs => [...objs, newObj]);
        setSelectedId(newObj.id);
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId, layoutObjects, clipboardObject, saveState, updateObject, removeObject]);

  // Add this useEffect to dynamically adjust canvas size
  useEffect(() => {
    if (!canvasRef.current || layoutObjects.length === 0) return;

    let maxRight = 0;
    let maxBottom = 0;

    layoutObjects.forEach(obj => {
      const right = obj.x + obj.width;
      const bottom = obj.y + obj.height;
      if (right > maxRight) maxRight = right;
      if (bottom > maxBottom) maxBottom = bottom;
    });

    // Add 40px padding
    const newWidth = Math.max(900, maxRight + 40);
    const newHeight = Math.max(600, maxBottom + 40);

    canvasRef.current.style.width = `${newWidth}px`;
    canvasRef.current.style.height = `${newHeight}px`;
  }, [layoutObjects]);

  // Save layout functionality
  const handleSaveLayout = useCallback(async () => {
    // Adjust canvas size to fit all objects
    const canvasNode = canvasRef.current;
    if (!canvasNode) return;

    // Calculate required canvas size
    let maxRight = 0, maxBottom = 0;
    layoutObjects.forEach(obj => {
      const right = obj.x + obj.width;
      const bottom = obj.y + obj.height;
      if (right > maxRight) maxRight = right;
      if (bottom > maxBottom) maxBottom = bottom;
    });

    const padding = 40;
    const requiredWidth = maxRight + padding;
    const requiredHeight = maxBottom + padding;

    // Temporarily set canvas size
    const originalStyle = {
      width: canvasNode.style.width,
      height: canvasNode.style.height,
    };
    canvasNode.style.width = `${requiredWidth}px`;
    canvasNode.style.height = `${requiredHeight}px`;

    canvasNode.classList.add('export-mode');

    try {
      // Capture image
      const canvasImage = await html2canvas(canvasNode, {
        backgroundColor: "#fff",
        scrollX: 0,
        scrollY: 0,
        width: requiredWidth,
        height: requiredHeight,
        scale: 2,
        useCORS: true,
      });

      // Generate HTML
      const imageData = canvasImage.toDataURL("image/png");
      const layoutHTML = generateLayoutHTML();
      const filenameBase = `${layoutName || 'default'}_${layoutRegion || 'region'}`;

      // Send to backend
      await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/save-layout`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          imageData,
          layoutHTML,
          filename: filenameBase,
        }),
      }).then(res => res.text()).then(alert).catch(err => alert("Save failed: " + err));
    } catch (err) {
      alert("Failed to save layout: " + err.message);
    } finally {
      // Restore UI
      canvasNode.classList.remove('export-mode');
      canvasNode.style.width = originalStyle.width;
      canvasNode.style.height = originalStyle.height;
    }
  }, [layoutObjects, layoutName, layoutRegion, fixedSections]);

  const generateLayoutHTML = () => {
    let layoutHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Layout</title>
  <link rel="stylesheet" href="../styles1.css">
  <style>
    body {
      margin: 0;
      padding-top: 60px;
    }
    #header {
      background-color: #f8f8f8;
      padding: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #ccc;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
    }
    #header button {
      padding: 10px 16px;
      font-size: 16px;
      background-color: black;
      color: #ffd400;
      font-weight: 600;
      border: none;
      padding: 8px 20px;
      border-radius: 20px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }
    #canvas-container {
      position: relative;
      flex-grow: 1;
      padding: 20px;
      margin-top: 20px;
    }
    .canvas-object {
      border-radius: 8px;
      position: relative;
      border: 2px solid #42a5f5;
      padding: 10px;
      box-sizing: border-box;
      min-width: 323px;
      min-height: 60px;
      overflow: hidden;
      transition: height 0.3s ease;
    }
    .dropdown-content {
      display: none;
      margin-top: 10px;
      padding: 10px;
      background: #f0f0f0;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    .dropdown-content p {
      color: #333;
    }
    .popup {
      display: none;
      position: fixed;
      z-index: 1000;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.6);
      justify-content: center;
      align-items: center;
    }
    .popup-content {
      background: #fff;
      border-radius: 10px;
      width: 80%;
      max-height: 80vh;
      overflow-y: auto;
    }
    .preview-heading {
      text-align: center;
      margin-bottom: 20px;
    }
    #previewContent {
      border: 1px solid black;
      width: fit-content;
      margin: 20px auto;
      padding: 0 5px;
    }
    .checkbox-container {
      display: flex;
      align-items: center;
    }
    .checkbox-container input[type="checkbox"] {
      margin-right: 4px;
    }
    label {
      cursor: pointer;
    }
    .modal {
      display: none;
      position: fixed;
      z-index: 1000;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.6);
      justify-content: center;
      align-items: center;
    }
    .modal-content {
      background: #fff;
      padding: 20px;
      border-radius: 10px;
      width: 800px;
      max-height: 80vh;
      overflow-y: auto;
    }
    .tabs {
      display: flex;
      border-bottom: 1px solid #ccc;
      margin-bottom: 1rem;
    }
    .tab {
      padding: 10px 20px;
      cursor: pointer;
      border: 1px solid #ccc;
      border-bottom: none;
      background-color: #eee;
      margin-right: 5px;
      border-radius: 8px 8px 0 0;
    }
    .tab.active {
      background-color: #fff;
      font-weight: bold;
    }
    .tab-content {
      display: none;
    }
    .tab-content.active {
      display: block;
    }
    .rule-row {
      display: flex;
      gap: 10px;
      margin-bottom: 10px;
      align-items: center;
    }
    .close-btn {
      float: right;
      cursor: pointer;
      font-weight: bold;
      font-size: 18px;
    }
    .saved-rules {
      margin-top: 30px;
    }
    .rule-section {
      margin-top: 20px;
    }
    .rule-text {
      margin-left: 20px;
      margin-bottom: 5px;
    }
    .toolbar button {
      margin-right: 5px;
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
    .deleteSectionBtn {
      display: none;
    }
    .canvas-object:hover .deleteSectionBtn {
      display: block;
    }
    .fixed-canvas-object {
      background: #fff8dc;
      border: 2px solid #f7b500;
      z-index: 10;
    }
  </style>
</head>
<body>
  <div id="header">
    <div style="width: 54%; text-align: end">
      <button id="previewButton" onclick="showPreview()">Preview</button>
    </div>
    <div style="margin-right: 35px">
      <button id="addLayoutSectionBtn">+ Add layout section</button>
    </div>
  </div>
  <div class="modal" id="ruleModal">
     <div class="modal-content">
    <span class="close-btn" onclick="closeModal()">&times;</span>
    <div class="tabs">
      <div class="tab active" onclick="switchTab('section')">Section</div>
      <div class="tab" onclick="switchTab('variables')">Variables</div>
    </div>
    <div id="section" class="tab-content active">
      <div id="sectionRulesContainer"></div>
      <div id="sectionRulesWrapper"></div>
      <button onclick="addSectionRule()">+ Add Section Rule</button>
      <div style="margin-top: 10px">
        <label for="sectionLogicInput"><strong>Logic Expression (e.g., 1 OR (2 AND 3))</strong></label><br />
        <input
          id="sectionLogicInput"
          type="text"
          style="width: 99%; padding: 4px"
          placeholder="Enter logic like 1 OR (2 AND 3)"
        />
      </div>
      <div style="margin-top: 10px">
        <label for="sectionLogicExpr"><strong>Section Logic Expression</strong> (e.g., "1 OR (2 AND 3)"):</label>
        <input type="text" id="sectionLogicExpr" style="width: 99%" />
      </div>
    </div>
    <div id="variables" class="tab-content">
      <div id="variableRulesContainer"></div>
    </div>
    <button style="margin: 10px 0" onclick="saveRules()">Save Rules</button>
  </div>
  </div>
  <div id="canvas-container">
`;

    // Render all dropped objects, fixed or not
    layoutObjects.forEach((obj, index) => {
      const uniqueId = `canvas-object-${index}`;
      const left = typeof obj.x === "number" ? `${obj.x}px` : obj.x;
      const top = typeof obj.y === "number" ? `${obj.y}px` : obj.y;
      const width = typeof obj.width === "number" ? `${obj.width}px` : obj.width;
      const height = typeof obj.height === "number" ? `${obj.height}px` : obj.height;
      const label = obj.label || "";

      if (obj.fixedSection) {
        // Fixed section rendering
        layoutHTML += `
      <div class="canvas-object fixed-canvas-object"
           id="fixed-canvas-object-${obj.fixedSection}"
           style="position: absolute; left: ${left}; top: ${top}; width: ${width}; min-height: ${height};">
        <div style="display:flex; justify-content: space-between;">
          <select disabled style="width:fit-content;">
            <option value="${obj.fixedSection}" selected>Section ${obj.fixedSection}</option>
          </select>
          <div style="background: #c2e2fc; border: 1px solid #6db6f8; height: fit-content; border-radius: 5px; padding:3px 7px;">
            <p style="margin: 0"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
               class="lucide lucide-pin-icon lucide-pin">
            <path d="M12 17v5"/>
            <path
              d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/>
          </svg></p>
          </div>
        </div>
        <div class="dropdown-content" id="content-for-fixed-object-section-${obj.fixedSection}" style="display: block;"></div>
      </div>
      `;
      } else {
        // Regular selectable section rendering
        let dropdownHTML = `<div style="display:flex; justify-content: space-between;"><select id="sectionSelect" onchange="showContent(this, '${uniqueId}')" style="width:fit-content;">
        <option value="">-- Select --</option>`;
        for (let i = 1; i <= 30; i++) {
          dropdownHTML += `<option value="${i}">Section ${i}</option>`;
        }
        dropdownHTML += `</select>
      <button
        style="align-self: flex-start; margin:0; padding:8px 12px; position: relative; cursor: pointer;"
        class="addRuleBtn"
        title="Edit Rule"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2L14 4.793 13.207 5.586 10.414 2.793 11.207 2zm1.586 3L12 4.793 3 13.793V14h.207L13.793 5z"/>
        </svg>
      </button>
      </div>`;

        let dropdownContentHTML = "";
        for (let i = 1; i <= 30; i++) {
          const content = `<p><strong>Dummy Content for ${label} - Option ${i}:</strong> This is the content for option ${i}.</p>
          <p>Additional information or content for this option can be added here.</p>`;
          dropdownContentHTML += `
          <div class="dropdown-content" id="content-for-${uniqueId}-option-${i}" style="display: none;">
            ${content}
          </div>
        `;
        }

        layoutHTML += `
        <div class="canvas-object" id="${uniqueId}" style="position: absolute; left: ${left}; top: ${top}; width: ${width}; min-height: ${height};">
          ${dropdownHTML}
          ${dropdownContentHTML}
        </div>
      `;
      }
    });

    layoutHTML += `
    </div>
    <div id="popup" class="popup">
      <div class="popup-content">
        <h2 class="preview-heading">Preview</h2>
        <div id="previewContent"></div>
        <div class="close-button-container">
          <button onclick="closePopup()" style="margin: 10px 0">Close</button>
        </div>
      </div>
    </div>
    <script src="../doc1.js"></script>
</body>
</html>
`;
    return layoutHTML;
  };
  // Render
  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }
        body {
          margin: 0;
          font-family: "Arial", sans-serif;
          background: #fff;
          height: 100vh;
          display: flex;
          flex-direction: column;
        }
        header {
          background: #ffd400;
          color: #000;
          display: flex;
          align-items: center;
          padding: 12px 24px;
          font-weight: 700;
          font-size: 20px;
        }
        header .logo {
          font-weight: 900;
          font-size: 30px;
          margin-right: 12px;
          color: #000;
        }
        header .user-profile {
          margin-left: auto;
          display: flex;
          align-items: center;
          cursor: pointer;
          font-weight: 600;
        }
        header .user-profile img {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          margin-right: 8px;
          object-fit: cover;
        }
        .container {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 20px 24px;
          gap: 16px;
        }
        .top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }
        .top-row h1 {
          font-weight: 700;
          font-size: 22px;
          margin: 0;
          user-select: none;
        }
        .controls {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        button {
          background: transparent;
          border: none;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          padding: 6px 14px;
          border-radius: 20px;
          color: #0a56ca;
          transition: background-color 0.15s ease;
        }
        button:hover {
          background: #e3ebfc;
        }
        button.undo,
        button.redo {
          background: #e6f0ff;
          color: #0a56ca;
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 700;
          font-size: 14px;
          padding: 8px 12px;
        }
        button.undo:hover,
        button.redo:hover {
          background: #c6d8ff;
        }
        button.save-layout {
          position: fixed;
          right: 55px;
          z-index: 1000;
          bottom: 16px;
          background: #1e1e1e;
          color: #ffd400;
          padding: 10px 24px;
          font-weight: 700;
          border-radius: 24px;
          box-shadow: 0 0 6px rgba(255, 212, 0, 0.7);
        }
        button.save-layout:hover {
          background: #333;
        }
        button.back-home {
          background: #eaf3ff;
          color: #0a56ca;
          font-weight: 600;
          padding: 10px 24px;
          border-radius: 24px;
          box-shadow: none;
          cursor: pointer;
        }
        button.back-home:hover {
          background: #c6d8ff;
        }
        .workspace {
          display: flex;
          gap: 16px;
          flex-grow: 1;
          background: #f9f9f9;
          border: 1.3px solid rgb(206, 205, 205);
          border-radius: 12px;
          padding: 24px 20px;
          box-shadow: 0 0 8px rgb(0 0 0 / 0.05);
          min-height: 400px;
        }
        .sidebar {
          width: 280px;
          background: #f2f2f2;
          border-radius: 8px;
          padding: 24px 20px;
          display: flex;
          flex-direction: column;
        }
        .sidebar .section-btn {
          background: #1e1e1e;
          color: #ffd400;
          font-weight: 600;
          border-radius: 20px;
          padding: 8px 20px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          cursor: grab;
          user-select: none;
          margin-bottom: 8px;
          width: fit-content;
        }
        .sidebar .section-btn svg {
          width: 16px;
          height: 16px;
          fill: #ffd400;
        }
        .sidebar h2 {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 16px;
          color: #000;
        }
        .sidebar label {
          font-weight: 600;
          font-size: 14px;
          margin-bottom: 4px;
          display: block;
          color: #444;
        }
        .sidebar input[type="text"],
        .sidebar input[type="number"],
        .sidebar select {
          width: 100%;
          padding: 8px 12px;
          border-radius: 6px;
          border: 1px solid #ccc;
          font-size: 14px;
          margin-bottom: 16px;
          outline-offset: 2px;
          outline-color: transparent;
          transition: outline-color 0.2s ease;
        }
        .sidebar input[type="text"]:focus,
        .sidebar input[type="number"]:focus,
        .sidebar select:focus {
          outline-color: #ffd400;
          border-color: #ffd400;
        }
        #canvas-container {
          position: relative;
          background: #fff;
          border: 1px solid #ccc;
          border-radius: 8px;
          flex-grow: 1;
          min-height: 400px;
          outline: none;
        }
        #canvas {
          position: relative;
          min-width: 100px;
          min-height: 100px;
          background-image: ${isGridShown ? 'linear-gradient(to right, #ddd 1px, transparent 1px), linear-gradient(to bottom, #ddd 1px, transparent 1px)' : 'none'};
          background-size: 20px 20px;
        }
        .canvas-object {
          position: absolute;
          background: #90caf9;
          border: 1px solid #42a5f5;
          border-radius: 4px;
          cursor: move;
          padding: 10px;
          box-sizing: border-box;
          min-width: 323px;
          min-height: 60px;
          transition: height 0.3s ease;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .canvas-object .object-text {
            margin-top: 18px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .resizer {
            width: 10px;
            height: 10px;
            background: #ff9800;
            position: absolute;
            bottom: 0;
            right: 0;
            cursor: se-resize;
            border-radius: 0 0 4px 0;
        }
        .selected {
          box-shadow: 0 0 0 2px #ff9800;
        }
        #toggle-grid {
          cursor: pointer;
        }
        footer {
          text-align: center;
          font-size: 13px;
          color: #666;
          padding: 12px 0;
          border-top: 1px solid #eee;
          user-select: none;
        }
        h4 {
          margin: 0 0  10px 8px;
        }
        .export-mode select,
        .export-mode .fixed-remove-btn {
          display: none !important;
        }
      `}</style>
      <NavMenu activeItem={0}/>
      <div className="container">
        <div className="top-row">
          <h1>Layout Library</h1>
          <div className="controls">
            <button className="undo" onClick={handleUndo} disabled={!undoStack.length}>↩ Undo</button>
            <button className="redo" onClick={handleRedo} disabled={!redoStack.length}>↪ Redo</button>
            <button className="save-layout" onClick={handleSaveLayout}>Save Layout</button>
            <label>
              <input
                type="checkbox"
                checked={isGridShown}
                onChange={() => setIsGridShown(g => !g)}
              /> Show Grid
            </label>
            <button className="back-home" onClick={() => window.location.href = '/admin'}>⬅ Back to Home</button>
          </div>
        </div>
        <div className="workspace">
          <aside className="sidebar">
            <h4>Drag & Drop to create layout</h4>
            <div
              style={{
                width: "235px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                cursor: "grab",
              }}
              className="section-btn"
              draggable="true"
              onDragStart={handleDragStart}
              data-type="Section"
              tabIndex="0"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Section icon with plus"
              >
                <path
                  d="M3 7V3H7"
                  stroke="yellow"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17 3H21V7"
                  stroke="yellow"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3 17V21H7"
                  stroke="yellow"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17 21H21V17"
                  stroke="yellow"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 8V16"
                  stroke="yellow"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M8 12H16"
                  stroke="yellow"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              Section
            </div>
            <h2>Properties</h2>
            <label>Layout Name</label>
            <input type="text" value={layoutName} onChange={e => setLayoutName(e.target.value)}/>
            {/*<label>Add Fixed Sections</label>*/}
            {/*<div style={{marginBottom: "16px"}}>*/}
            {/*  <select value="" onChange={handleAddFixedSection} style={{margin: 0}}>*/}
            {/*    <option value="">Select Section</option>*/}
            {/*    {fixedSectionOptions.map(opt => (*/}
            {/*      <option*/}
            {/*        key={opt.value}*/}
            {/*        value={opt.value}*/}
            {/*        disabled={fixedSections.includes(opt.value)}*/}
            {/*      >*/}
            {/*        {opt.label}*/}
            {/*      </option>*/}
            {/*    ))}*/}
            {/*  </select>*/}
            {/*  {fixedSections.map(val => (*/}
            {/*    <div key={val} style={{*/}
            {/*      display: "flex",*/}
            {/*      alignItems: "center",*/}
            {/*      background: "#fff8dc",*/}
            {/*      border: "1px solid #6db6f8",*/}
            {/*      borderRadius: "5px",*/}
            {/*      padding: "4px 8px",*/}
            {/*      margin: "6px 0",*/}
            {/*      justifyContent: "space-between"*/}
            {/*    }}>*/}
            {/*      <span>{`Section ${val}`}</span>*/}
            {/*      <button*/}
            {/*        style={{*/}
            {/*          background: "#f44",*/}
            {/*          color: "#fff",*/}
            {/*          border: "none",*/}
            {/*          borderRadius: "3px",*/}
            {/*          fontSize: "12px",*/}
            {/*          cursor: "pointer",*/}
            {/*          marginLeft: "8px",*/}
            {/*          padding: "0 8px"*/}
            {/*        }}*/}
            {/*        onClick={() => handleDeleteFixedSection(val)}*/}
            {/*        title="Delete"*/}
            {/*      >×*/}
            {/*      </button>*/}
            {/*    </div>*/}
            {/*  ))}*/}
            {/*</div>*/}
            <label>Width</label>
            <input type="number" value={propWidth} onChange={handlePropWidthChange} disabled={!selectedId}/>
            <label>Height</label>
            <input type="number" value={propHeight} onChange={handlePropHeightChange} disabled={!selectedId}/>
            <label>Label</label>
            <input type="text" value={propLabel} onChange={handlePropLabelChange} disabled={!selectedId}/>
            <label>Align</label>
            <select value={propAlign} onChange={handlePropAlignChange} disabled={!selectedId}>
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
            <label>Region</label>
            <select value={layoutRegion} onChange={e => setLayoutRegion(e.target.value)}>
              <option value="">Select</option>
              <option value="North America">North America</option>
              <option value="Europe">Europe</option>
              <option value="Asia">Asia</option>
              <option value="Africa">Africa</option>
            </select>
          </aside>
          <div id="canvas-container">
            <div
              id="canvas"
              ref={canvasRef}
              tabIndex="0"
              onDragOver={e => e.preventDefault()}
              onDrop={handleDrop}
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                overflow: "visible",
                // backgroundImage: isGridShown ? 'linear-gradient(to right, #ddd 1px, transparent 1px), linear-gradient(to bottom, #ddd 1px, transparent 1px)' : 'none',
                // backgroundSize: '20px 20px',
              }}
            >
              {/*<div style={{position: 'relative', width: '100%', height: '100%'}}>*/}
              {layoutObjects.map(obj => (
                <div
                  key={obj.id}
                  className={`canvas-object${selectedId === obj.id ? ' selected' : ''}${obj.fixedSection ? ' fixed-canvas-object' : ''}`}
                  style={{
                    left: obj.x,
                    top: obj.y,
                    width: obj.width,
                    height: obj.height,
                    textAlign: obj.align,
                    position: 'absolute',
                    background: obj.fixedSection ? '#fff8dc' : undefined,
                    border: obj.fixedSection ? '2px solid #f7b500' : undefined,
                    zIndex: obj.fixedSection ? 10 : undefined,
                    boxSizing: 'border-box'
                  }}
                  onClick={() => selectObject(obj.id)}
                  tabIndex={0}
                  onMouseDown={e => {
                    // Drag logic
                    const startX = e.clientX, startY = e.clientY;
                    const origX = obj.x, origY = obj.y;
                    const onMove = moveEvt => {
                      const dx = moveEvt.clientX - startX;
                      const dy = moveEvt.clientY - startY;
                      updateObject(obj.id, {
                        x: Math.round((origX + dx) / GRID_SIZE) * GRID_SIZE,
                        y: Math.round((origY + dy) / GRID_SIZE) * GRID_SIZE,
                      });
                    };
                    const onUp = () => {
                      saveState();
                      window.removeEventListener('mousemove', onMove);
                      window.removeEventListener('mouseup', onUp);
                    };
                    window.addEventListener('mousemove', onMove);
                    window.addEventListener('mouseup', onUp);
                  }}
                >
                  {/* Top-right controls */}
                  <div style={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    display: 'flex',
                    alignItems: 'center',
                    zIndex: 20,
                    gap: 4
                  }}>
                    <select
                      style={{minWidth: 120}}
                      value={obj.fixedSection || ""}
                      onChange={e => {
                        const val = e.target.value ? Number(e.target.value) : null;
                        updateObject(obj.id, {fixedSection: val});
                      }}
                    >
                      <option value="">Make fixed section</option>
                      {Array.from({length: 30}, (_, i) => i + 1).map(sectionNum => (
                        <option
                          key={sectionNum}
                          value={sectionNum}
                          disabled={
                            layoutObjects.some(o => o.fixedSection === sectionNum && o.id !== obj.id)
                          }
                        >
                          {getLabel(sectionNum)}
                        </option>
                      ))}
                    </select>
                    {obj.fixedSection && (
                      <button
                        style={{
                          background: "#f44",
                          color: "#fff",
                          border: "none",
                          borderRadius: "3px",
                          fontSize: "12px",
                          cursor: "pointer",
                          marginLeft: "4px",
                          padding: "0 8px"
                        }}
                        className="fixed-remove-btn"
                        onClick={e => {
                          e.stopPropagation();
                          updateObject(obj.id, {fixedSection: null});
                        }}
                        title="Remove fixed"
                      >×</button>
                    )}
                  </div>
                  <span className="object-text">{obj.label}</span>
                  {/* Resizer */}
                  <div
                    className="resizer"
                    onMouseDown={e => {
                      e.stopPropagation();
                      const startX = e.clientX, startY = e.clientY;
                      const origW = obj.width, origH = obj.height;
                      const onMove = moveEvt => {
                        const dw = moveEvt.clientX - startX;
                        const dh = moveEvt.clientY - startY;
                        updateObject(obj.id, {
                          width: Math.max(50, origW + dw),
                          height: Math.max(30, origH + dh),
                        });
                      };
                      const onUp = () => {
                        saveState();
                        window.removeEventListener('mousemove', onMove);
                        window.removeEventListener('mouseup', onUp);
                      };
                      window.addEventListener('mousemove', onMove);
                      window.addEventListener('mouseup', onUp);
                    }}
                  />
                  {/* Delete button (optional, hidden by default) */}
                  <button
                    className="deleteSectionBtn"
                    style={{position: 'absolute', top: 2, right: 2, display: 'none'}}
                    onClick={e => {
                      e.stopPropagation();
                      removeObject(obj.id);
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}

              {/*</div>*/}
            </div>
          </div>
        </div>
      </div>
      <footer>© 2025 Western Union Holdings, Inc. All Rights Reserved</footer>
    </>
  );
};

export default LayoutLibraryAdminPortal;