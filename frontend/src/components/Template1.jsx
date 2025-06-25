import React, { useState, useEffect } from 'react';
import WU from "../assets/images/WU.png";
import {useNavigate} from "react-router-dom";

const CMSTemplate = () => {
  const [headerDropdown, setHeaderDropdown] = useState('');
  const [footerDropdown, setFooterDropdown] = useState('');
  const [leftDropdown1, setLeftDropdown1] = useState('');
  const [leftDropdown2, setLeftDropdown2] = useState('');
  const [headerContent, setHeaderContent] = useState('');
  const [footerContent, setFooterContent] = useState('');
  const [rightPanel1Content, setRightPanel1Content] = useState('');
  const [rightPanel2Content, setRightPanel2Content] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const navigate = useNavigate();

  const previewReady = headerDropdown && leftDropdown1 && leftDropdown2 && footerDropdown;

  // Available options for dropdowns
  const leftOptions = [
    { value: '', label: '-- Select Info --' },
    { value: 'tracking', label: 'TRACKING' },
    { value: 'about', label: 'SERVICE DETAILS/SENDER/REMITENTE' },
    { value: 'services', label: 'TRANSACTION DETAILS' },
    { value: 'contact', label: 'RECEIVER/DESTINATARIO' }
  ];

  const handleHeaderChange = (value) => {
    setHeaderDropdown(value);
    let html = '';

    if (value === 'receipt') {
      html = `
        <img id="Logo" src={WU} alt="Random Logo" style="max-width: 180px; height: 40px; float: left; border-radius: 50%;">
        <h3 style="text-align: center;padding-left: 24px;">RECEIPT/RECIBO</h3>`;
    } else if (value === 'statement') {
      html = `
        <img id="Logo" src={WU} alt="Random Logo" style="max-width: 180px; height: 40px; float: right; border-radius: 50%;">
        <h3 style="text-align: center;padding-left: 24px;">RECEIPT/RECIBO</h3>`;
    } else if (value === 'year') {
      html = `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 10px; margin-bottom: 20px;">
          <img src={WU} alt="Random Logo" style="max-width: 180px; height: 40px; border-radius: 50%; object-fit: contain;">
          <div>
            <p style="text-align: center; font-size: 1.2rem; font-weight: bold; color: #333; margin: 0;">
              RECEIPT / RECIBO
            </p>
          </div>
        </div>`;
    }

    setHeaderContent(html);
  };

  const handleFooterChange = (value) => {
    setFooterDropdown(value);
    let content = '';

    if (value === "support") {
      content = `
        <p> In addition to the transfer fee, Western Union makes
            money when it changes your dollars into foreign
            currency. See the Terms & Conditions for more
            information about currency exchange. If the exchange
            rate for your transaction was determined at the time
            you sent the money, the currency to be paid out and
            the exchange rate are listed on your receipt. Otherwise,
            the exchange rate will be set when the receiver
            receives the funds.</p>`;
    } else if (value === "policy") {
      content = `For inquiries or comments please write to:/Si tiene
        preguntas o comentarios, escriba a:
        WESTERN UNION
        P.O. Box 6036, Englewood, CO 80155
        Full Terms & Conditions including important provisions
        regarding limitations of liability, resolution of disputes, and
        administration charges are available by asking your Agent
        for a copy, calling 1-800-325-6000, or visiting Go.Wu.Com/
        Terms./Términos y condiciones completos, incluidas las
        disposiciones importantes relacionadas con las limitaciones
        de responsabilidad, la resolución de disputas y los cargos
        de administración disponibles mediante la solicitud de una
        copia a tu Agencia, llamando al 1-800-325-6000 o visitando
        Go.Wu.Com/Terms.`;
    }

    setFooterContent(content);
  };

  const getContentForSection = (value) => {
    if (value === "about") {
      return `<div class="section-SERVICE DETAILS" style="padding: top -10px;;">
        <h4 style="padding-top: -10px;">SERVICE DETAILS/DETALLES DEL SERVICIO:</h4>
        <div class="row"><span>Date of Transactions:</span><span>December 05, 2024 / Diciembre 05, 2024</span></div>
        <div class="row"><span>Time of Transactions:</span><span>04:13 AM EST</span></div>
        <div class="row"><span>Service Type:</span><span>BELIZE CHAMBER OF COMMERCE CASH</span></div>
        <div class="row"><span>Payout Location:</span><span>Belize / Belice</span></div>
        <div class="row"><span>Date Available:</span><span>December 05, 2024 / Diciembre 05, 2024</span></div>
      </div>
      <div class="section-SENDER">
        <h4>SENDER/REMITENTE</h4>
        <p>RAMSHA ANAMM<br>street number 35, alaska, NY, 10001, USA<br>2035354800</p>
      </div>`;
    } else if (value === "tracking") {
      return `<p>TRACKING NUMBER (MTCN) 
          / NO. DECONTROL DELENVIO : <strong>973-207-0255</strong></p>
        <p>FOR CUSTOMER SERVICE, CALL 1-800-777-8784 / PARA COMUNICARSE CON EL SERVICIO DE ATENCION AL CLIENTE, LLAME AL 1-800-777-8784</p>
         <p><strong>DUMMY ORGANISATION</strong></p>
        <p>Operator ID / No. ID del Operador: <strong>100</strong></p>`;
    } else if (value === "services") {
      return `<div class="section-RECEIVER">
        <h4>RECEIVER/DESTINATARIO</h4>
        <p>JOJO SHINCHAN<br>Belmopan, Cayo</p>
      </div>

      <div class="section-TRANSACTION DETAILS">
        <h4>TRANSACTION DETAILS/DETALLES DE LA TRANSACCION</h4>
        <div class="row"><span>Transfer Amount:</span><span>1,500.00 USD</span></div>
        <div class="row"><span>Transfer Fees:</span><span>+ 15.00 USD</span></div>
        <div class="row"><span>Additional Fees:</span><span>+ 0.00 USD</span></div>
        <div class="row"><span>Transfer Taxes:</span><span>+ 0.00 USD</span></div>
        <div class="row"><span>Promotion Discount:</span><span>- 0.00 USD</span></div>
      
        <!-- Break line before total -->
        <hr class="break">
        <div class="row"><span>Total:</span><span>1,515.00 USD</span></div>
      
        <!-- Break line before exchange rate -->
        <hr class="break">
        <div class="row"><span>Exchange Rate:</span><span>1 USD = 1.9999 BZD</span></div>
        <div class="row"><span>Transfer Amount:</span><span>2,999.85 BZD</span></div>
        <div class="row"><span>Total to Receiver:</span><span>2,999.85 BZD</span></div>
      </div>`;
    } else if (value === "contact") {
      return `<div class="section-Signature">
        <p> ______________________
          <br>
          <strong>Your Signature / Su Firma 
          </strong>
        </p>
        <p>
        </strong> ______________________
      <br>
    <strong>Agent Signature / Firma del Agente <br></p>
      </div>
        <p>Email: info@xorg.com<br>Phone: (123) 456-7890<br>Location: 123 Innovation Drive, TX</p>`;
    }
    return '';
  };

  const handleLeftChange = () => {
    const content1 = getContentForSection(leftDropdown1);
    const content2 = getContentForSection(leftDropdown2);

    setRightPanel1Content(content1);
    setRightPanel2Content(content2);
  };

  const showPreview = () => {
    if (!headerContent || !rightPanel1Content || !rightPanel2Content || !footerContent) {
      return;
    }

    const previewHTML = `
      <div class="" style="margin-bottom: 30px">
        <div class="">${headerContent}</div>
      </div>
        <div class="">
          <div class="">${rightPanel1Content}</div>
        </div>
        <div class="">
          <div class="">${rightPanel2Content}</div>
        </div>
      <div class="">
        <div class="">${footerContent}</div>
      </div>
    `;

    setPreviewContent(previewHTML);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  // Filter options to prevent duplicate selection
  const getFilteredOptions = (currentValue, otherValue) => {
    return leftOptions.filter(option =>
      option.value === '' || option.value === currentValue || option.value !== otherValue
    );
  };

  useEffect(() => {
    handleLeftChange();
  }, [leftDropdown1, leftDropdown2]);

  const backToHome = () => {
    // Handle navigation back to home
    navigate('/content-user')
  };

  function handlePreviewClick() {
    if (previewReady) {
      setShowPopup(true);
    } else {
      window.alert("Please select an option for each dropdown before previewing!");
    }
  }

  return (
    <div style={{ margin: 0, fontFamily: 'Arial, sans-serif', backgroundColor: '#f8f9fa' }}>
      <style>{`
        .header, .footer {
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

        .main-container {
          margin-top: 40px;
          border: 1px solid black;
          display: flex;
          min-height: 52vh;
          border-top: 2px solid #ccc;
          border-bottom: 2px solid #ccc;
        }

        .left-panel {
          width: 100%;
          background-color: #e6f0ff;
          padding: 15px;
          border-right: 1px solid #ccc;
        }

        .right-panel1, .right-panel2 {
          margin-top: 10px;
          padding: 6px 10px;
          border-radius: 10px;
          background: white;
        }

        select {
          padding: 6px;
          font-size: 1em;
          margin-top: 5px;
          width: 100%;
        }

        .popup {
          display: ${showPopup ? 'flex' : 'none'};
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .popup-content {
          background: #fff;
          padding: 0 30px 30px 30px;
          width: 80%;
          max-width: 800px;
          max-height: 80%;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          text-align: left;
          overflow-y: auto;
        }

        .popup-content h2 {
          margin-top: 0;
          color: #333;
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

        .preview-button-container {
          display: flex;
          justify-content: space-between;
          width: 55%;
          text-align: center;
        }

        button {
          padding: 10px 20px;
          margin-top: 20px;
          cursor: pointer;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 5px;
          font-size: 16px;
        }

        button:hover {
          background-color: #45a049;
        }

        .preview-button-container button {
          font-size: 16px;
          cursor: pointer;
          background-color: #007BFF;
          color: white;
          border: none;
          border-radius: 5px;
        }

        .preview-button-container button:hover {
          background-color: #0056b3;
        }

        .section-SERVICE.DETAILS .row,
        .section-TRANSACTION.DETAILS .row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
          padding: 2px 0;
        }

        .section-SERVICE.DETAILS .row span:first-child,
        .section-TRANSACTION.DETAILS .row span:first-child {
          font-weight: bold;
        }

        .break {
          margin: 10px 0;
          border: 1px solid #ccc;
        }
      `}</style>

      {/* Header */}
      <div className="header">
        <div className="header-title">
          <img src={WU} alt="Workbox Logo" style={{height:'60px', verticalAlign:'middle', marginRight:'15px', borderRadius:'10px'}} />
          <strong>CMS - Template 1</strong>
        </div>
        <div className="dropdown-group">
          <label style={{color:'black'}}>Select Header:</label>
          <select value={headerDropdown} onChange={(e) => handleHeaderChange(e.target.value)}>
            <option value="">-- Select --</option>
            <option value="receipt">Header 1</option>
            <option value="statement">Header 2</option>
            <option value="year">Header 3</option>
          </select>
        </div>
        {headerContent && (
          <div className="content-box" dangerouslySetInnerHTML={{__html: headerContent}}></div>
        )}
      </div>

      {/* Middle Section */}
      <div className="main-container">
        <div className="left-panel">
          <div style={{marginBottom: '40px', marginTop:'30px'}}>
            <label><strong>Select section 1:</strong></label><br/>
            <select value={leftDropdown1} onChange={(e) => setLeftDropdown1(e.target.value)}>
              {getFilteredOptions(leftDropdown1, leftDropdown2).map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            {rightPanel1Content && (
              <div className="right-panel1" dangerouslySetInnerHTML={{__html: rightPanel1Content}}></div>
            )}
          </div>

          <hr/>

          <div style={{marginTop: '40px'}}>
            <label><strong>Select section 2:</strong></label><br/>
            <select value={leftDropdown2} onChange={(e) => setLeftDropdown2(e.target.value)}>
              {getFilteredOptions(leftDropdown2, leftDropdown1).map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            {rightPanel2Content && (
              <div className="right-panel2" dangerouslySetInnerHTML={{__html: rightPanel2Content}}></div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        <div className="dropdown-group">
          <label style={{color:'black'}}>Select Footer:</label>
          <select value={footerDropdown} onChange={(e) => handleFooterChange(e.target.value)}>
            <option value="">-- Select --</option>
            <option value="support">Support</option>
            <option value="policy">Policy</option>
          </select>
        </div>
        {footerContent && (
          <div className="content-box" dangerouslySetInnerHTML={{__html: footerContent}}></div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="preview-button-container">
        <button onClick={backToHome} style={{marginLeft:'20px', padding: '5px 10px', fontSize: '16px', cursor: 'pointer', background:'#959292'}}>
          ⬅️ Back to Home
        </button>
        <div>
          <button onClick={handlePreviewClick} style={{background: '#007BFF'}}>Preview</button>
          <button style={{background: '#007BFF', marginLeft:"10px"}}>Save</button>
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2 className="preview-heading">Preview</h2>
            <div dangerouslySetInnerHTML={{__html: previewContent}}></div>
            <div className="close-button-container">
              <button onClick={closePopup}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Footer */}
      <div className="footer">
        <div className="index-content-box">© 2025 Western Union. All rights reserved.</div>
      </div>
    </div>
  );
};

export default CMSTemplate;