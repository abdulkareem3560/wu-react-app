import React, {useState, useRef, useEffect, useCallback} from 'react';
import html2canvas from 'html2canvas';
import {debounce} from 'lodash'; // <-- Import debounce from lodash
import NavMenu from "../components/NavMenu.jsx";

const LayoutLibraryAdminPortal = () => {
  const canvasRef = useRef(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [isGridShown, setIsGridShown] = useState(true);
  const [copiedElementData, setCopiedElementData] = useState(null); // New state for copied element data

  // State for property panel inputs
  const [layoutName, setLayoutName] = useState('');
  const [propWidth, setPropWidth] = useState('');
  const [propHeight, setPropHeight] = useState('');
  const [propLabel, setPropLabel] = useState('');
  const [propAlign, setPropAlign] = useState('left');
  const [layoutRegion, setLayoutRegion] = useState('');

  // Save state efficiently
  const saveState = useCallback(() => {
    if (canvasRef.current) {
      setUndoStack((prev) => [...prev, JSON.stringify(canvasRef.current.innerHTML)]);
      setRedoStack([]);
    }
  }, []);

  // Update canvas size based on the objects inside it
  const updateCanvasSize = useCallback(() => {
    if (!canvasRef.current) return;

    const objects = canvasRef.current.querySelectorAll(".canvas-object");
    let maxRight = 0;
    let maxBottom = 0;

    objects.forEach((obj) => {
      const left = parseInt(obj.style.left || 0);
      const top = parseInt(obj.style.top || 0);
      const right = left + obj.offsetWidth;
      const bottom = top + obj.offsetHeight;
      maxRight = Math.max(maxRight, right);
      maxBottom = Math.max(maxBottom, bottom);
    });

    canvasRef.current.style.width = `${maxRight + 40}px`;
    canvasRef.current.style.height = `${maxBottom + 40}px`;
  }, []);

  // Throttling updates to the DOM
  const updateCanvasSizeThrottled = useRef(debounce(updateCanvasSize, 100)); // Adjust throttle time

  // Making the objects draggable with `requestAnimationFrame`
  const makeDraggable = useCallback((el) => {
    const onMouseDown = (e) => {
      if (e.target.classList.contains("resizer")) return;
      const shiftX = e.clientX - el.getBoundingClientRect().left;
      const shiftY = e.clientY - el.getBoundingClientRect().top;
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const gridSize = 10;

      const moveAt = (pageX, pageY) => {
        let newX = pageX - canvasRect.left - shiftX;
        let newY = pageY - canvasRect.top - shiftY;
        el.style.left = `${Math.round(newX / gridSize) * gridSize}px`;
        el.style.top = `${Math.round(newY / gridSize) * gridSize}px`;

        // Use the throttled updateCanvasSize
        updateCanvasSizeThrottled.current();
      };

      const onMouseMove = (moveEvent) => {
        moveAt(moveEvent.pageX, moveEvent.pageY);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", () => {
        document.removeEventListener("mousemove", onMouseMove);
        saveState();
      }, {once: true}); // Use { once: true } to remove listener after first call
    };
    el.addEventListener("mousedown", onMouseDown);
    return () => el.removeEventListener("mousedown", onMouseDown);
  }, [saveState, updateCanvasSizeThrottled]);

  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;
    const lastState = undoStack[undoStack.length - 1];
    setRedoStack((prev) => [...prev, JSON.stringify(canvasRef.current.innerHTML)]);
    setUndoStack((prev) => prev.slice(0, prev.length - 1));
    canvasRef.current.innerHTML = JSON.parse(lastState);
    setSelectedElement(null); // Deselect any element after undo/redo
    updateCanvasSize();
  }, [undoStack]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ensure the canvas or a canvas object is focused for keyboard events to apply
      if (!canvasRef.current.contains(document.activeElement) && !selectedElement) {
        return;
      }

      // Check for Ctrl key (or Cmd key on Mac)
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;

      if (isCtrlOrCmd && e.key === "c") {
        e.preventDefault();
        if (selectedElement) {
          setCopiedElementData({
            width: selectedElement.offsetWidth,
            height: selectedElement.offsetHeight,
            label: selectedElement.querySelector('.object-text')?.textContent || selectedElement.textContent.trim(),
            textAlign: selectedElement.style.textAlign,
            bg: selectedElement.style.background,
          });
        }
      } else if (isCtrlOrCmd && e.key === "v") {
        e.preventDefault();
        if (copiedElementData) {
          const offset = 20; // offset so pasted element doesn't overlap exactly
          const originalLeft = selectedElement ? parseInt(selectedElement.style.left || 0) : 0;
          const originalTop = selectedElement ? parseInt(selectedElement.style.top || 0) : 0;
          const newX = originalLeft + offset;
          const newY = originalTop + offset;

          saveState();
          createObject(newX, newY, copiedElementData);
        }
      } else if (e.key === "Delete") {
        e.preventDefault();
        if (selectedElement) {
          selectedElement.remove();
          setSelectedElement(null);
          saveState();
          updateCanvasSize();
        }
      } else {
        // Movement (Arrow keys)
        if (!selectedElement) return; // Only allow movement if an element is selected

        let top = parseInt(selectedElement.style.top || 0);
        let left = parseInt(selectedElement.style.left || 0);
        const gridSize = 10; // Movement step

        switch (e.key) {
          case "ArrowUp":
            top -= gridSize;
            selectedElement.style.top = `${top}px`;
            updateCanvasSize();
            saveState();
            e.preventDefault();
            break;
          case "ArrowDown":
            top += gridSize;
            selectedElement.style.top = `${top}px`;
            updateCanvasSize();
            saveState();
            e.preventDefault();
            break;
          case "ArrowLeft":
            left -= gridSize;
            selectedElement.style.left = `${left}px`;
            updateCanvasSize();
            saveState();
            e.preventDefault();
            break;
          case "ArrowRight":
            left += gridSize;
            selectedElement.style.left = `${left}px`;
            updateCanvasSize();
            saveState();
            e.preventDefault();
            break;
          default:
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedElement, saveState, updateCanvasSize, copiedElementData]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    const nextState = redoStack[redoStack.length - 1];
    setUndoStack((prev) => [...prev, JSON.stringify(canvasRef.current.innerHTML)]);
    setRedoStack((prev) => prev.slice(0, prev.length - 1));
    canvasRef.current.innerHTML = JSON.parse(nextState);
    setSelectedElement(null); // Deselect any element after undo/redo
    updateCanvasSize();
  }, [redoStack]);

  const handleSaveLayout = () => {
    const filenameBase = `${layoutName || 'default'}_${layoutRegion || 'region'}`;

    html2canvas(canvasRef.current).then((canvasImage) => {
      const imageData = canvasImage.toDataURL("image/png");
      const layoutHTML = generateLayoutHTML();

      fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/save-layout`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          imageData,
          layoutHTML: layoutHTML,
          filename: filenameBase,
        }),
      })
        .then((res) => res.text())
        .then(alert)
        .catch((err) => alert("Save failed: " + err));
    });
  };

  const generateLayoutHTML = useCallback(() => {
    const layoutHTML = []; // Use an array to build the HTML incrementally

    canvasRef.current.querySelectorAll(".canvas-object").forEach((el, index) => {
      const left = el.style.left;
      const top = el.style.top;
      const width = el.style.width;
      const height = el.style.height;
      const textContent = el.querySelector('.object-text')?.textContent || el.textContent.trim();
      const uniqueId = `canvas-object-${index}`;

      let dropdownHTML = `<div style="display:flex; justify-content: space-between;"> <select id="sectionSelect" onchange="showContent(this, '${uniqueId}')" style="width:fit-content;">
              <option value="">-- Select --</option>`;
      for (let i = 1; i <= 30; i++) {
        dropdownHTML += `<option value="${i}">Section ${i}</option>`;
      }
      dropdownHTML += "</select>";

      layoutHTML.push(`
        <div class="canvas-object" id="${uniqueId}" style="position: absolute; left: ${left}; top: ${top}; width: ${width}; min-height: ${height};">
          ${dropdownHTML}
        </div>
      `);
    });

    return layoutHTML.join(''); // Return HTML as a single string
  }, []);

  // Handle dragging for the sidebar sections
  const handleDragStart = (e) => {
    e.dataTransfer.setData("text/plain", e.target.dataset.type);
  };

  // Handle property changes
  const handlePropWidthChange = (e) => {
    const value = e.target.value;
    setPropWidth(value);
    if (selectedElement) {
      selectedElement.style.width = `${value}px`;
      updateCanvasSize();
      saveState();
    }
  };

  const makeResizable = useCallback((el, resizer) => {
    const onMouseDown = (e) => {
      e.stopPropagation();
      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = parseInt(getComputedStyle(el).width);
      const startHeight = parseInt(getComputedStyle(el).height);

      const doDrag = (moveEvent) => {
        el.style.width = `${startWidth + moveEvent.clientX - startX}px`;
        el.style.height = `${startHeight + moveEvent.clientY - startY}px`;
        updateCanvasSize();
      };

      const stopDrag = () => {
        document.removeEventListener("mousemove", doDrag);
        document.removeEventListener("mouseup", stopDrag);
        saveState();
      };

      document.addEventListener("mousemove", doDrag);
      document.addEventListener("mouseup", stopDrag);
    };

    resizer.addEventListener("mousedown", onMouseDown);
    return () => resizer.removeEventListener("mousedown", onMouseDown);
  }, [saveState, updateCanvasSize]);

  const updatePropertyPanel = useCallback(() => {
    if (selectedElement) {
      setPropWidth(selectedElement.offsetWidth);
      setPropHeight(selectedElement.offsetHeight);
      // For the label, we need to consider if it's a direct text node or within a child element
      setPropLabel(selectedElement.querySelector('.object-text')?.textContent || selectedElement.textContent);
      setPropAlign(selectedElement.style.textAlign || "left");
    } else {
      setPropWidth('');
      setPropHeight('');
      setPropLabel('');
      setPropAlign('left');
    }
  }, [selectedElement]);


  const enableSelection = useCallback((el) => {
    const onClick = () => {
      if (selectedElement) selectedElement.classList.remove("selected");
      setSelectedElement(el);
      el.classList.add("selected");
      updatePropertyPanel();
    };
    el.addEventListener("click", onClick);
    return () => el.removeEventListener("click", onClick);
  }, [selectedElement, updatePropertyPanel]);


  const createObject = useCallback((x, y, initialText = "Text") => {
    const el = document.createElement("div");
    el.className = "canvas-object";
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.width = "150px";
    el.style.height = "60px";

    const textSpan = document.createElement('span');
    textSpan.className = 'object-text';
    textSpan.textContent = initialText;
    el.appendChild(textSpan);

    const resizer = document.createElement("div");
    resizer.className = "resizer";
    el.appendChild(resizer);
    canvasRef.current.appendChild(el);

    makeDraggable(el);
    makeResizable(el, resizer);
    enableSelection(el);
    updateCanvasSize();
  }, [makeDraggable, makeResizable, enableSelection, updateCanvasSize]);


  const handleDrop = useCallback((e) => {
    e.preventDefault(); // Prevent the default behavior (Prevent the browser from opening the dropped file)

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; // Get the x-coordinate of the drop within the canvas
    const y = e.clientY - rect.top; // Get the y-coordinate of the drop within the canvas

    saveState(); // Save the current state before adding the new object

    createObject(x, y); // Call createObject to add the dropped element to the canvas
  }, [createObject, saveState]);

  const handlePropHeightChange = (e) => {
    const value = e.target.value;
    setPropHeight(value);
    if (selectedElement) {
      selectedElement.style.height = `${value}px`;
      updateCanvasSize();
      saveState();
    }
  };

  const handlePropLabelChange = (e) => {
    const value = e.target.value;
    setPropLabel(value);
    if (selectedElement) {
      const textSpan = selectedElement.querySelector('.object-text');
      if (textSpan) {
        textSpan.textContent = value;
      } else {
        selectedElement.textContent = value; // Fallback
      }
      saveState();
    }
  };

  const handlePropAlignChange = (e) => {
    const value = e.target.value;
    setPropAlign(value);
    if (selectedElement) {
      selectedElement.style.textAlign = value;
      saveState();
    }
  };

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
          min-width: 150px;
          min-height: 60px;
          transition: height 0.3s ease;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .canvas-object .object-text {
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
      `}</style>
      <NavMenu activeItem={0}/>

      <div className="container">
        <div className="top-row">
          <h1>Layout Library</h1>
          <div className="controls" role="toolbar" aria-label="Layout controls">
            <button
              className="undo"
              type="button"
              onClick={handleUndo}
              aria-label="Undo changes"
              disabled={undoStack.length === 0}
            >
              ↩ Undo
            </button>
            <button
              className="redo"
              type="button"
              onClick={handleRedo}
              aria-label="Redo changes"
              disabled={redoStack.length === 0}
            >
              ↪ Redo
            </button>
            <button
              className="save-layout"
              type="button"
              onClick={handleSaveLayout}
              aria-label="Save layout"
            >
              Save Layout
            </button>
            <label htmlFor="toggle-grid">
              <input
                type="checkbox"
                id="toggle-grid"
                checked={isGridShown}
                onChange={() => setIsGridShown(!isGridShown)}
                aria-checked={isGridShown}
              />
              Show Grid
            </label>
            <button
              className="back-home"
              type="button"
              onClick={() => window.location.href = '/admin'}
              aria-label="Back to Home"
            >
              ⬅ Back to Home
            </button>
          </div>
        </div>

        <div className="workspace">
          <aside className="sidebar" aria-label="Layout Properties Sidebar">
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
              aria-label="Add Section"
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
            <label htmlFor="layout-name">Layout Name</label>
            <input
              type="text"
              id="layout-name"
              placeholder="Enter layout name"
              value={layoutName}
              onChange={(e) => setLayoutName(e.target.value)}
            />

            <label htmlFor="prop-width">Width</label>
            <input
              type="number"
              id="prop-width"
              placeholder="Width"
              value={propWidth}
              onChange={handlePropWidthChange}
              disabled={!selectedElement}
            />

            <label htmlFor="prop-height">Height</label>
            <input
              type="number"
              id="prop-height"
              placeholder="Height"
              value={propHeight}
              onChange={handlePropHeightChange}
              disabled={!selectedElement}
            />

            <label htmlFor="prop-label">Label</label>
            <input
              type="text"
              id="prop-label"
              placeholder="Label"
              value={propLabel}
              onChange={handlePropLabelChange}
              disabled={!selectedElement}
            />

            <label htmlFor="prop-align">Align</label>
            <select
              id="prop-align"
              value={propAlign}
              onChange={handlePropAlignChange}
              disabled={!selectedElement}
            >
              <option value="" disabled>Select</option>
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>

            <label htmlFor="layout-region">Region</label>
            <select
              id="layout-region"
              value={layoutRegion}
              onChange={(e) => setLayoutRegion(e.target.value)}
            >
              <option value="" disabled>Select</option>
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
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              {/* Canvas objects will be dynamically added here by JavaScript/React */}
            </div>
          </div>
        </div>
      </div>
      <footer>© 2025 Western Union Holdings, Inc. All Rights Reserved</footer>
    </>
  );
};

export default LayoutLibraryAdminPortal;
