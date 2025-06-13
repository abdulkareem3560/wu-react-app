import React, {useState, useRef, useEffect} from 'react';
import NavMenu from "../components/NavMenu.jsx";
import SectionEditor from '../components/template-library/SectionEditor.jsx';
import EditorArea from '../components/template-library/EditorArea.jsx';
import VariablesTable from '../components/template-library/VariablesTable.jsx';
import RulesDisplay from '../components/template-library/RulesDisplay.jsx';
import RulesModal from '../components/template-library/RulesModal.jsx';

const TemplateLibrary = () => {
  const editorRef = useRef(null);
  const [section, setSection] = useState('');
  const [fontFamily, setFontFamily] = useState('');
  const [fontSize, setFontSize] = useState('');
  const [fontWeight, setFontWeight] = useState('');
  const [containerWidth, setContainerWidth] = useState('');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [alignment, setAlignment] = useState('');
  const [paddingTop, setPaddingTop] = useState('10');
  const [paddingBottom, setPaddingBottom] = useState('10');
  const [variables, setVariables] = useState([]);
  const [savedRules, setSavedRules] = useState([]);
  const [content, setContent] = useState('');
  const [variableTable, setVariableTable] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("section");
  const [sectionLogic, setSectionLogic] = useState('');
  const [sectionLogicExpr, setSectionLogicExpr] = useState('');

  // Handlers
  const handleApplyStyle = () => {
    const editor = editorRef.current;
    if (fontFamily) editor.style.fontFamily = fontFamily;
    if (fontSize) editor.style.fontSize = fontSize;
    if (containerWidth) editor.style.width = `${containerWidth}px`;
    if (bgColor) editor.style.backgroundColor = bgColor;
    if (alignment) editor.style.textAlign = alignment;
    if (paddingTop) editor.style.paddingTop = `${paddingTop}px`;
    if (paddingBottom) editor.style.paddingBottom = `${paddingBottom}px`;
  };

  const handleEditorChange = () => {
    setContent(editorRef.current.innerHTML);
  };

  const handleExtractVariables = () => {
    const editorHTML = editorRef.current.innerHTML;
    const matches = [...editorHTML.matchAll(/{{\s*([\w\d_]+)\s*}}/g)];
    const uniqueVars = [...new Set(matches.map(m => m[1]))];
    setVariables(uniqueVars);
    setVariableTable(uniqueVars.map(varName => ({variable: varName, value: ''})));
  };

  const handleVariableChange = (index, value) => {
    const updatedTable = [...variableTable];
    updatedTable[index].value = value;
    setVariableTable(updatedTable);
  };

  const handleSaveWithReplacedVariables = () => {
    if (!section) return alert("Select a section.");
    let contentToSave = editorRef.current.innerHTML;
    variableTable.forEach(row => {
      const regex = new RegExp(`{{\\s*${row.variable}\\s*}}`, "g");
      contentToSave = contentToSave.replace(regex, row.value || `{{${row.variable}}}`);
    });
    const wrapper = document.createElement("div");
    wrapper.innerHTML = contentToSave;
    wrapper.querySelectorAll("[style]").forEach(el => {
      const style = el.getAttribute("style");
      el.setAttribute("style", style.replace(/background-color\s*:\s*[^;]+;?/gi, "").trim());
    });
    const inlineStyles = `
      font-family: ${editorRef.current.style.fontFamily || "inherit"};
      font-size: inherit;
      width: ${editorRef.current.style.width || "auto"};
      background-color: #ffffff;
      text-align: ${editorRef.current.style.textAlign || "left"};
      margin: 0 auto;
      box-sizing: border-box;
    `;
    const wrappedContent = `<div style="${inlineStyles}">${wrapper.innerHTML}</div>`;
    const styles = {
      fontFamily: editorRef.current.style.fontFamily,
      width: editorRef.current.style.width,
      backgroundColor: "#ffffff",
      textAlign: editorRef.current.style.textAlign,
    };
    fetch(`${import.meta.env.VITE_BACKEND_BASE_UR}/save-section/${section}`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({content: wrappedContent, styles}),
    })
      .then(res => res.text())
      .then(data => alert(data))
      .catch(err => alert("Save failed: " + err));
  };

  // Rules modal handlers
  const openRuleModalForSection = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  // Load section content and rules
  useEffect(() => {
    if (!section) return;
    fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}get-section/${encodeURIComponent(section)}`)
      .then(res => res.json())
      .then(data => {
        editorRef.current.innerHTML = data.content || "";
        setVariables(data.variables || []);
        setVariableTable((data.variables || []).map(varName => ({variable: varName, value: ''})));
        if (data.styles) {
          const styles = data.styles;
          editorRef.current.style.fontFamily = styles.fontFamily || "";
          editorRef.current.style.fontSize = styles.fontSize || "";
          editorRef.current.style.width = styles.width || "";
          editorRef.current.style.backgroundColor = styles.backgroundColor || "";
          editorRef.current.style.textAlign = styles.textAlign || "";
          editorRef.current.style.paddingTop = styles.paddingTop || "";
          editorRef.current.style.paddingBottom = styles.paddingBottom || "";
        }
        setTimeout(() => handleExtractVariables(), 0);
      })
      .catch(() => alert("Failed to load section"));
    // Fetch rules
    fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}get-rules/${section}`)
      .then(res => res.json())
      .then(data => setSavedRules(data || []))
      .catch(() => {
      });
  }, [section]);

  // Font weight update
  const updateFontWeight = (weight) => {
    if (!weight) return;
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    if (range.collapsed) return;
    const contents = range.extractContents();
    const span = document.createElement("span");
    span.style.fontWeight = weight;
    span.appendChild(contents);
    range.deleteContents();
    range.insertNode(span);
    const newRange = document.createRange();
    newRange.setStartAfter(span);
    newRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(newRange);
  };

  return (
    <>
      <style>
        {`
          body {
  font-family: Arial, sans-serif;
  background: #f5f5f5;
  margin: 0;
  padding: 0;
}

main {
  max-width: 1200px;
  margin: 50px auto 30px auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  padding: 30px 40px 20px 40px;
  min-height: 80vh;
}

.top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.back-home {
  color: #0077c2;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  border: 1px solid #0077c2;
  border-radius: 4px;
  padding: 6px 16px;
  transition: background 0.2s, color 0.2s;
}

.back-home:hover {
  background: #0077c2;
  color: #fff;
}

.container {
  background: #f9f9f9;
  padding: 22px 24px 12px 24px;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.03);
}

.form-group {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.form-group label {
  width: 140px;
  font-weight: 500;
}

.form-group input,
.form-group select {
  flex: 1;
  margin-left: 10px;
  padding: 5px 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 15px;
}

.buttons-container {
  display: flex;
  gap: 16px;
  margin-top: 12px;
}

.buttons-container button {
  background: #0077c2;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px 20px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.buttons-container button:hover {
  background: #005fa3;
}

#editor {
  background: #fff;
  border: 1px solid #d1d1d1;
  border-radius: 8px;
  min-height: 300px;
  padding: 18px;
  font-size: 16px;
  box-sizing: border-box;
  margin-bottom: 30px;
  outline: none;
  transition: border 0.2s;
}

#editor:focus {
  border: 1.5px solid #0077c2;
}

.variables-rules-container {
  display: flex;
  width: 100%;
  gap: 20px;
  margin-top: 20px;
}

.variables-box, .rules-box {
  width: 50%;
  background: #f3f6fa;
  border-radius: 10px;
  padding: 20px 18px 50px 18px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.03);
  position: relative;
  min-height: 220px;
  display: flex;
  flex-direction: column;
}

.variables-box h3, .rules-box h3 {
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 19px;
  font-weight: 600;
  color: #0077c2;
}

#variableTable {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 10px;
}

#variableTable th, #variableTable td {
  border: 1px solid #d1d1d1;
  padding: 6px 8px;
  text-align: left;
  font-size: 15px;
}

#variableTable th {
  background: #e8f0fe;
  font-weight: 600;
}

#variableTable select {
  width: 100%;
  padding: 4px 6px;
  border-radius: 3px;
  border: 1px solid #ccc;
}

.variables-box button, .rules-box button {
  background: #0077c2;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 7px 18px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.variables-box button:hover, .rules-box button:hover {
  background: #005fa3;
}

.rules-box {
  display: flex;
  flex-direction: column;
}

#savedSectionRules, #savedVariableRules {
  margin-bottom: 12px;
}

footer {
  margin-top: 40px;
  text-align: center;
  color: #888;
  font-size: 14px;
}

.modal {
  display: flex;
  position: fixed;
  z-index: 1000;
  left: 0; top: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.18);
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: #fff;
  border-radius: 10px;
  padding: 32px 28px 22px 28px;
  min-width: 420px;
  box-shadow: 0 6px 32px rgba(0,0,0,0.10);
  position: relative;
}

.close-btn {
  position: absolute;
  right: 18px;
  top: 14px;
  font-size: 22px;
  color: #888;
  cursor: pointer;
}

.tabs {
  display: flex;
  border-bottom: 1.5px solid #e0e0e0;
  margin-bottom: 18px;
}

.tab {
  padding: 9px 26px;
  cursor: pointer;
  color: #555;
  font-weight: 500;
  border-bottom: 2.5px solid transparent;
  transition: border-color 0.2s, color 0.2s;
}

.tab.active {
  color: #0077c2;
  border-bottom: 2.5px solid #0077c2;
  background: #f5faff;
}

.tab-content {
  display: none;
  margin-top: 18px;
}

.tab-content.active {
  display: block;
}

@media (max-width: 900px) {
  main {
    padding: 16px 2vw 12px 2vw;
  }
  .variables-rules-container {
    flex-direction: column;
    gap: 10px;
  }
  .variables-box, .rules-box {
    width: 100%;
    min-width: 0;
    padding: 16px 8px 36px 8px;
  }
  .modal-content {
    min-width: 90vw;
    padding: 18px 6vw 12px 6vw;
  }
}
        `}
      </style>
      <NavMenu activeItem={1}/>
      <main>
        <div className="top-row">
          <h2>Template Library</h2>
          <a href="admin" className="back-home">Back to Home</a>
        </div>
        <SectionEditor
          section={section}
          setSection={setSection}
          fontFamily={fontFamily}
          setFontFamily={setFontFamily}
          fontSize={fontSize}
          setFontSize={setFontSize}
          fontWeight={fontWeight}
          setFontWeight={setFontWeight}
          containerWidth={containerWidth}
          setContainerWidth={setContainerWidth}
          bgColor={bgColor}
          setBgColor={setBgColor}
          alignment={alignment}
          setAlignment={setAlignment}
          paddingTop={paddingTop}
          setPaddingTop={setPaddingTop}
          paddingBottom={paddingBottom}
          setPaddingBottom={setPaddingBottom}
          handleApplyStyle={handleApplyStyle}
          updateFontWeight={updateFontWeight}
        />
        <EditorArea
          editorRef={editorRef}
          content={content}
          handleEditorChange={handleEditorChange}
        />
        <div className="variables-rules-container">
          <VariablesTable
            variables={variables}
            variableTable={variableTable}
            handleVariableChange={handleVariableChange}
            handleExtractVariables={handleExtractVariables}
            handleSaveWithReplacedVariables={handleSaveWithReplacedVariables}
          />
          <RulesDisplay
            section={section}
            openRuleModalForSection={openRuleModalForSection}
            savedRules={savedRules}
          />
        </div>
        <RulesModal
          open={modalOpen}
          onClose={closeModal}
          section={section}
          variables={variables}
          savedRules={savedRules}
          setSavedRules={setSavedRules}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sectionLogic={sectionLogic}
          setSectionLogic={setSectionLogic}
          sectionLogicExpr={sectionLogicExpr}
          setSectionLogicExpr={setSectionLogicExpr}
        />
        <footer>© 2025 Western Union Holdings, Inc. All Rights Reserved</footer>
      </main>
    </>
  );
};

export default TemplateLibrary;
