const selectedOptionsMap = new Map(); // Track selected options globally
let sectionHtmlData;
let currentTopPosition = top; // Track current top position for pushing down elements

function showContent(selectElement, uniqueId) {
  extractVariables();

  const prevSelectedOption = selectedOptionsMap.get(uniqueId);
  const newSelectedOption = selectElement.value;

  // Update the map with the new selection for this dropdown
  selectedOptionsMap.set(uniqueId, newSelectedOption);

  // Hide all dropdown content for this canvas-object
  const parent = document.getElementById(uniqueId);
  const allContentDivs = parent.querySelectorAll(".dropdown-content");
  allContentDivs.forEach((content) => (content.style.display = "none"));

  // Show the selected content div
  const contentToShow = parent.querySelector(
    `#content-for-${uniqueId}-option-${newSelectedOption}`
  );
  if (contentToShow) {
    contentToShow.style.display = "block";
    contentToShow.innerHTML = "<p>Loading...</p>";

    const sectionFilePath = `/sections/section-${newSelectedOption}.html`;
    fetch(sectionFilePath)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load the section file");
        return response.text();
      })
      .then((data) => {
        sectionHtmlData = data;
        contentToShow.innerHTML = data;

        extractVariables();

        setTimeout(adjustObjectPositions, 50);
      })
      .catch(() => {
        contentToShow.innerHTML =
          "<p>Failed to load content. Please try again later.</p>";
      });
  }

  // Update the disabled state of all dropdown options globally
  updateDropdownOptions();
}

// Load content for all fixed sections
function loadAllFixedObjectContents() {
  // Find all fixed-canvas-objects
  const fixedObjects = document.querySelectorAll('.fixed-canvas-object');
  fixedObjects.forEach(fixedObj => {
    // The section number is in the id: "fixed-canvas-object-<number>"
    const match = fixedObj.id.match(/^fixed-canvas-object-(\d+)$/);
    if (!match) return;
    const sectionNum = match[1];
    const contentDiv = document.getElementById(`content-for-fixed-object-section-${sectionNum}`);
    if (contentDiv) {
      contentDiv.innerHTML = "<p>Loading...</p>";
      fetch(`/sections/section-${sectionNum}.html`)
        .then((response) => {
          if (!response.ok) throw new Error(`Failed to load Section ${sectionNum}`);
          return response.text();
        })
        .then((data) => {
          contentDiv.innerHTML = data;
          setTimeout(adjustObjectPositions, 50);
        })
        .catch(() => {
          contentDiv.innerHTML = "<p>Failed to load content. Please try again later.</p>";
          setTimeout(adjustObjectPositions, 50);
        });
    }
  });
}

window.addEventListener("DOMContentLoaded", function () {
  loadAllFixedObjectContents();
  updateDropdownOptions();
});


// Function to update all dropdowns by disabling already selected options
function updateDropdownOptions() {
  const dropdowns = document.querySelectorAll(".canvas-object select");
  // Build a set of all selected values, keyed by dropdown id
  const selectedValues = {};
  dropdowns.forEach((dropdown) => {
    const parentId = dropdown.closest(".canvas-object").id;
    selectedValues[parentId] = dropdown.value;
  });

  // For each dropdown, disable options selected in other dropdowns
  dropdowns.forEach((dropdown) => {
    const parentId = dropdown.closest(".canvas-object").id;
    const currentValue = selectedValues[parentId];
    dropdown.querySelectorAll("option").forEach((option) => {
      // Enable all first
      option.disabled = false;
      // Disable option if it's selected in other dropdowns (not this one)
      if (
        option.value !== "" && // skip empty option
        option.value !== currentValue && // don't disable selected option in current dropdown
        Object.values(selectedValues).includes(option.value)
      ) {
        option.disabled = true;
      }
    });
  });
}

function adjustObjectPositions() {
  const canvas = document.getElementById("canvas-container");
  const objects = Array.from(canvas.getElementsByClassName("canvas-object"));

  let currentTop = 0; // Start from the top of the canvas
  const gap = 10; // Margin between objects

  objects.forEach((obj) => {
    obj.style.position = 'absolute'; // Ensure absolute positioning
    obj.style.top = currentTop + "px";
    const height = obj.offsetHeight; // Use actual rendered height
    currentTop += height + gap;
  });

  // Optionally, set the container height to fit all objects
  canvas.style.position = "relative";
  canvas.style.height = currentTop + "px";
}

function showPreview() {
  const sections = document.querySelectorAll(".canvas-object");
  let previewHTML = "";

  // In order: for each object, if fixed, show its fixed content, else show selected content
  sections.forEach((section) => {
    if (section.classList.contains('fixed-canvas-object')) {
      // Fixed section: load its content
      const match = section.id.match(/^fixed-canvas-object-(\d+)$/);
      if (!match) return;
      const sectionNum = match[1];
      const contentDiv = document.getElementById(`content-for-fixed-object-section-${sectionNum}`);
      if (contentDiv) {
        previewHTML += contentDiv.innerHTML;
      }
    } else {
      // Selectable section: show selected content
      const dropdown = section.querySelector("select");
      const selectedOption = dropdown ? dropdown.value : null;
      if (selectedOption) {
        const contentToDisplay = section.querySelector(
          `#content-for-${section.id}-option-${selectedOption}`
        );
        if (contentToDisplay) {
          previewHTML += `
            <div class="section-preview">
              <div class="section-content">
                ${contentToDisplay.innerHTML}
              </div>
            </div>`;
        }
      }
    }
  });

  if (previewHTML) {
    document.getElementById("previewContent").innerHTML = previewHTML;
    document.getElementById("popup").style.display = "flex";
  } else {
    alert("Please select an option in each section for the preview.");
  }
}

// Function to close the popup
function closePopup() {
  document.getElementById("popup").style.display = "none";
}

let variables = []; // Replace with dynamic later
const savedRules = [];
let currentVariableRuleState = {};

const fields = ["Country", "Region", "Customer", "Agent"];
const conditions = [
  "Equals to",
  "Not equals to",
  "Contains",
  "Greater than",
  "Less than",
];

// Function to close the popup
function closePopup() {
  document.getElementById("popup").style.display = "none";
}

function setDynamicValues() {
  localStorage.setItem("receiptTitle", "RECEIPT/RECIBO");
  localStorage.setItem("customerServiceNumber", "1-800-777-8784");
  localStorage.setItem("dateOfTransactions", "December 05, 2024");
}

window.addEventListener("DOMContentLoaded", setDynamicValues);
/* Template Editor functionality */

let activeSectionId = null; // This tracks which section's "Add Rule" is clicked

const path = window.location.pathname;
const filename = path.substring(path.lastIndexOf("/") + 1);
const currentRegion = filename.split(".")[0];

document.querySelectorAll(".addRuleBtn").forEach((button) => {
  button.addEventListener("click", (event) => {
    // Find the closest container that holds both the button and the select
    const container = button.closest(".canvas-object");
    if (!container) return;

    // Find the select dropdown inside this container
    const sectionSelect = container.querySelector("#sectionSelect");
    if (!sectionSelect) {
      alert("Section select not found.");
      return;
    }

    const selectedSection = sectionSelect.value;
    if (!selectedSection) {
      alert("Please select a section first.");
      return;
    }

    openRuleModalForSection(selectedSection);
  });
});

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
  extractVariables();

  // Fetch saved rules for this section
  fetch(
    `/rules/${encodeURIComponent(sectionId)}?region=${encodeURIComponent(
      currentRegion
    )}`
  )
    .then((res) => res.json())
    .then((data) => {
      const {
        sectionRules = [],
        variableRules = [],
        sectionLogic = null,
        variableLogic = [],
        displayIfExists = {},
      } = data;

      // Populate section rules in the modal
      if (sectionRules.length > 0) {
        sectionRules.forEach((rule, idx) => {
          const includeLogic = idx < sectionRules.length - 1;
          const row = createRuleRow(
            {
              field: rule.field,
              condition: rule.condition,
              value: rule.value,
              logic: includeLogic
                ? sectionLogic?.expression || "AND"
                : undefined,
            },
            true,
            includeLogic
          );

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
        checkboxContainer.style.whiteSpace = "nowrap";
        checkboxContainer.style.flexWrap = "nowrap";

        const displayCheckbox = document.createElement("input");
        displayCheckbox.type = "checkbox";
        displayCheckbox.className = "display-if-exists";
        displayCheckbox.checked = displayIfExists[variable] || false;

        const checkboxLabel = document.createElement("label");
        checkboxLabel.textContent = "Display if value exists";
        checkboxLabel.style.marginLeft = "5px";
        checkboxLabel.style.fontWeight = "normal";
        checkboxLabel.style.whiteSpace = "nowrap";

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
            const row = createRuleRow(
              {
                field: ruleObj.field,
                condition: ruleObj.condition,
                value: ruleObj.value,
              },
              true,
              false
            );

            const numberLabel = document.createElement("span");
            numberLabel.textContent = `${idx + 1}. `;
            numberLabel.style.marginRight = "8px";

            row.prepend(numberLabel);
            rulesContainer.appendChild(row);
          });
        } else {
          const row = createRuleRow({}, true, false);
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
        logicInput.style.width = "100%";
        logicInput.style.marginTop = "10px";
        logicInput.value = logicExpression;

        wrapper.appendChild(logicInput);

        const addBtn = document.createElement("button");
        addBtn.textContent = "+ Add Rule";
        addBtn.style.margin = "10px 0";
        addBtn.onclick = () => {
          const currentRules = collectCurrentVariableRules();
          if (!currentRules[variable])
            currentRules[variable] = {rules: [], logic: ""};
          currentRules[variable].rules.push({
            field: "",
            condition: "",
            value: "",
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

function closeModal() {
  document.getElementById("ruleModal").style.display = "none";
}

function switchTab(tabId) {
  document
    .querySelectorAll(".tab")
    .forEach((tab) => tab.classList.remove("active"));
  document
    .querySelectorAll(".tab-content")
    .forEach((tc) => tc.classList.remove("active"));
  document
    .querySelector(`.tab[onclick="switchTab('${tabId}')"]`)
    .classList.add("active");
  document.getElementById(tabId).classList.add("active");
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
    delBtn.style.margin = 0;
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
    logicInput.style.width = "100%";
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
        field: "",
        condition: "",
        value: "",
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
    checkboxContainer.style.whiteSpace = "nowrap";
    checkboxContainer.style.flexWrap = "nowrap";

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
          field: selects[0].value,
          condition: selects[1].value,
          value: inputs[0].value,
        });
      }
    });
    const checkbox = group.querySelector(".display-if-exists");
    const displayIfExists = checkbox?.checked || false;
    result[key] = {
      rules,
      logic: logicInput?.value || "",
      displayIfExists,
    };
  });

  return result;
}

function saveRules() {
  const allRules = [];

  // Collect SECTION rules
  const sectionRows = document.querySelectorAll(
    "#sectionRulesWrapper .rule-row"
  );
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
      type: "sectionLogic",
      expression: sectionLogicExpression,
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
        type: "variableLogic",
        variable: key,
        expression: logicExpr,
      });
    }

    const checkbox = group.querySelector(".display-if-exists");
    if (checkbox?.checked) {
      allRules.push({
        type: "displayIfExists",
        variable: key,
        display: true,
      });
    }
  });

  savedRules.length = 0;
  savedRules.push(...allRules);
  const sectionRules = allRules.filter((r) => r.type === "section");
  const variableRules = allRules.filter((r) => r.type === "variable");
  const sectionLogic = allRules.find((r) => r.type === "sectionLogic") || null;
  const variableLogic =
    allRules.filter((r) => r.type === "variableLogic") || null;

  const sectionKey = document.getElementById("sectionSelect").value;
  if (!sectionKey) {
    alert("Please select a section.");
    return;
  }

  // Compose data object to send to server
  const rulesToSave = {
    sectionRules,
    variableRules,
    sectionLogic,
    variableLogic,
  };

  fetch(
    `/rules/${sectionKey}?region=${encodeURIComponent(currentRegion)}`,
    {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(rulesToSave),
    }
  )
    .then((res) => res.text())
    .then((msg) => {
      alert("Rules saved successfully");
      closeModal();
    })
    .catch((err) => {
      alert("Failed to save rules: " + err.message);
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
  const variableLogicRules = savedRules.filter(
    (rule) => rule.type === "variableLogic"
  );

  if (sectionRules.length > 0) {
    sectionDiv.innerHTML = "<h3>Section Rules</h3>";
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
    sectionDiv.innerHTML =
      '<h3>Section Rules</h3><div class="rule-text">No rules were defined</div>';
  }

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

      const rules = grouped[key];

      rules.forEach((rule, index) => {
        const p = document.createElement("div");
        p.className = "rule-text";
        p.textContent = `${index + 1}. ${rule.description}`;
        variableDiv.appendChild(p);
      });

      const displaySetting = savedRules.find(
        (rule) => rule.type === "displayIfExists" && rule.variable === key
      );
      if (displaySetting) {
        const displayLine = document.createElement("div");
        displayLine.className = "rule-text";
        displayLine.style.fontStyle = "italic";
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
    variableDiv.innerHTML =
      '<h3>Variable Rules</h3><div class="rule-text">No rules were defined</div>';
  }

  if (sectionRules.length > 0 || variableRules.length > 0) {
    wrapper.style.display = "block";
  }
}

let globalVariableKeys = [];

function loadGlobalVariableKeys() {
  fetch("/globals")
    .then((res) => res.json())
    .then((data) => {
      globalVariableKeys = Object.keys(data);
    })
    .catch((err) => {
      console.error("Failed to load global variables:", err);
      globalVariableKeys = [];
    });
}

// Load on page start
loadGlobalVariableKeys();

const sectionSelect = document.getElementById("sectionSelect");
for (let i = 1; i <= 30; i++) {
  const option = document.createElement("option");
  option.value = `section-${i}`;
  option.textContent = `Section - ${i}`;
  sectionSelect.appendChild(option);
}

document.getElementById("sectionSelect").addEventListener("change", (e) => {
  const selectedSection = e.target.value;
  // your existing content load function
  loadSectionContent();

  // fetch and display saved rules
  fetchAndDisplayRulesForSection(selectedSection);
});

function fetchAndDisplayRulesForSection(sectionId) {
  if (!sectionId) {
    document.getElementById("savedSectionRules").innerHTML = "";
    document.getElementById("savedVariableRules").innerHTML = "";
    return;
  }

  fetch(`/rules/${sectionId}`)
    .then((res) => res.json())
    .then((data) => {
      const {
        sectionRules = [],
        variableRules = [],
        sectionLogic,
        variableLogic = [],
      } = data;
      const sectionDiv = document.getElementById("savedSectionRules");
      const variableDiv = document.getElementById("savedVariableRules");

      // --- Section Rules ---
      sectionDiv.innerHTML = "<h3>Section Rules</h3>";
      if (sectionRules.length === 0) {
        sectionDiv.innerHTML +=
          '<div class="rule-text">No section rules defined</div>';
      } else {
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
      variableDiv.innerHTML =
        "<h3 style='margin-top:10px'>Element Specific Rules</h3>";
      if (variableRules.length === 0) {
        variableDiv.innerHTML +=
          '<div class="rule-text">No variable rules defined</div>';
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

function loadSectionContent() {
  const sectionKey = sectionSelect.value;
  const editor = document.getElementById("editor");
  const tbody = document.querySelector("#variableTable tbody");

  editor.innerHTML = "";
  tbody.innerHTML = "";

  if (!sectionKey) return;

  fetch(`/sections/${encodeURIComponent(sectionKey)}`)
    .then((res) => res.json())
    .then((data) => {
      const editor = document.getElementById("editor");
      editor.innerHTML = sanitizeLoadedContent(data.content || "");

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

      // Delay variable extraction to wait for DOM update
      setTimeout(() => {
        extractVariables();
      }, 0);
    })
    .catch((err) => {
      console.error("Error loading section:", err);
      alert("Failed to load section");
    });
}

function extractVariables() {
  if (!sectionHtmlData) {
    console.warn("No section HTML data loaded yet.");
    return;
  }

  // Match {{variable_name}} pattern
  const matches = [...sectionHtmlData.matchAll(/{{\s*([\w\d_]+)\s*}}/g)];
  const uniqueVars = [...new Set(matches.map((m) => m[1]))];

  variables = uniqueVars;
}

function deleteCanvasObject(id) {
  const element = document.getElementById(`canvas-object-${id}`);
  if (element) {
    element.remove();
  }
}

let canvasObjectCount = document.querySelectorAll(".canvas-object").length;

function createCanvasObject(id, topPosition) {
  const container = document.createElement("div");
  container.className = "canvas-object";
  container.id = `canvas-object-${id}`;
  container.style.position = "absolute";
  container.style.left = "120px";
  container.style.top = `${topPosition}px`; // Use computed top position here
  container.style.width = "323px";
  container.style.minHeight = "60px";

  container.innerHTML = `
 <div style="display: flex; justify-content: space-between; align-items: center;">
  <select id="sectionSelect" onchange="showContent(this, 'canvas-object-${id}')" style="width: fit-content;">
    <option value="">-- Select --</option>
    ${[...Array(30).keys()]
    .map((i) => `<option value="${i + 1}">Section ${i + 1}</option>`)
    .join("")}
  </select>

  <div style="display: flex; align-items: center; gap: 8px;">
    <button
    style="
              align-self: flex-start;
              margin: 0;
              padding: 8px 12px;
              position: relative;
              cursor: pointer;
            "
  class="deleteSectionBtn"
  title="Delete Section"
  onclick="deleteCanvasObject('${id}')"
  aria-label="Delete section"
  type="button"
>
  <!-- Dustbin / Trash SVG icon -->
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M5.5 5.5A.5.5 0 0 1 6 5h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5zm1-3a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1h3a.5.5 0 0 1 0 1h-1.086l-.707.707A1 1 0 0 1 10 5H6a1 1 0 0 1-1-1H3.5a.5.5 0 0 1 0-1h3zm1 6a.5.5 0 0 1 .5.5V12a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5zM4.118 4L4 4.06V13a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V4.06L11.882 4H4.118zM2.5 3a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
  </svg>
</button>
    <button
      style="
              align-self: flex-start;
              margin: 0;
              padding: 8px 12px;
              position: relative;
              cursor: pointer;
            "
      class="addRuleBtn"
      title="Edit Rule"
      style="cursor: pointer;"
    >
      <!-- pencil svg -->
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2L14 4.793 13.207 5.586 10.414 2.793 11.207 2zm1.586 3L12 4.793 3 13.793V14h.207L13.793 5z"/>
      </svg>
    </button>
  </div>
</div>
  `;

  // Append dropdown-content divs for options 1-30
  for (let i = 2; i <= 30; i++) {
    const div = document.createElement("div");
    div.className = "dropdown-content";
    div.id = `content-for-canvas-object-${id}-option-${i}`;
    div.style.display = "none";
    div.innerHTML = `
      <p><strong>Dummy Content for Text - Option ${i}:</strong> This is the content for option ${i}.</p>
      <p>Additional information or content for this option can be added here.</p>
    `;
    container.appendChild(div);
  }

  const addRuleBtn = container.querySelector(".addRuleBtn");
  addRuleBtn.addEventListener("click", (event) => {
    // Find the closest container that holds this button
    const container = addRuleBtn.closest(".canvas-object");
    if (!container) return;

    // Find the select dropdown inside this container
    const sectionSelect = container.querySelector("#sectionSelect");
    if (!sectionSelect) {
      alert("Section select not found.");
      return;
    }

    const selectedSection = sectionSelect.value;
    if (!selectedSection) {
      alert("Please select a section first.");
      return;
    }

    openRuleModalForSection(selectedSection);
  });

  return container;
}

document.getElementById("addLayoutSectionBtn").addEventListener("click", () => {
  const canvasObjects = document.querySelectorAll(".canvas-object");
  let newTop = 40; // default top if none exist

  if (canvasObjects.length > 0) {
    const last = canvasObjects[canvasObjects.length - 1];
    // Calculate bottom position of last canvas object (top + height)
    newTop = last.offsetTop + last.offsetHeight + 20; // add 20px margin
  }

  const newId = canvasObjectCount++;
  const newCanvasObject = createCanvasObject(newId, newTop);
  document.getElementById("canvas-container").appendChild(newCanvasObject);
});

window.getPreviewHTML = function () {
  const sections = document.querySelectorAll(".canvas-object");
  let previewHTML = "";

  sections.forEach((section) => {
    if (section.classList.contains('fixed-canvas-object')) {
      const match = section.id.match(/^fixed-canvas-object-(\d+)$/);
      if (!match) return;
      const sectionNum = match[1];
      const contentDiv = document.getElementById(`content-for-fixed-object-section-${sectionNum}`);
      if (contentDiv) {
        previewHTML += contentDiv.innerHTML;
      }
    } else {
      const dropdown = section.querySelector("select");
      const selectedOption = dropdown ? dropdown.value : null;
      if (selectedOption) {
        const contentToDisplay = section.querySelector(
          `#content-for-${section.id}-option-${selectedOption}`
        );
        if (contentToDisplay) {
          previewHTML += `
            <div class="section-preview">
              <div class="section-content">
                ${contentToDisplay.innerHTML}
              </div>
            </div>`;
        }
      }
    }
  });

  return previewHTML || null;
};

window.addEventListener('message', (event) => {
  // if (event.origin !== 'http://localhost:5173' || event.origin !== 'https://wu-react-app-3.onrender.com') return; // Security check

  if (event.data.type === 'GET_PREVIEW_HTML') {
    const previewHTML = getPreviewHTML(); // Your existing function
    event.source.postMessage({
      type: 'PREVIEW_HTML_RESPONSE',
      html: previewHTML
    }, event.origin);
  }
});