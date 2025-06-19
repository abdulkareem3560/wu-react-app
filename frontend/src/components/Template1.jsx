import React, { useState } from "react";

const Template1 = () => {
  const [headerContent, setHeaderContent] = useState("");
  const [leftPanel1Content, setLeftPanel1Content] = useState("");
  const [leftPanel2Content, setLeftPanel2Content] = useState("");
  const [footerContent, setFooterContent] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [previewContent, setPreviewContent] = useState("");

  const handleHeaderChange = (event) => {
    const value = event.target.value;
    let html = "";

    if (value === "receipt") {
      html = `
        <img src="WU.png" alt="Random Logo" style="max-width: 180px; height: 40px; float: left; border-radius: 50%;">
        <h3 style="text-align: center;padding-left: 24px;">RECEIPT/RECIBO</h3>`;
    } else if (value === "statement") {
      html = `
        <img src="WU.png" alt="Random Logo" style="max-width: 180px; height: 40px; float: right; border-radius: 50%;">
        <h3 style="text-align: center;padding-left: 24px;">RECEIPT/RECIBO</h3>`;
    } else if (value === "year") {
      html = `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 10px; margin-bottom: 20px;">
          <img src="WU.png" alt="Random Logo" style="max-width: 180px; height: 40px; border-radius: 50%; object-fit: contain;">
          <div>
            <p style="text-align: center; font-size: 1.2rem; font-weight: bold; color: #333; margin: 0;">
              RECEIPT / RECIBO
            </p>
          </div>
        </div>`;
    } else {
      setHeaderContent("");
      return;
    }

    setHeaderContent(html);
  };

  const handleLeftChange = (section, event) => {
    const value = event.target.value;

    let content = "";

    if (section === 1) {
      if (value === "about") {
        content = `
          <div class="section-SERVICE DETAILS">
            <h4>SERVICE DETAILS/DETALLES DEL SERVICIO:</h4>
            <div class="row"><span>Date of Transactions:</span><span>December 05, 2024</span></div>
            <div class="row"><span>Service Type:</span><span>BELIZE CHAMBER OF COMMERCE CASH</span></div>
            <div class="row"><span>Payout Location:</span><span>Belize</span></div>
          </div>
          <div class="section-SENDER">
            <h4>SENDER/REMITENTE</h4>
            <p>RAMSHA ANAMM</p>
          </div>`;
      } else if (value === "tracking") {
        content = `
          <p>TRACKING NUMBER (MTCN): <strong>973-207-0255</strong></p>
          <p>FOR CUSTOMER SERVICE, CALL 1-800-777-8784</p>
          <p><strong>DUMMY ORGANISATION</strong></p>`;
      }

      setLeftPanel1Content(content);
    } else {
      if (value === "about") {
        content = `
          <div class="section-SERVICE DETAILS">
            <h4>SERVICE DETAILS/DETALLES DEL SERVICIO:</h4>
            <div class="row"><span>Date of Transactions:</span><span>December 05, 2024</span></div>
            <div class="row"><span>Service Type:</span><span>BELIZE CHAMBER OF COMMERCE CASH</span></div>
            <div class="row"><span>Payout Location:</span><span>Belize</span></div>
          </div>
          <div class="section-SENDER">
            <h4>SENDER/REMITENTE</h4>
            <p>RAMSHA ANAMM</p>
          </div>`;
      } else if (value === "tracking") {
        content = `
          <p>TRACKING NUMBER (MTCN): <strong>973-207-0255</strong></p>
          <p>FOR CUSTOMER SERVICE, CALL 1-800-777-8784</p>
          <p><strong>DUMMY ORGANISATION</strong></p>`;
      }

      setLeftPanel2Content(content);
    }
  };

  const handleFooterChange = (event) => {
    const value = event.target.value;
    let content = "";

    if (value === "support") {
      content = `
        <p> In addition to the transfer fee, Western Union makes money when it changes your dollars into foreign currency...</p>`;
    } else if (value === "policy") {
      content = `
        <p>WESTERN UNION P.O. Box 6036, Englewood, CO 80155...</p>`;
    }

    setFooterContent(content);
  };

  const showPreview = () => {
    const previewHTML = `
      <div style="margin-bottom: 30px">${headerContent}</div>
      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 20px;">
        <div style="flex: 1;">${leftPanel1Content}</div>
        <hr style="height: 100%; width: 1px; border: none; background-color: #ccc;">
        <div style="flex: 1;">${leftPanel2Content}</div>
      </div>
      <div>${footerContent}</div>`;

    setPreviewContent(previewHTML);
    setIsPopupVisible(true);
  };

  const closePopup = () => {
    setIsPopupVisible(false);
  };

  return (
    <>
      <style>
        {`
          body {
            margin: 0;
            font-family: Arial, sans-serif;
            background-color: #f8f9fa;
          }
          
          .header,
          .footer {
            background-color: #f1d837;
            color: white;
            padding: 15px;
          }
          
          .footer {
            margin-top: 40px;
          }
          
          .header-title {
            font-size: 1.6em;
            color: #000;
            font-weight: bold;
            margin-bottom: 10px;
          }
          
          .dropdown-group {
            margin-top: 10px;
          }
          
          .content-box {
            background-color: #e6f0ff;
            color: #000;
            padding: 10px;
            margin-top: 10px;
            border-radius: 6px;
          }
          
          .index-content-box {
            color: #000;
            text-align: center;
          }
          
          .preview-row {
            display: flex;
            flex-direction: row;
            gap: 20px; /* Optional spacing between sections */
            justify-content: space-between;
            flex-wrap: wrap; /* Allows wrapping on small screens */
          }
          
          .preview-section {
            flex: 1 1 50%; /* Responsive: shrink, grow, base width 30% */
            box-sizing: border-box;
          }
          
          .right-panel1 {
            margin-top: 10px;
            padding: 6px 10px;
            border-radius: 10px;
            background: white;
          }
          
          .right-panel2 {
            margin-top: 10px;
            padding: 6px 10px;
            border-radius: 10px;
            background: white;
          }
          
          .main-container {
            margin-top: 40px;
            border: 1px solid black;
            display: flex;
            min-height: 30vh;
            border-top: 2px solid #ccc;
            border-bottom: 2px solid #ccc;
          }
          
          .left-panel {
            display: flex;
            flex-direction: row;
            width: 100%;
            background-color: #e6f0ff;
            padding: 15px;
            border-right: 1px solid #ccc;
          }
          
          .right-panel {
            width: 70%;
            padding: 15px;
            background-color: #ffffff;
          }
          
          select {
            padding: 6px;
            font-size: 1em;
            margin-top: 5px;
            width: 100%;
          }
          
          /* Popup Styles */
          .popup {
            display: none; /* Initially hidden */
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7); /* Dark overlay */
            justify-content: center; /* Center content horizontally */
            align-items: center; /* Center content vertically */
            z-index: 1000;
          }
          
          .popup-content {
            background: #fff;
            padding: 0 30px 30px 30px;
            width: 80%;
            max-width: 800px; /* Responsive design */
            max-height: 80%; /* Prevent popup from exceeding screen height */
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Soft shadow */
            text-align: left;
            overflow-y: auto; /* Make the content scrollable if it overflows */
          }
          
          .popup-content h2 {
            margin-top: 0;
            color: #333;
          }
          
          .popup-content p {
            margin: 10px 0;
            color: #666;
          }
          
          .preview-section {
            margin-top: 20px;
            padding: 15px;
            border-radius: 5px;
            background-color: #f7f7f7;
            margin-bottom: 15px;
          }
          
          .preview-section h3 {
            color: #333;
            font-size: 20px;
            margin-bottom: 10px;
            margin-top: 0px;
          }
          
          .preview-content {
            color: #555;
            font-size: 16px;
            line-height: 1.5;
            border: 1px solid #ddd;
            padding: 10px;
            border-radius: 5px;
            background-color: #fff;
          }
          
          .header-preview {
            border-left: 5px solid #4caf50; /* Green border for header */
            background-color: #eaf7e6; /* Light green background */
          }
          
          .left-info-preview {
            border-left: 5px solid #007bff; /* Blue border for left info */
            background-color: #e6f2ff; /* Light blue background */
          }
          
          .footer-preview {
            border-left: 5px solid #ff5722; /* Orange border for footer */
            background-color: #ffe6e6; /* Light red background */
          }
          
          button {
            padding: 10px 20px;
            margin-top: 20px;
            cursor: pointer;
            background-color: #4caf50;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 16px;
          }
          
          button:hover {
            background-color: #45a049;
          }
          
          .preview-button-container {
            display: flex;
            justify-content: space-between;
            width: 55%;
            text-align: center;
            margin-top: 20px;
          }
          
          .preview-button-container button {
            padding: 6px 10px;
            font-size: 16px;
            cursor: pointer;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
          }
          
          .preview-button-container button:hover {
            background-color: #0056b3;
          }
          
          .preview-heading {
            position: sticky;
            top: 0px;
            background-color: #fff;
            padding: 20px 0;
            font-size: 24px;
            text-align: center;
            z-index: 1;
            border-bottom: 2px solid #ddd;
          }
          
          .close-button-container {
            text-align: center;
          }
        `}
      </style>
      <div>
        {/* Header */}
        <div className="header">
          <div className="header-title">
            <img
              src="WU.png"
              alt="Random Logo"
              style={{ maxWidth: "180px", height: "40px", borderRadius: "50%" }}
            />
            <strong>CMS - Template 1</strong>
          </div>
          <div className="dropdown-group">
            <label>Select Header:</label>
            <select onChange={handleHeaderChange}>
              <option value="">-- Select --</option>
              <option value="receipt">Header 1</option>
              <option value="statement">Header 2</option>
              <option value="year">Header 3</option>
            </select>
          </div>
          <div id="headerContent" className="content-box" dangerouslySetInnerHTML={{ __html: headerContent }} />
        </div>

        {/* Left Section */}
        <div className="main-container">
          <div className="left-panel">
            <label>Select section 1:</label>
            <select onChange={(e) => handleLeftChange(1, e)}>
              <option value="">-- Select Info --</option>
              <option value="tracking">TRACKING</option>
              <option value="about">SERVICE DETAILS/SENDER/REMITENTE</option>
              <option value="services">TRANSACTION DETAILS</option>
              <option value="contact">RECEIVER/DESTINATARIO</option>
            </select>
            <div className="right-panel1" dangerouslySetInnerHTML={{ __html: leftPanel1Content }} />
          </div>

          <div className="left-panel">
            <label>Select section 2:</label>
            <select onChange={(e) => handleLeftChange(2, e)}>
              <option value="">-- Select Info --</option>
              <option value="tracking">TRACKING</option>
              <option value="about">SERVICE DETAILS/SENDER/REMITENTE</option>
              <option value="services">TRANSACTION DETAILS</option>
              <option value="contact">RECEIVER/DESTINATARIO</option>
            </select>
            <div className="right-panel2" dangerouslySetInnerHTML={{ __html: leftPanel2Content }} />
          </div>
        </div>

        {/* Footer */}
        <div className="footer">
          <div className="dropdown-group">
            <label>Select Footer:</label>
            <select onChange={handleFooterChange}>
              <option value="">-- Select --</option>
              <option value="support">Support</option>
              <option value="policy">Policy</option>
            </select>
          </div>
          <div id="footerContent" className="content-box" dangerouslySetInnerHTML={{ __html: footerContent }} />
        </div>

        {/* Preview and Save Buttons */}
        <div className="preview-button-container">
          <button onClick={() => window.location.href = "indexu.html"}>⬅️ Back to Home</button>
          <button onClick={showPreview}>Preview</button>
          <button>Save</button>
        </div>

        {/* Preview Popup */}
        {isPopupVisible && (
          <div id="popup" className="popup">
            <div className="popup-content">
              <h2 className="preview-heading">Preview</h2>
              <div id="previewContent" dangerouslySetInnerHTML={{ __html: previewContent }} />
              <button onClick={closePopup}>Close</button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="footer">
          <div className="index-content-box">© 2025 Western Union. All rights reserved.</div>
        </div>
      </div>
    </>
  );
};

export default Template1;
