import React, { useState } from "react";
import WU from "../assets/images/WU.png";
import {useNavigate} from "react-router-dom";

// Inline styles from CSS (not all, but the most relevant for the component)
const styles = {
  body: {
    margin: 0,
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#f1d837",
    color: "white",
    padding: 15,
  },
  headerTitle: {
    fontSize: "1.6em",
    color: "#000",
    fontWeight: "bold",
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
  },
  dropdownGroup: {
    marginTop: 10,
  },
  contentBox: {
    backgroundColor: "#e6f0ff",
    color: "#000",
    padding: 10,
    marginTop: 10,
    borderRadius: 6,
  },
  mainContainer: {
    marginTop: 40,
    border: "1px solid black",
    display: "flex",
    minHeight: "30vh",
    borderTop: "2px solid #ccc",
    borderBottom: "2px solid #ccc",
  },
  leftPanel: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#e6f0ff",
    padding: 15,
    borderRight: "1px solid #ccc",
  },
  section: {
    marginTop: 20,
    width: "45%",
    paddingRight: 10,
  },
  separator: {
    border: 0,
    borderLeft: "1px solid #ccc",
    height: "auto",
    margin: "0 10px",
  },
  rightPanel: {
    marginTop: 10,
    padding: "6px 10px",
    borderRadius: 10,
    background: "white",
  },
  footer: {
    backgroundColor: "#f1d837",
    color: "white",
    padding: 15,
    marginTop: 40,
  },
  indexContentBox: {
    color: "#000",
    textAlign: "center",
  },
  previewButtonContainer: {
    display: "flex",
    justifyContent: "space-between",
    width: "55%",
    textAlign: "center",
    marginTop: 20,
  },
  previewButton: {
    padding: "6px 10px",
    fontSize: 16,
    cursor: "pointer",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: 5,
    marginLeft: 10,
  },
  popup: {
    display: "none", // Will be set to flex when open
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  popupContent: {
    background: "#fff",
    padding: "0 30px 30px 30px",
    width: "80%",
    maxWidth: 800,
    maxHeight: "80%",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    textAlign: "left",
    overflowY: "auto",
  },
  previewHeading: {
    marginTop: 0,
    color: "#333",
    fontSize: 24,
    textAlign: "center",
    borderBottom: "2px solid #ddd",
    padding: "20px 0",
    position: "sticky",
    top: 0,
    backgroundColor: "#fff",
    zIndex: 1,
  },
  closeButtonContainer: {
    textAlign: "center",
    marginTop: 20,
  },
  hr: {
    height: "100%",
    width: 1,
    border: "none",
    backgroundColor: "#ccc",
  },
};

const headerOptions = [
  { value: "", label: "-- Select --" },
  { value: "receipt", label: "Header 1" },
  { value: "statement", label: "Header 2" },
  { value: "year", label: "Header 3" },
];

const leftSectionOptions = [
  { value: "", label: "-- Select Info --" },
  { value: "tracking", label: "TRACKING" },
  { value: "about", label: "SERVICE DETAILS/SENDER/REMITENTE" },
  { value: "services", label: "TRANSACTION DETAILS" },
  { value: "contact", label: "RECEIVER/DESTINATARIO" },
];

const footerOptions = [
  { value: "", label: "Select" },
  { value: "support", label: "Support Info" },
  { value: "policy", label: "Return Policy" },
];

// Content functions (from JS)
function getHeaderContent(value) {
  if (value === "receipt") {
    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src={WU}
          alt="Random Logo"
          style={{
            maxWidth: 180,
            height: 40,
            float: "left",
            borderRadius: "50%",
            marginRight: 10,
          }}
        />
        <h3 style={{ textAlign: "center", paddingLeft: 24, margin: 0 }}>
          RECEIPT/RECIBO
        </h3>
      </div>
    );
  } else if (value === "statement") {
    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src={WU}
          alt="Random Logo"
          style={{
            maxWidth: 180,
            height: 40,
            float: "right",
            borderRadius: "50%",
            marginLeft: 10,
          }}
        />
        <h3 style={{ textAlign: "center", paddingLeft: 24, margin: 0 }}>
          RECEIPT/RECIBO
        </h3>
      </div>
    );
  } else if (value === "year") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          marginBottom: 20,
        }}
      >
        <img
          src={WU}
          alt="Random Logo"
          style={{
            maxWidth: 180,
            height: 40,
            borderRadius: "50%",
            objectFit: "contain",
          }}
        />
        <div>
          <p
            style={{
              textAlign: "center",
              fontSize: "1.2rem",
              fontWeight: "bold",
              color: "#333",
              margin: 0,
            }}
          >
            RECEIPT / RECIBO
          </p>
        </div>
      </div>
    );
  }
  return null;
}

function getFooterContent(value) {
  if (value === "support") {
    return (
      <p>
        In addition to the transfer fee, Western Union makes money when it
        changes your dollars into foreign currency. See the Terms &amp;
        Conditions for more information about currency exchange. If the exchange
        rate for your transaction was determined at the time you sent the money,
        the currency to be paid out and the exchange rate are listed on your
        receipt. Otherwise, the exchange rate will be set when the receiver
        receives the funds.
      </p>
    );
  } else if (value === "policy") {
    return (
      <p>
        For inquiries or comments please write to:/Si tiene preguntas o
        comentarios, escriba a: <br />
        <strong>WESTERN UNION</strong>
        <br />
        P.O. Box 6036, Englewood, CO 80155 <br />
        Full Terms &amp; Conditions including important provisions regarding
        limitations of liability, resolution of disputes, and administration
        charges are available by asking your Agent for a copy, calling
        1-800-325-6000, or visiting Go.Wu.Com/Terms.<br />
        /Términos y condiciones completos, incluidas las disposiciones
        importantes relacionadas con las limitaciones de responsabilidad, la
        resolución de disputas y los cargos de administración disponibles
        mediante la solicitud de una copia a tu Agencia, llamando al
        1-800-325-6000 o visitando Go.Wu.Com/Terms.
      </p>
    );
  }
  return null;
}


function getLeftSectionContent(value) {
  if (value === "about") {
    return (
      <>
        <div className="section-SERVICE DETAILS">
          <h4 style={{ paddingTop: -10 }}>SERVICE DETAILS/DETALLES DEL SERVICIO:</h4>
          <div className="row">
            <span>Date of Transactions:</span>
            <span>December 05, 2024 / Diciembre 05, 2024</span>
          </div>
          <div className="row">
            <span>Time of Transactions:</span>
            <span>04:13 AM EST</span>
          </div>
          <div className="row">
            <span>Service Type:</span>
            <span>BELIZE CHAMBER OF COMMERCE CASH</span>
          </div>
          <div className="row">
            <span>Payout Location:</span>
            <span>Belize / Belice</span>
          </div>
          <div className="row">
            <span>Date Available:</span>
            <span>December 05, 2024 / Diciembre 05, 2024</span>
          </div>
        </div>
        <div className="section-SENDER">
          <h4>SENDER/REMITENTE</h4>
          <p>
            RAMSHA ANAMM
            <br />
            street number 35, alaska, NY, 10001, USA
            <br />
            2035354800
          </p>
        </div>
      </>
    );
  } else if (value === "tracking") {
    return (
      <>
        <p>
          TRACKING NUMBER (MTCN) / NO. DECONTROL DELENVIO :{" "}
          <strong>973-207-0255</strong>
        </p>
        <p>
          FOR CUSTOMER SERVICE, CALL 1-800-777-8784 / PARA COMUNICARSE CON EL
          SERVICIO DE ATENCION AL CLIENTE, LLAME AL 1-800-777-8784
        </p>
        <p>
          <strong>DUMMY ORGANISATION</strong>
        </p>
        <p>
          Operator ID / No. ID del Operador: <strong>100</strong>
        </p>
      </>
    );
  } else if (value === "services") {
    return (
      <>
        <div className="section-RECEIVER">
          <h4>RECEIVER/DESTINATARIO</h4>
          <p>
            JOJO SHINCHAN
            <br />
            Belmopan, Cayo
          </p>
        </div>
        <div className="section-TRANSACTION DETAILS">
          <h4>TRANSACTION DETAILS/DETALLES DE LA TRANSACCION</h4>
          <div className="row">
            <span>Transfer Amount:</span>
            <span></span>
          </div>
          <div className="row">
            <span>Transfer Fees:</span>
            <span></span>
          </div>
          <div className="row">
            <span>Additional Fees:</span>
            <span></span>
          </div>
          <div className="row">
            <span>Transfer Taxes:</span>
            <span></span>
          </div>
          <div className="row">
            <span>Promotion Discount:</span>
            <span></span>
          </div>
          <hr className="break" />
          <div className="row">
            <span>Total:</span>
            <span></span>
          </div>
          <hr className="break" />
          <div className="row">
            <span>Exchange Rate:</span>
            <span></span>
          </div>
          <div className="row">
            <span>Transfer Amount:</span>
            <span></span>
          </div>
          <div className="row">
            <span>Total to Receiver:</span>
            <span></span>
          </div>
        </div>
      </>
    );
  } else if (value === "contact") {
    return (
      <>
        <div className="section-Signature">
          <p>
            ______________________
            <br />
            <strong>Your Signature / Su Firma</strong>
          </p>
          <p>
            ______________________
            <br />
            <strong>Agent Signature / Firma del Agente</strong>
          </p>
        </div>
        <p>
          Email: info@xorg.com
          <br />
          Phone: (123) 456-7890
          <br />
          Location: 123 Innovation Drive, TX
        </p>
      </>
    );
  }
  return null;
}

export default function CMSTemplate2() {
  // State for dropdowns
  const [header, setHeader] = useState("");
  const [footer, setFooter] = useState("");
  const [left1, setLeft1] = useState("");
  const [left2, setLeft2] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const previewReady = header && left1 && left2 && footer;

  const navigate = useNavigate();

  // For disabling options in left1/left2
  const left1Options = leftSectionOptions.map((opt) => ({
    ...opt,
    disabled: opt.value && opt.value === left2,
  }));
  const left2Options = leftSectionOptions.map((opt) => ({
    ...opt,
    disabled: opt.value && opt.value === left1,
  }));

  // Render preview content (as in JS)
  function renderPreview() {
    return (
      <div>
        <div style={{ marginBottom: 30 }}>
          <div>{getHeaderContent(header)}</div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 20,
          }}
        >
          <div style={{ flex: 1 }}>
            <div>{getLeftSectionContent(left1)}</div>
          </div>
          <div style={styles.hr} />
          <div style={{ flex: 1 }}>
            <div>{getLeftSectionContent(left2)}</div>
          </div>
        </div>
        <div>
          <div>{getFooterContent(footer)}</div>
        </div>
      </div>
    );
  }

  function handlePreviewClick() {
    if (previewReady) {
      setShowPopup(true);
    } else {
      window.alert("Please select an option for each dropdown before previewing!");
    }
  }

  // Main render
  return (
    <div style={styles.body}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerTitle}>
          <img
            src={WU}
            alt="Workbox Logo"
            style={{
              height: 60,
              verticalAlign: "middle",
              marginRight: 15,
              borderRadius: 10,
            }}
          />
          <strong>CMS - Template 2</strong>
        </div>
        <div style={styles.dropdownGroup}>
          <label style={{ color: "black" }}>
            Select Header:
            <select
              value={header}
              onChange={(e) => setHeader(e.target.value)}
              style={{ padding: 6, fontSize: "1em", marginTop: 5, width: "100%" }}
            >
              {headerOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
          {header && (
            <div style={styles.contentBox}>{getHeaderContent(header)}</div>
          )}
        </div>
      </header>

      {/* Middle split panel */}
      <div style={styles.mainContainer}>
        <div style={styles.leftPanel}>
          {/* Section 1 */}
          <div style={{ ...styles.section, paddingRight: 10 }}>
            <label htmlFor="leftDropdown1">
              <strong>Select section 1:</strong>
            </label>
            <br />
            <select
              id="leftDropdown1"
              value={left1}
              onChange={(e) => setLeft1(e.target.value)}
              style={{ padding: 6, fontSize: "1em", marginTop: 5, width: "100%" }}
            >
              {left1Options.map((opt) => (
                <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                  {opt.label}
                </option>
              ))}
            </select>
            {left1 && (
              <div style={styles.rightPanel}>{getLeftSectionContent(left1)}</div>
            )}
          </div>
          {/* Separator */}
          <hr style={styles.separator} />
          {/* Section 2 */}
          <div style={{ ...styles.section, paddingLeft: 10 }}>
            <label htmlFor="leftDropdown2">
              <strong>Select section 2:</strong>
            </label>
            <br />
            <select
              id="leftDropdown2"
              value={left2}
              onChange={(e) => setLeft2(e.target.value)}
              style={{ padding: 6, fontSize: "1em", marginTop: 5, width: "100%" }}
            >
              {left2Options.map((opt) => (
                <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                  {opt.label}
                </option>
              ))}
            </select>
            {left2 && (
              <div style={styles.rightPanel}>{getLeftSectionContent(left2)}</div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.dropdownGroup}>
          <label style={{ color: "black" }}>
            Select Footer:
            <select
              value={footer}
              onChange={(e) => setFooter(e.target.value)}
              style={{ padding: 6, fontSize: "1em", marginTop: 5, width: "100%" }}
            >
              {footerOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
          {footer && (
            <div style={styles.contentBox}>{getFooterContent(footer)}</div>
          )}
        </div>
      </footer>

      {/* Preview and Save Buttons */}
      <div style={styles.previewButtonContainer}>
        {/* Back Button */}
        <button
          style={{ ...styles.previewButton, background: "#959292" }}
          onClick={() => navigate("/content-user")}
        >
          ⬅️ Back to Home
        </button>
        <div>
          <button
            style={styles.previewButton}
            onClick={handlePreviewClick}
          >
            Preview
          </button>
          <button style={styles.previewButton}>Save</button>
        </div>
      </div>

      {/* Popup */}
      <div
        style={{
          ...styles.popup,
          display: showPopup ? "flex" : "none",
        }}
      >
        <div style={styles.popupContent}>
          <h2 style={styles.previewHeading}>Preview</h2>
          <div>{renderPreview()}</div>
          <div style={styles.closeButtonContainer}>
            <button
              style={{
                ...styles.previewButton,
                backgroundColor: "#4CAF50",
                marginTop: 0,
              }}
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Copyright Footer */}
      <div style={styles.footer}>
        <div style={styles.indexContentBox}>
          © 2025 Western Union. All rights reserved.
        </div>
      </div>
    </div>
  );
}
