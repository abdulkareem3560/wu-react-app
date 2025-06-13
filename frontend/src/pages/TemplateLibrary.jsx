import React, {useState, useEffect, useRef} from 'react';
import NavMenu from "../components/NavMenu.jsx";

let currentVariableRuleState = {};

const fields = ["Country", "Region", "Customer", "Agent"];
const conditions = ["Equal to", "Not equal to", "Contains", "Greater than", "Less than",];

const generateFontSizeOptions = () => {
  let options = [];
  for (let i = 7; i <= 50; i++) {
    options.push(<option key={i} value={`${i}px`}>{`${i}px`}</option>);
  }
  return options;
};

const generateSectionOptions = () => {
  let options = [];
  for (let i = 1; i <= 30; i++) {
    options.push(<option key={i} value={`section-${i}`}>{`Section - ${i}`}</option>);
  }
  return options;
};

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
  const [activeTab, setActiveTab] = useState("section");
  const [sectionLogic, setSectionLogic] = useState('');
  const [sectionLogicExpr, setSectionLogicExpr] = useState('');
  let globalVariableKeys = useRef([]);

  const handleExtractVariables = () => {
    const editorHTML = editorRef.current.innerHTML;
    const matches = [...editorHTML.matchAll(/{{\s*([\w\d_]+)\s*}}/g)];
    const uniqueVars = [...new Set(matches.map(m => m[1]))];
    setVariables(globalVariableKeys.current);

    console.log(globalVariableKeys.current, "here10....");
    const updatedVariableTable = uniqueVars.map((varName) => ({
      variable: varName, value: ''
    }));
    setVariableTable(updatedVariableTable);
  };

  function handleSaveWithReplacedVariables() {
    const sectionKey = sectionSelect.value;
    if (!sectionKey) return alert("Select a section.");

    const editor = document.getElementById("editor");
    let content = editor.innerHTML;

    document.querySelectorAll("#variableTable select").forEach((input) => {
      const varName = input.getAttribute("data-var");
      const value = input.value;
      const regex = new RegExp(`{{\\s*${varName}\\s*}}`, "g");
      content = content.replace(regex, value || `{{${varName}}}`);
    });

    const wrapper = document.createElement("div");
    wrapper.innerHTML = content;

    wrapper.querySelectorAll("[style]").forEach((el) => {
      const style = el.getAttribute("style");
      el.setAttribute("style", style.replace(/background-color\s*:\s*[^;]+;?/gi, "").trim());
    });

    const inlineStyles = `
        font-family: ${editor.style.fontFamily || "inherit"};
        font-size: inherit;
        width: ${editor.style.width || "auto"};
        background-color: #ffffff;
        text-align: ${editor.style.textAlign || "left"};
        margin: 0 auto;
        box-sizing: border-box;
      `;

    const wrappedContent = `<div style="${inlineStyles}">${wrapper.innerHTML}</div>`;

    const styles = {
      fontFamily: editor.style.fontFamily,
      width: editor.style.width,
      backgroundColor: "#ffffff",
      textAlign: editor.style.textAlign,
    };

    fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/save-section/${sectionKey}`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({content: wrappedContent, styles}),
    })
      .then((res) => res.text())
      .then((data) => alert(data))
      .catch((err) => alert("Save failed: " + err));
  }

  function closeModal() {
    document.getElementById("ruleModal").style.display = "none";
  }

  function addSectionRule() {
    const container = document.getElementById("sectionRulesWrapper");
    const ruleCount = container.querySelectorAll(".rule-row").length + 1;

    const row = createRuleRow({}, true, false); // Don't include logic dropdown
    const numberLabel = document.createElement("span");
    numberLabel.textContent = `${ruleCount}. `;
    numberLabel.style.marginRight = "8px";
    row.prepend(numberLabel);

    container.appendChild(row);
  }

  function saveRules() {
    const allRules = [];

    // Collect SECTION rules
    const sectionRows = document.querySelectorAll("#sectionRulesWrapper .rule-row");
    const sectionLogicExpression = document
      .getElementById("sectionLogicInput")
      .value.trim();

    sectionRows.forEach((row, index) => {
      const selects = row.querySelectorAll("select");
      const inputs = row.querySelectorAll("input");

      const field = selects[0];
      const condition = selects[1];
      const value = inputs[0];

      if (value && value.value.trim()) {
        const description = `${field.value} ${condition.value} ${value.value}`;
        allRules.push({
          type: "section",
          field: field.value,
          condition: condition.value,
          value: value.value,
          ruleIndex: index + 1,
          description,
        });
      }
    });

    if (sectionLogicExpression) {
      allRules.push({
        type: "sectionLogic", expression: sectionLogicExpression,
      });
    }

    // Variable rules (optional – if you're not using this yet, leave as-is)
    document.querySelectorAll(".variable-group").forEach((group) => {
      const key = group.querySelector(".rule-label").textContent;
      const ruleRows = group.querySelectorAll(".rule-row");
      const logicInput = group.querySelector(".variable-logic");
      const logicExpr = logicInput ? logicInput.value.trim() : "";

      const rules = [];
      currentVariableRuleState = collectCurrentVariableRules();

      ruleRows.forEach((row, index) => {
        const selects = row.querySelectorAll("select");
        const inputs = row.querySelectorAll("input");
        const field = selects[0];
        const condition = selects[1];
        const value = inputs[0];

        if (value && value.value.trim()) {
          const logic = selects.length > 2 ? selects[2].value : null;
          const description = `${field.value} ${condition.value} ${value.value}`;

          rules.push({
            type: "variable",
            variable: key,
            field: field.value,
            condition: condition.value,
            value: value.value,
            ruleIndex: index + 1,
            description,
          });
        }
      });
      allRules.push(...rules);

      if (logicExpr) {
        allRules.push({
          type: "variableLogic", variable: key, expression: logicExpr,
        });
      }
      const checkbox = group.querySelector(".display-if-exists");
      if (checkbox?.checked) {
        allRules.push({
          type: "displayIfExists", variable: key, display: true,
        });
      }
    });

    savedRules.length = 0;
    savedRules.push(...allRules);
    const sectionRules = allRules.filter((r) => r.type === "section");
    const variableRules = allRules.filter((r) => r.type === "variable");
    const sectionLogic = allRules.find((r) => r.type === "sectionLogic") || null;
    const variableLogic = allRules.filter((r) => r.type === "variableLogic") || null;

    const sectionKey = document.getElementById("sectionSelect").value;
    if (!sectionKey) {
      alert("Please select a section.");
      return;
    }

    // Compose data object to send to server
    const rulesToSave = {
      sectionRules, variableRules, sectionLogic, variableLogic,
    };

    fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/save-rules/${sectionKey}`, {
      method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(rulesToSave),
    })
      .then((res) => res.text())
      .then((msg) => {
        alert("Rules saved successfully");
        renderSavedRules();
        closeModal();
      })
      .catch((err) => {
        alert("Failed to save rules: " + err.message);
      });
  }

  function sanitizeLoadedContent(rawHtml) {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = rawHtml;

    wrapper.querySelectorAll("[style]").forEach((el) => {
      const originalStyle = el.getAttribute("style") || "";
      const cleanedStyle = originalStyle
        .replace(/background-color\s*:\s*[^;]+;?/gi, "") // Remove background-color
        .replace(/width\s*:\s*[^;]+;?/gi, "") // Remove width (optional)
        .replace(/max-width\s*:\s*[^;]+;?/gi, "") // Remove max-width (optional)
        .replace(/padding(-top|-bottom)?\s*:\s*[^;]+;?/gi, "") // Remove padding (optional)
        .trim();
      el.setAttribute("style", cleanedStyle);
    });

    return wrapper.innerHTML;
  }

  const loadSectionContent = () => {
    fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/get-section/${encodeURIComponent(section)}`)
      .then(res => res.json())
      .then(data => {
        const editor = editorRef.current;
        editor.innerHTML = sanitizeLoadedContent(data.content || "");
        setVariables(data.variables || []);
        setVariableTable(data.variables || []);

        if (data.styles) {
          const styles = data.styles;
          editor.style.fontFamily = styles.fontFamily || "";
          editor.style.fontSize = styles.fontSize || "";
          editor.style.width = styles.width || "";
          editor.style.backgroundColor = styles.backgroundColor || "";
          editor.style.textAlign = styles.textAlign || "";
          editor.style.paddingTop = styles.paddingTop || "";
          editor.style.paddingBottom = styles.paddingBottom || "";
        }

        setTimeout(() => {
          handleExtractVariables();
        }, 0);
      })
      .catch(err => {
        console.error("Error loading section:", err);
        alert("Failed to load section");
      });
  };

  const switchTab = (tabId) => {
    setActiveTab(tabId);
  };

  function loadGlobalVariableKeys() {
    fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/global-variables`)
      .then((res) => res.json())
      .then((data) => {
        globalVariableKeys.current = Object.keys(data);
      })
      .catch((err) => {
        console.error("Failed to load global variables:", err);
        globalVariableKeys.current = [];
      });
  }

  function fetchAndDisplayRulesForSection(sectionId) {
    if (!sectionId) {
      document.getElementById("savedSectionRules").innerHTML = "";
      document.getElementById("savedVariableRules").innerHTML = "";
      return;
    }

    fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/get-rules/${sectionId}`)
      .then((res) => res.json())
      .then((data) => {
        const {
          sectionRules = [], variableRules = [], sectionLogic, variableLogic = [],
        } = data;
        const sectionDiv = document.getElementById("savedSectionRules");
        const variableDiv = document.getElementById("savedVariableRules");

        // --- Section Rules ---
        sectionDiv.innerHTML = "<h3>Section Rules</h3>";

        if (sectionRules.length === 0) {
          sectionDiv.innerHTML += '<div class="rule-text">No section rules defined</div>';
        } else {
          // Add the line only if there are rules
          const applicableLine = document.createElement("div");
          applicableLine.textContent = "Rules are applicable only if:";
          applicableLine.style.marginBottom = "8px";
          applicableLine.style.fontStyle = "italic";
          sectionDiv.appendChild(applicableLine);

          sectionRules.forEach((rule, index) => {
            const p = document.createElement("div");
            p.className = "rule-text";
            p.textContent = `${rule.field} ${rule.condition} ${rule.value}`;
            sectionDiv.appendChild(p);
          });

          if (sectionLogic) {
            let logic = sectionLogic.expression;

            // Replace numeric placeholders with rule descriptions
            sectionRules.forEach((rule, i) => {
              const pattern = new RegExp(`\\b${i + 1}\\b`, "g");
              logic = logic.replace(pattern, rule.description);
            });

            const logicLine = document.createElement("div");
            logicLine.className = "rule-text";
            logicLine.style.fontWeight = "bold";
            logicLine.style.marginTop = "10px";
            logicLine.textContent = `Logic: ${logic}`;
            sectionDiv.appendChild(logicLine);
          }
        }

        // --- Variable Rules ---
        variableDiv.innerHTML = "<h3 style='margin-top:10px'>Element Specific Rules</h3>";

        if (variableRules.length === 0) {
          variableDiv.innerHTML += '<div class="rule-text">No variable rules defined</div>';
        } else {
          // Group variableRules by variable name
          const grouped = {};
          variableRules.forEach((rule) => {
            if (!grouped[rule.variable]) grouped[rule.variable] = [];
            grouped[rule.variable].push(rule);
          });

          Object.keys(grouped).forEach((variable) => {
            const label = document.createElement("div");
            label.textContent = variable;
            label.style.fontWeight = "bold";
            label.style.margin = "10px 0 5px 0";
            variableDiv.appendChild(label);

            // Add "Rules are applicable only if:" below the variable title
            const applicableLineVar = document.createElement("div");
            applicableLineVar.textContent = "Rules are applicable only if:";
            applicableLineVar.style.marginBottom = "8px";
            applicableLineVar.style.fontStyle = "italic";
            variableDiv.appendChild(applicableLineVar);

            const rules = grouped[variable];
            rules.forEach((rule, idx) => {
              const p = document.createElement("div");
              p.className = "rule-text";
              p.textContent = `${rule.field} ${rule.condition} ${rule.value}`;
              variableDiv.appendChild(p);
            });

            // Find variable logic expression for this variable
            const logicObj = variableLogic.find((vl) => vl.variable === variable);
            if (logicObj && logicObj.expression) {
              let expression = logicObj.expression;

              // Replace numeric placeholders with rule descriptions
              rules.forEach((rule, i) => {
                const pattern = new RegExp(`\\b${i + 1}\\b`, "g");
                expression = expression.replace(pattern, rule.description);
              });

              const logicLine = document.createElement("div");
              logicLine.className = "rule-text";
              logicLine.style.fontWeight = "bold";
              logicLine.style.marginTop = "5px";
              logicLine.textContent = `Logic: ${expression}`;
              variableDiv.appendChild(logicLine);
            }
          });
        }
      })
      .catch((err) => {
        console.error("Failed to fetch rules:", err);
      });
  }

  function renderSavedRules() {
    const sectionDiv = document.getElementById("savedSectionRules");
    const variableDiv = document.getElementById("savedVariableRules");
    const wrapper = document.getElementById("savedRulesWrapper");

    sectionDiv.innerHTML = "";
    variableDiv.innerHTML = "";
    wrapper.style.display = "none";

    const sectionRules = savedRules.filter((rule) => rule.type === "section");
    const sectionLogic = savedRules.find((rule) => rule.type === "sectionLogic");
    const variableRules = savedRules.filter((rule) => rule.type === "variable");
    const variableLogicRules = savedRules.filter((rule) => rule.type === "variableLogic");

    // --- Section Rules ---
    if (sectionRules.length > 0) {
      sectionDiv.innerHTML = "<h3>Section Rules</h3>";

      // Add "Rules are applicable only if:" below the Section Rules title
      const applicableLine = document.createElement("div");
      applicableLine.textContent = "Rules are applicable only if:";
      applicableLine.style.marginBottom = "8px";
      applicableLine.style.fontStyle = "italic";
      sectionDiv.appendChild(applicableLine);

      sectionRules.forEach((rule, index) => {
        const p = document.createElement("div");
        p.className = "rule-text";
        p.textContent = `${index + 1}. ${rule.description}`;
        sectionDiv.appendChild(p);
      });

      if (sectionLogic) {
        let logic = sectionLogic.expression;

        // Replace numeric placeholders with rule descriptions
        sectionRules.forEach((rule, i) => {
          const pattern = new RegExp(`\\b${i + 1}\\b`, "g");
          logic = logic.replace(pattern, rule.description);
        });

        const logicLine = document.createElement("div");
        logicLine.className = "rule-text";
        logicLine.style.fontWeight = "bold";
        logicLine.style.marginTop = "10px";
        logicLine.textContent = `Logic: ${logic}`;
        sectionDiv.appendChild(logicLine);
      }
    } else {
      sectionDiv.innerHTML = '<h3>Section Rules</h3><div class="rule-text">No rules were defined</div>';
    }

    // --- Variable Rules ---
    if (variableRules.length > 0) {
      variableDiv.innerHTML = "<h3>Variable Rules</h3>";

      const grouped = {};
      variableRules.forEach((rule) => {
        if (!grouped[rule.variable]) grouped[rule.variable] = [];
        grouped[rule.variable].push(rule);
      });

      Object.keys(grouped).forEach((key) => {
        const label = document.createElement("div");
        label.textContent = key;
        label.style.fontWeight = "bold";
        label.style.marginTop = "10px";
        variableDiv.appendChild(label);

        // Add "Rules are applicable only if:" BELOW the variable title
        const applicableLineVar = document.createElement("div");
        applicableLineVar.textContent = "Rules are applicable only if:";
        applicableLineVar.style.marginBottom = "8px";
        applicableLineVar.style.fontStyle = "italic";
        variableDiv.appendChild(applicableLineVar);

        const rules = grouped[key];
        rules.forEach((rule, index) => {
          const p = document.createElement("div");
          p.className = "rule-text";
          p.textContent = `${index + 1}. ${rule.description}`;
          variableDiv.appendChild(p);
        });

        const displaySetting = savedRules.find((rule) => rule.type === "displayIfExists" && rule.variable === key);
        if (displaySetting) {
          const displayLine = document.createElement("div");
          displayLine.className = "rule-text";
          displayLine.textContent = `Display only if value exists`;
          variableDiv.appendChild(displayLine);
        }

        const logic = variableLogicRules.find((vl) => vl.variable === key);
        if (logic) {
          let expression = logic.expression;
          rules.forEach((rule, i) => {
            const pattern = new RegExp(`\\b${i + 1}\\b`, "g");
            expression = expression.replace(pattern, rule.description);
          });

          const logicLine = document.createElement("div");
          logicLine.className = "rule-text";
          logicLine.style.fontWeight = "bold";
          logicLine.style.marginTop = "5px";
          logicLine.textContent = `Logic: ${expression}`;
          variableDiv.appendChild(logicLine);
        }
      });
    } else {
      variableDiv.innerHTML = '<h3>Variable Rules</h3><div class="rule-text">No rules were defined</div>';
    }

    if (sectionRules.length > 0 || variableRules.length > 0) {
      wrapper.style.display = "block";
    }
  }

  function createRuleRow(defaults = {}, withDelete = true, includeLogic = true) {
    const row = document.createElement("div");
    row.className = "rule-row";

    const fieldSelect = document.createElement("select");
    fields.forEach((opt) => {
      const option = new Option(opt, opt);
      if (opt === defaults.field) option.selected = true;
      fieldSelect.appendChild(option);
    });

    const conditionSelect = document.createElement("select");
    conditions.forEach((opt) => {
      const option = new Option(opt, opt);
      if (opt === defaults.condition) option.selected = true;
      conditionSelect.appendChild(option);
    });

    const input = document.createElement("input");
    input.type = "text";
    input.value = defaults.value || "";

    row.appendChild(fieldSelect);
    row.appendChild(conditionSelect);
    row.appendChild(input);

    //   if (includeLogic) {
    //     const logicSelect = document.createElement("select");
    //     logicSelect.innerHTML = `<option value="AND">AND</option><option value="OR">OR</option>`;
    //     logicSelect.value = defaults.logic || "AND";
    //     logicSelect.style.marginLeft = "10px";
    //     row.appendChild(logicSelect);
    //   }

    if (withDelete) {
      const delBtn = document.createElement("button");
      delBtn.textContent = "🗑";
      delBtn.onclick = () => {
        const container = row.parentElement;
        row.remove();

        // Remove logic dropdown from new last row if it exists
        const rows = container.querySelectorAll(".rule-row");
        if (rows.length > 0) {
          const lastRow = rows[rows.length - 1];
          const logic = lastRow.querySelector(".rule-logic");
          if (logic) logic.remove();
        }
      };
      row.appendChild(delBtn);
    }

    return row;
  }

  function collectCurrentVariableRules() {
    const result = {};

    document.querySelectorAll(".variable-group").forEach((group) => {
      const key = group.querySelector(".rule-label").textContent;
      const rules = [];
      const ruleRows = group.querySelectorAll(".rule-row");
      const logicInput = group.querySelector(".variable-logic");

      ruleRows.forEach((row) => {
        const selects = row.querySelectorAll("select");
        const inputs = row.querySelectorAll("input");
        if (selects.length >= 2 && inputs.length >= 1) {
          rules.push({
            field: selects[0].value, condition: selects[1].value, value: inputs[0].value,
          });
        }
      });
      const checkbox = group.querySelector(".display-if-exists");
      const displayIfExists = checkbox?.checked || false;
      result[key] = {
        rules, logic: logicInput?.value || "", displayIfExists,
      };
    });

    return result;
  }

  function populateVariableRules(existingRules = {}) {
    const container = document.getElementById("variableRulesContainer");
    container.innerHTML = "";

    variables.forEach((key) => {
      const wrapper = document.createElement("div");
      wrapper.className = "variable-group";
      wrapper.style.marginBottom = "20px";

      const rulesContainer = document.createElement("div"); // ✅ Add this
      rulesContainer.className = "rules-container";
      rulesContainer.style.marginTop = "5px";

      const labelWrapper = document.createElement("div");
      labelWrapper.style.display = "flex";
      labelWrapper.style.alignItems = "center";
      labelWrapper.style.marginBottom = "5px";
      labelWrapper.style.gap = "10px";

      const label = document.createElement("span");
      label.textContent = key;
      label.className = "rule-label";
      label.style.fontWeight = "bold";

      const logicInput = document.createElement("input");
      logicInput.type = "text";
      logicInput.placeholder = `Enter logic like 1 OR (2 AND 3) for ${key}`;
      logicInput.className = "variable-logic";
      logicInput.style.width = "99%";
      logicInput.style.marginTop = "10px";

      const addBtn = document.createElement("button");
      addBtn.textContent = "+ Add Rule";
      addBtn.style.margin = "10px 0";

      addBtn.onclick = () => {
        const currentRules = collectCurrentVariableRules();

        // Add an empty rule to this variable's rule list
        if (!currentRules[key]) {
          currentRules[key] = {rules: [], logic: ""};
        }

        currentRules[key].rules.push({
          field: "", condition: "", value: "",
        });

        populateVariableRules(currentRules);
      };

      // Re-populate existing rules for this variable (if any)
      const previous = existingRules[key];
      if (previous && previous.rules.length > 0) {
        previous.rules.forEach((ruleObj, idx) => {
          const row = createRuleRow(ruleObj, true, false); // no delete, no logic
          const numberLabel = document.createElement("span");
          numberLabel.textContent = `${idx + 1}. `;
          numberLabel.style.marginRight = "8px";
          row.prepend(numberLabel);
          rulesContainer.appendChild(row);
        });
        logicInput.value = previous.logic || "";
      } else {
        // Default to one empty rule
        const row = createRuleRow({}, true, false);
        const numberLabel = document.createElement("span");
        numberLabel.textContent = `1. `;
        numberLabel.style.marginRight = "8px";
        row.prepend(numberLabel);
        rulesContainer.appendChild(row);
      }
      // Create the display-if-exists checkbox
      //const checkboxWrapper = document.createElement('div');
      //checkboxWrapper.style.marginTop = '5px';

      const displayCheckbox = document.createElement("input");
      displayCheckbox.type = "checkbox";
      displayCheckbox.className = "display-if-exists";

      const checkboxLabel = document.createElement("label");
      checkboxLabel.textContent = "Display if value exists";
      checkboxLabel.style.marginLeft = "5px";
      checkboxLabel.style.fontWeight = "normal";

      labelWrapper.appendChild(label);
      // labelWrapper.appendChild(displayCheckbox);
      // labelWrapper.appendChild(checkboxLabel);
      const checkboxContainer = document.createElement("div");
      checkboxContainer.style.display = "flex";
      checkboxContainer.style.alignItems = "center";
      checkboxContainer.style.marginLeft = "auto";
      checkboxContainer.style.gap = "2px";

      checkboxContainer.appendChild(displayCheckbox);
      checkboxContainer.appendChild(checkboxLabel);

      labelWrapper.appendChild(label);
      labelWrapper.appendChild(checkboxContainer);

      // Set existing checkbox value if available
      if (existingRules[key]?.displayIfExists) {
        displayCheckbox.checked = true;
      }

      wrapper.appendChild(labelWrapper);
      wrapper.appendChild(rulesContainer);
      //wrapper.appendChild(checkboxWrapper);

      wrapper.appendChild(addBtn);
      wrapper.appendChild(logicInput);
      container.appendChild(wrapper);
    });
  }

  function openRuleModalForSection(sectionId) {
    if (!sectionId) {
      alert("Please select a valid section");
      return;
    }
    const modal = document.getElementById("ruleModal");
    modal.style.display = "flex";

    // Clear previous content
    const sectionWrapper = document.getElementById("sectionRulesWrapper");
    const variableContainer = document.getElementById("variableRulesContainer");
    const sectionLogicInput = document.getElementById("sectionLogicInput");
    sectionWrapper.innerHTML = "";
    variableContainer.innerHTML = "";
    sectionLogicInput.value = "";

    // Fetch saved rules for this section
    fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/get-rules/${encodeURIComponent(sectionId)}`)
      .then((res) => res.json())
      .then((data) => {
        const {
          sectionRules = [], variableRules = [], sectionLogic = null, variableLogic = [], displayIfExists = {},
        } = data;

        // Populate section rules in the modal
        if (sectionRules.length > 0) {
          sectionRules.forEach((rule, idx) => {
            const includeLogic = idx < sectionRules.length - 1;
            const row = createRuleRow({
              field: rule.field,
              condition: rule.condition,
              value: rule.value,
              logic: includeLogic ? sectionLogic?.expression || "AND" : undefined,
            }, true, includeLogic);

            const label = document.createElement("span");
            label.textContent = `${idx + 1}. `;
            label.style.marginRight = "8px";
            row.prepend(label);

            sectionWrapper.appendChild(row);
          });

          if (sectionLogic && sectionLogic.expression) {
            sectionLogicInput.value = sectionLogic.expression;
          }
        } else {
          addSectionRule();
        }

        // Group variable rules by variable name
        const groupedVars = {};
        variableRules.forEach((rule) => {
          if (!groupedVars[rule.variable]) groupedVars[rule.variable] = [];
          groupedVars[rule.variable].push(rule);
        });

        variables.forEach((variable) => {
          const wrapper = document.createElement("div");
          wrapper.className = "variable-group";
          wrapper.style.marginBottom = "20px";

          const labelWrapper = document.createElement("div");
          labelWrapper.style.display = "flex";
          labelWrapper.style.alignItems = "center";
          labelWrapper.style.marginBottom = "5px";
          labelWrapper.style.gap = "10px";

          const label = document.createElement("span");
          label.textContent = variable;
          label.className = "rule-label";
          label.style.fontWeight = "bold";

          const checkboxContainer = document.createElement("div");
          checkboxContainer.style.display = "flex";
          checkboxContainer.style.alignItems = "center";
          checkboxContainer.style.marginLeft = "auto";
          checkboxContainer.style.gap = "2px";

          const displayCheckbox = document.createElement("input");
          displayCheckbox.type = "checkbox";
          displayCheckbox.className = "display-if-exists";
          displayCheckbox.checked = displayIfExists[variable] || false;

          const checkboxLabel = document.createElement("label");
          checkboxLabel.textContent = "Display if value exists";
          checkboxLabel.style.marginLeft = "5px";
          checkboxLabel.style.fontWeight = "normal";

          checkboxContainer.appendChild(displayCheckbox);
          checkboxContainer.appendChild(checkboxLabel);

          labelWrapper.appendChild(label);
          labelWrapper.appendChild(checkboxContainer);

          wrapper.appendChild(labelWrapper);

          const rulesContainer = document.createElement("div");
          rulesContainer.className = "rules-container";
          rulesContainer.style.marginTop = "5px";

          const varRules = groupedVars[variable] || [];

          if (varRules.length > 0) {
            varRules.forEach((ruleObj, idx) => {
              const row = createRuleRow({
                field: ruleObj.field, condition: ruleObj.condition, value: ruleObj.value,
              }, true, false);

              const numberLabel = document.createElement("span");
              numberLabel.textContent = `${idx + 1}. `;
              numberLabel.style.marginRight = "8px";

              row.prepend(numberLabel);
              rulesContainer.appendChild(row);
            });
          } else {
            const row = createRuleRow({}, false, false);
            const numberLabel = document.createElement("span");
            numberLabel.textContent = "1. ";
            numberLabel.style.marginRight = "8px";
            row.prepend(numberLabel);
            rulesContainer.appendChild(row);
          }

          wrapper.appendChild(rulesContainer);
          const logicObj = variableLogic.find((vl) => vl.variable === variable);
          const logicExpression = logicObj ? logicObj.expression : "";

          const logicInput = document.createElement("input");
          logicInput.type = "text";
          logicInput.placeholder = `Enter logic like 1 OR (2 AND 3) for ${variable}`;
          logicInput.className = "variable-logic";
          logicInput.style.width = "99%";
          logicInput.style.marginTop = "10px";
          logicInput.value = logicExpression;

          wrapper.appendChild(logicInput);

          const addBtn = document.createElement("button");
          addBtn.textContent = "+ Add Rule";
          addBtn.style.margin = "10px 0";
          addBtn.onclick = () => {
            const currentRules = collectCurrentVariableRules();
            if (!currentRules[variable]) currentRules[variable] = {rules: [], logic: ""};
            currentRules[variable].rules.push({
              field: "", condition: "", value: "",
            });
            populateVariableRules(currentRules);
          };

          wrapper.appendChild(addBtn);

          variableContainer.appendChild(wrapper);
        });
      })
      .catch((err) => {
        console.error("Failed to load rules for section:", err);
        alert("Failed to load rules");
      });
  }

  const handleEditorChange = () => {
    const newContent = editorRef.current.innerHTML;
    setContent(newContent); // Sync content to React state
  };

  useEffect(() => {
    // Focus the editor when the component mounts
    if (editorRef.current) {
      editorRef.current.focus();
    }
    // Load section options
    generateSectionOptions();
    // Load font sizes
    generateFontSizeOptions();
    loadGlobalVariableKeys();
  }, []);

  useEffect(() => {
    if (section) {
      loadSectionContent();
      fetchAndDisplayRulesForSection(section);
    }
  }, [section])

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

  const handleVariableChange = (index, value) => {
    const updatedTable = [...variableTable];
    updatedTable[index].value = value;
    setVariableTable(updatedTable);
  };

  const updateFontWeight = (weight) => {
    if (!weight) return;

    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    if (range.collapsed) return; // nothing selected

    // Extract selected content
    const contents = range.extractContents();

    // Create styled span
    const span = document.createElement("span");
    span.style.fontWeight = weight;
    span.appendChild(contents);

    // Insert new span
    range.deleteContents();
    range.insertNode(span);

    // Move cursor after the span
    const newRange = document.createRange();
    newRange.setStartAfter(span);
    newRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(newRange);
  }

  return (<>
      <style>
        {`* {
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
          display: flex;
          align-items: center;
          background: #ffd600;
          height: 56px;
          padding: 0 20px;
          border-bottom: 1px solid #d6d6d6;
          margin-bottom: 24px;
      }
      
      header .logo {
          width: 40px;
          height: 40px;
          background: #121212;
          margin-right: 12px;
          clip-path: polygon(0 0, 100% 0, 70% 100%, 0% 100%);
      }
      
      header h1 {
          font-weight: 700;
          font-size: 20px;
          margin: 0;
          color: #121212;
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
      
      .toolbar button {
          margin-right: 5px;
      }
      
      /* Title and back button */
      /* h2 {
        font-weight: 700;
        font-size: 22px;
        margin-bottom: 24px;
      } */
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
      
      /* Updated Section Editor Container with grid */
      .section-block {
          background: #f8f8f8;
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 20px 24px;
          margin-bottom: 24px;
          display: grid;
          grid-template-columns: repeat(9, 160px); /* fixed width columns */
          grid-gap: 12px 20px;
          align-items: center;
      }
      
      /* Updated labels styling */
      .section-block label {
          font-weight: 600;
          font-size: 14px;
          color: #121212;
          white-space: nowrap;
      }
      
      /* Inputs and selects with fixed width and styling */
      .section-block select,
      .section-block input[type="text"],
      .section-block input[type="number"],
      .section-block input[type="color"] {
          padding: 8px 12px;
          font-size: 14px;
          border: 1.5px solid #ccc;
          border-radius: 6px;
          width: 160px; /* fixed width */
          background: #fff;
          box-sizing: border-box;
      }
      
      /* Select arrow styling */
      select {
          appearance: none;
          background-image: url('data:image/svg+xml;utf8,<svg fill="gray" height="10" viewBox="0 0 24 24" width="10" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>');
          background-repeat: no-repeat;
          background-position: right 12px center;
          background-size: 12px 12px;
      }
      
      /* Fix grid column spans for inputs - keep your original spans */
      #sectionSelect {
          grid-column: span 1;
      }
      
      #fontFamily {
          grid-column: span 1;
      }
      
      #fontSizeSelect {
          grid-column: span 1;
      }
      
      #fontWeight {
          grid-column: span 1;
      }
      
      #containerWidth {
          grid-column: span 1;
      }
      
      #fillColor {
          grid-column: span 1;
      }
      
      #paddingTop {
          grid-column: span 1;
      }
      
      #paddingBottom {
          grid-column: span 1;
      }
      
      #alignment {
          grid-column: span 1;
      }
      
      .container {
          background: #f1f1f1;
          padding: 15px 20px;
          border-radius: 5px;
      }
      
      .container-2 {
          border: 1px solid;
          background: #ffffff;
          padding: 15px 20px 60px 20px;
          border-radius: 5px;
      }
      
      h2 {
          font-weight: 600;
          margin-bottom: 15px;
      }
      
      .top-bar {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 10px;
      }
      
      .top-bar button {
          padding: 7px 16px;
          border: 1px solid #1a73e8;
          background: #fff;
          border-radius: 20px;
          color: #1a73e8;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s ease;
      }
      
      .top-bar button:hover {
          background-color: #1a73e8;
          color: white;
      }
      
      form {
          display: flex;
          flex-wrap: wrap;
          gap: 15px 30px;
          align-items: flex-end;
      }
      
      .form-group {
          display: flex;
          flex-direction: column;
          width: 160px;
      }
      
      label {
          font-weight: 600;
          margin-bottom: 4px;
          font-size: 0.9rem;
      }
      
      select,
      input[type="text"],
      input[type="color"] {
          padding: 7px 10px;
          border-radius: 4px;
          border: 1px solid #ccc;
          font-size: 0.9rem;
          width: 160px;
          box-sizing: border-box;
      }
      
      input[type="color"] {
          padding: 0;
          height: 35px;
          width: 160px;
      }
      
      /* Buttons container moved out of form flex flow */
      .buttons-container {
          display: flex;
          justify-content: flex-end;
          margin-top: 15px;
          gap: 15px;
      }
      
      button {
          background-color: black;
          color: #ffd400;
          font-weight: 600;
          border: none;
          padding: 8px 20px;
          border-radius: 20px;
          cursor: pointer;
          transition: background-color 0.3s ease;
      }
      
      .buttons-container button:hover {
          background-color: #333;
      }
      
      /* Responsive adjustments */
      @media (max-width: 720px) {
          form {
              flex-direction: column;
              gap: 15px 0;
              align-items: flex-start;
          }
      
          .form-group {
              width: 100%;
              max-width: 400px;
          }
      
          select,
          input[type="text"],
          input[type="color"] {
              width: 100%;
          }
      
          .buttons-container {
              justify-content: flex-start;
          }
      }
      
      /* Buttons container moved to next row spanning 2 columns */
      .section-editor-buttons {
          grid-column: span 2;
          justify-content: flex-end;
          display: flex;
          gap: 12px;
          margin-top: 12px; /* small top margin to separate from inputs */
      }
      
      /* Buttons styling */
      .section-editor-buttons button {
          background-color: #121212;
          color: #ffd600;
          border: none;
          padding: 8px 22px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 14px;
          transition: background-color 0.3s ease;
          cursor: pointer;
      }
      
      .section-editor-buttons button:hover {
          background-color: #333333;
      }
      
      /* Editor preview area */
      #editor {
          margin: auto;
          border: 2px solid #ccc;
          border-radius: 8px;
          padding: 10px;
          min-height: 200px;
          background: #ffffff;
          overflow: auto;
          width: 600px;
          box-sizing: border-box;
      }
      
      #editor * {
          max-width: 100% !important;
          box-sizing: border-box !important;
      }
      
      /* Variables and Rules container */
      .variables-rules-container {
          margin-top: 24px;
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
      }
      
      /* Variables and Rules boxes */
      .variables-box,
      .rules-box {
          background: #fff;
          border-radius: 8px;
          flex: 1 1 50%;
          min-width: 320px;
          border: 1px solid #ccc;
          display: flex;
          flex-direction: column;
          padding: 16px 20px;
      }
      
      .container-2 h3 {
          margin: 0 0 20px 0;
      }
      
      /* Headings */
      .variables-box h3,
      .rules-box h3 {
          font-weight: 700;
          font-size: 16px;
          margin: 0 0 12px 0;
      }
      
      /* Tables */
      table {
          border-collapse: collapse;
          width: 100%;
          font-size: 14px;
      }
      
      thead {
          background-color: #f0f4f7;
      }
      
      th,
      td {
          border: 1px solid #e0e4e8;
          padding: 10px 12px;
          text-align: left;
          vertical-align: middle;
      }
      
      th {
          font-weight: 600;
          color: #6b7280;
      }
      
      td select {
          padding: 6px 8px;
          font-size: 14px;
          border-radius: 6px;
          border: 1.5px solid #ccc;
          width: 100%;
      }
      
      /* Buttons in variables and rules boxes */
      .variables-box button,
      .rules-box button {
          align-self: flex-end;
          margin-top: auto;
          padding: 8px 20px;
          font-weight: 600;
          font-size: 14px;
          background-color: #121212;
          color: #ffd600;
          border: none;
          border-radius: 20px;
      }
      
      .rules-box button {
          align-self: flex-start;
      }
      
      /* Disabled button style */
      button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
          color: #999;
      }
      
      /* Footer */
      footer {
          text-align: center;
          margin: 32px 0;
          font-size: 12px;
          color: #6b7280;
      }
      
      /* Responsive: stack inputs and buttons on small screens */
      @media (max-width: 720px) {
          .section-block {
              display: flex;
              flex-wrap: wrap;
              gap: 12px 16px;
          }
      
          .section-block label,
          .section-block select,
          .section-block input[type="text"],
          .section-block input[type="number"],
          .section-block input[type="color"] {
              width: 100% !important;
          }
      
          /* Make buttons container full width and align right */
          .section-editor-buttons {
              grid-column: auto !important;
              width: 100%;
              justify-content: flex-end;
          }
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
      
      main {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 20px 24px;
          gap: 16px;
      }
      
      #savedRulesDisplay {
          background: #f9f9f9;
          border-radius: 8px;
          box-shadow: 0 2px 6px rgb(0 0 0 / 0.1);
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          color: #333;
          position: relative;
          min-height: 250px;
      }
      
      #savedRulesDisplay h3 {
          padding-bottom: 5px;
          margin-bottom: 10px;
          color: #2c3e50;
      }
      
      .rule-text {
          background: #ffffff;
          border-left: 4px solid #4a90e2;
          padding: 8px 12px;
          margin-bottom: 8px;
          border-radius: 3px;
          font-size: 14px;
          box-shadow: 0 1px 2px rgb(0 0 0 / 0.05);
          transition: background-color 0.3s ease;
          cursor: default;
          margin-bottom: 5px;
      }
      
      .rule-text:hover {
          background-color: #e6f0ff;
      }
      
      #savedSectionRules .rule-text {
          border-color: #2980b9;
      }
      
      #savedVariableRules .rule-text {
          border-color: #27ae60;
      }
      
      #savedVariableRules > div:first-child {
          font-size: 16px;
          color: #16a085;
          margin-top: 20px;
          margin-bottom: 6px;
      }`}
      </style>
      <NavMenu activeItem={1}/>

      <main>
        <div className="top-row">
          <h2>Template Library</h2>
          <a href="admin" className="back-home">Back to Home</a>
        </div>

        <div className="container">
          <h2>Section Editor with Variables Inputs</h2>
          <form>
            <div className="form-group">
              <label htmlFor="sectionSelect">Choose a Section</label>
              <select id="sectionSelect" name="section" value={section} onChange={(e) => setSection(e.target.value)}>
                <option value="" disabled>-- Select Section --</option>
                {generateSectionOptions()}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="fontFamily">Font Family</label>
              <select id="fontFamily" name="font-family" value={fontFamily}
                      onChange={(e) => setFontFamily(e.target.value)}>
                <option value="" disabled>-- Select --</option>
                <option>Arial</option>
                <option>Georgia</option>
                <option>Tahoma</option>
                <option>Verdana</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="fontSizeSelect">Font Size(px)</label>
              <select id="fontSizeSelect" value={fontSize} onChange={(e) => setFontSize(e.target.value)}>
                <option value="">-- Select --</option>
                {generateFontSizeOptions()}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="fontWeight">Font Weight</label>
              <select id="fontWeight" name="fontWeight" value={fontWeight}
                      onChange={(e) => updateFontWeight(e.target.value)}>
                <option value="" disabled>-- Select --</option>
                <option value="100">100</option>
                <option value="200">200</option>
                <option value="300">300</option>
                <option value="400">400</option>
                <option value="500">500</option>
                <option value="600">600</option>
                <option value="700">700</option>
                <option value="800">800</option>
                <option value="900">900</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="containerWidth">Container Width(px)</label>
              <input id="containerWidth" type="text" value={containerWidth}
                     onChange={(e) => setContainerWidth(e.target.value)}/>
            </div>

            <div className="form-group">
              <label htmlFor="bgColor">Fill Color</label>
              <input type="color" id="bgColor" name="bgColor" value={bgColor}
                     onChange={(e) => setBgColor(e.target.value)}/>
            </div>

            <div className="form-group">
              <label htmlFor="paddingTop">Padding Top</label>
              <input type="text" id="paddingTop" value={paddingTop} onChange={(e) => setPaddingTop(e.target.value)}/>
            </div>

            <div className="form-group">
              <label htmlFor="paddingBottom">Padding Bottom</label>
              <input type="text" id="paddingBottom" value={paddingBottom}
                     onChange={(e) => setPaddingBottom(e.target.value)}/>
            </div>

            <div className="form-group">
              <label htmlFor="alignment">Alignment</label>
              <select id="alignment" name="alignment" value={alignment} onChange={(e) => setAlignment(e.target.value)}>
                <option value="" disabled>-- Select --</option>
                <option>Left</option>
                <option>Center</option>
                <option>Right</option>
              </select>
            </div>
          </form>

          <div className="buttons-container">
            <button type="button" onClick={handleApplyStyle}>Apply Style</button>
            <button type="button">Preview Saved HTML</button>
          </div>
        </div>

        <div
          id="editor"
          ref={editorRef}
          // contentEditable="true"
          placeholder="Type your content with {{variables}} here..."
          // Render content
          onInput={handleEditorChange} // Handle content updates
          style={{minHeight: '300px', border: '1px solid #ccc', padding: '10px'}}
        >
          <h2 style={{textAlign: "center", color: "#c2c2c2"}}>Preview Here</h2>
        </div>

        <div style={{display: "flex", width: "100%", gap: "20px", marginTop: "20px"}}>
          <div
            style={{
              width: "50%", display: "flex", flexDirection: "column", position: "relative",
            }}
          >
            <div className="container-2" style={{flexGrow: 1}}>
              <div
                style={{display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px"}}>
                <h3 style={{margin: 0}}>Variables</h3>
                <button onClick={handleExtractVariables}>Extract Variables
                </button>
              </div>
              <table id="variableTable" style={{width: "100%"}}>
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
                        onChange={(e) => handleVariableChange(index, e.target.value)}
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

              <br/>
              <div
                style={{
                  alignSelf: "flex-start",
                  margin: "10px auto",
                  marginBottom: "10px",
                  position: "absolute",
                  bottom: "2px",
                  right: "10px"
                }}
              >
                <button onClick={handleSaveWithReplacedVariables}>
                  Save Section
                </button>
              </div>
            </div>
          </div>

          <div
            style={{
              width: "50%", display: "flex", flexDirection: "column", position: "relative",
            }}
          >
            <div></div>
            <div className="container-2" style={{flexGrow: 1}} id="savedRulesDisplay">
              <h3>Rules</h3>
              <div id="savedSectionRules"></div>
              <div id="savedVariableRules"></div>

              <button
                style={{
                  alignSelf: "flex-start",
                  margin: "0 auto",
                  marginBottom: "10px",
                  position: "absolute",
                  bottom: "2px",
                  right: "10px"
                }}
                onClick={() => openRuleModalForSection(section)}
                id="addRuleBtn"
              >
                Edit Rules
              </button>
            </div>

          </div>
        </div>
        <div className="modal" id="ruleModal">
          <div className="modal-content">
            <span className="close-btn" onClick={closeModal}>&times;</span>

            {/* Tab navigation */}
            <div className="tabs">
              <div
                className={`tab ${activeTab === 'section' ? 'active' : ''}`}
                onClick={() => switchTab('section')}
              >
                Section
              </div>
              <div
                className={`tab ${activeTab === 'variables' ? 'active' : ''}`}
                onClick={() => switchTab('variables')}
              >
                Variables
              </div>
            </div>

            {/* Tab content */}
            <div id="section" className={`tab-content ${activeTab === 'section' ? 'active' : ''}`}>
              <div id="sectionRulesContainer"></div>
              <div id="sectionRulesWrapper"></div>
              <button onClick={addSectionRule}>+ Add Section Rule</button>

              <div style={{marginTop: '10px'}}>
                <label htmlFor="sectionLogicInput">
                  <strong>Logic Expression (e.g., 1 OR (2 AND 3))</strong>
                </label>
                <br/>
                <input
                  id="sectionLogicInput"
                  type="text"
                  style={{width: '100%', padding: '4px'}}
                  placeholder="Enter logic like 1 OR (2 AND 3)"
                  value={sectionLogic}
                  onChange={(e) => setSectionLogic(e.target.value)}
                />
              </div>

              <div style={{marginTop: '10px'}}>
                <label htmlFor="sectionLogicExpr">
                  <strong>Section Logic Expression</strong> (e.g., "1 OR (2 AND 3)"):</label>
                <input
                  type="text"
                  id="sectionLogicExpr"
                  style={{width: '99%'}}
                  value={sectionLogicExpr}
                  onChange={(e) => setSectionLogicExpr(e.target.value)}
                />
              </div>
            </div>

            <div id="variables" className={`tab-content ${activeTab === 'variables' ? 'active' : ''}`}>
              <div id="variableRulesContainer"></div>
            </div>

            <button onClick={saveRules} style={{margin: '10px 0'}}>
              Save Rules
            </button>
          </div>
        </div>

        <div className="saved-rules" id="savedRulesWrapper" style={{display: "none"}}>
          <div id="savedSectionRules" className="rule-section"></div>
          <div id="savedVariableRules" className="rule-section"></div>
        </div>
        <footer>© 2025 Western Union Holdings, Inc. All Rights Reserved</footer>
      </main>
    </>

  );
};

export default TemplateLibrary;