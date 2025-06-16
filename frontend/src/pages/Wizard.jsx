import React, {useEffect, useState} from 'react';
import ResourceBundlesContentUser from "../components/ResourceBundlesContentUser.jsx";

const Wizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedLayoutFile, setSelectedLayoutFile] = useState(null);
  const totalSteps = 3;

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/get-layout-images`)
      .then((res) => res.json())
      .then((layoutData) => {
        const container = document.getElementById('uploaded-images');
        if (container) {
          container.innerHTML = '';
          layoutData.forEach((item) => {
            console.log(item, "here2....")
            const layout = document.createElement('div');
            layout.className = 'layout-container';
            layout.innerHTML = `
              <div class="layout-heading">${item.heading}</div>
              <img src="${import.meta.env.VITE_BACKEND_BASE_URL}/${item.image}" class="uploaded-image" alt="${item.htmlFile}" />
            `;
            layout.onclick = () => {
              document
                .querySelectorAll('.layout-container')
                .forEach((el) => el.classList.remove('selected'));
              layout.classList.add('selected');
              setSelectedLayoutFile(item.htmlFile);
            };
            container.appendChild(layout);
          });
        }
      });
  }, []);

  useEffect(() => {
    updateStepperUI();
  }, [currentStep]);

  const handleRedirect = (path) => {
    window.location.href = path;
  };

  const updateStepperUI = () => {
    for (let i = 1; i <= totalSteps; i++) {
      const num = document.getElementById(`step-${i}-num`);
      const title = document.getElementById(`step-${i}-title`);
      const content = document.getElementById(`step-${i}`);
      if (num && title && content) {
        num.className = i < currentStep ? 'step-number completed' : i === currentStep ? 'step-number active' : 'step-number inactive';
        title.className = i <= currentStep ? 'step-title' : 'step-title inactive';
        content.classList.toggle('active', i === currentStep);
      }
    }

    for (let i = 1; i < totalSteps; i++) {
      const connector = document.getElementById(`connector-${i}`);
      if (connector) connector.classList.toggle('completed', i < currentStep);
    }

    const backBtn = document.getElementById('back-btn');
    const nav = document.querySelector('.navigation');
    const nextBtn = document.getElementById('next-btn');
    if (backBtn && nav && nextBtn) {
      backBtn.style.display = currentStep === 1 ? 'none' : 'inline-flex';
      nav.classList.toggle('only-next', currentStep === 1);
      nextBtn.textContent = currentStep === 3 ? 'Save' : 'Next →';
    }
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!selectedLayoutFile) return alert('Please select a layout.');
      const content = document.getElementById('step-2-content');
      content.innerHTML = `<iframe src="${import.meta.env.VITE_BACKEND_BASE_URL}/${selectedLayoutFile}" />`;
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 2) {
      // const content = document.querySelector('#step-3 .content-box');
      // content.innerHTML = `<iframe src="../components/ResourceBundlesContentUser.jsx" />`;
      setCurrentStep(currentStep + 1);
    } else {
      document.getElementById('receipt-modal').style.display = 'flex';
    }
  };

  const previousStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const closeModal = () => {
    document.getElementById('receipt-modal').style.display = 'none';
  };

  const submitReceiptName = () => {
    console.log("here4.....")
    const name = document.getElementById('receipt-name').value.trim();
    if (!name) return alert('Please enter a name for your receipt.');

    const iframe = document.querySelector('#step-2 iframe');
    if (!iframe) return alert('Preview iframe not found.');

    console.log(name, iframe, "here5....")
    // Listen for response from iframe
    const handleMessage = (event) => {
      console.log(event.origin, "here6.....")
      if (event.origin !== `${import.meta.env.VITE_BACKEND_BASE_URL}`) return; // Security check

      if (event.data.type === 'PREVIEW_HTML_RESPONSE') {
        window.removeEventListener('message', handleMessage); // Clean up

        const previewHTML = event.data.html;
        if (!previewHTML) return alert('No preview content found.');

        const fullHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>${name}</title>
          <link rel="stylesheet" href="styles1.css" />
        </head>
        <body>${previewHTML}</body>
        </html>
      `;

        // Continue with your fetch request...
        fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/save-receipt-html`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({name, html: fullHTML}),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.error) throw new Error(data.error);
            alert(`Receipt ${name} saved successfully!`);
            closeModal();
          })
          .catch((err) => {
            console.error(err);
            alert('Failed to save receipt.');
          });
      }
    };

    window.addEventListener('message', handleMessage);

    // Request HTML from iframe
    iframe.contentWindow.postMessage({
      type: 'GET_PREVIEW_HTML'
    }, `${import.meta.env.VITE_BACKEND_BASE_URL}`);
  };

  return (<>
    <style>
      {`
           * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        font-family: Arial, sans-serif;
        background-color: #f5f5f5;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }

      /* Stepper Header Styles */
      .stepper-header {
        background: white;
        padding: 15px 20px;
        border-bottom: 1px solid #e0e0e0;
        position: sticky;
        top: 0;
        z-index: 100;
      }
      .stepper-container {
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 40px;
      }
      .step {
        display: flex;
        align-items: center;
        gap: 12px;
        position: relative;
      }
      .step-number {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 16px;
        transition: all 0.3s ease;
        background-color: #e9ecef;
        color: #6c757d;
      }
      .step-number.active,
      .step-number.completed {
        background-color: #ffd500;
        color: black;
      }
      .step-title {
        font-size: 16px;
        color: #333;
        font-weight: 500;
      }
      .step-title.inactive {
        color: #6c757d;
      }
      .step-connector {
        width: 60px;
        height: 3px;
        background-color: #e9ecef;
      }
      .step-connector.completed {
        background-color: #ffd500;
      }

      .layout-container.selected {
        border-color: #ffd500;
        box-shadow: 0 0 12px rgba(255, 213, 0, 0.7);
        transform: translateY(-4px);
      }

      .content-area {
        flex: 1;
        padding: 20px;
        max-width: 95%;
        margin: 0 auto;
        width: 100%;
      }

      .step-content {
        display: none;
      }
      .step-content.active {
        display: block;
      }

      .cms-header {
        background-color: #ffd500;
        padding: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid #ccc;
        margin-bottom: 30px;
        color: black;
      }

      .top-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
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

      .main-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: #e6f0ff;
        gap: 30px;
        border-radius: 8px;
      }

      #uploaded-images {
        display: flex;
        gap: 20px;
        margin-top: 30px;
        flex-wrap: wrap;
        justify-content: center;
      }

      .layout-container {
        width: 300px;
        border: 2px solid #42a5f5;
        border-radius: 4px;
        cursor: pointer;
        margin-bottom: 20px;
        padding-bottom: 10px;
        background: white;
        transition: transform 0.2s ease;
      }

      .layout-container:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      .layout-heading {
        background-color: #42a5f5;
        color: white;
        font-size: 18px;
        text-align: center;
        padding: 10px;
        margin-bottom: 10px;
        font-weight: bold;
        border-radius: 4px 4px 0 0;
      }

      .uploaded-image {
        width: 100%;
        height: 200px;
        object-fit: cover;
        border-radius: 0 0 4px 4px;
      }

      .content-box {
        background: white;
        border-radius: 8px;
        text-align: center;
        margin: 0 0 40px 0;
        color: #666;
        font-size: 18px;
        min-height: 600px;
      }

      .content-box iframe {
        width: 100%;
        height: 600px;
        border: none;
        border-radius: 8px;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
      }

      .navigation {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 30px;
        margin: 0 auto;
        width: 100%;
        position: fixed;
        bottom: 0;
        background: #fff;
      }

      .navigation.only-next {
        justify-content: flex-end;
      }

      .nav-button {
        padding: 8px 15px;
        border-radius: 20px;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 8px;
        border: none;
      }

      .btn-back {
        background-color: transparent;
        border: 2px solid #ffd500;
        color: black;
      }
      .btn-back:hover {
        background-color: #ffd500;
        color: black;
      }

      .btn-next {
        background-color: #ffd500;
        color: black;
      }
      .btn-next:hover {
        background-color: #e6c300;
      }

      .footer {
        background-color: #ffd500;
        padding: 15px;
        text-align: center;
        font-size: 14px;
        margin-top: auto;
        color: black;
        font-weight: 600;
        margin-bottom: 70px;
      }

      @media (max-width: 768px) {
        .stepper-container {
          gap: 20px;
        }
        .step-connector {
          width: 30px;
        }
        .step-title {
          display: none;
        }
        .layout-container {
          width: 250px;
        }
        .content-area {
          padding: 20px 10px;
        }
        .navigation {
          padding: 20px 10px;
        }
      }

      /* Modal styles */
      #receipt-name {
        font-size: 18px;
      }

      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 200;
      }

      .modal-box {
        background: white;
        padding: 30px 30px 20px 30px;
        border-radius: 10px;
        width: 90%;
        max-width: 400px;
        position: relative;
        text-align: center;
      }

      .modal-box input {
        width: 100%;
        padding: 10px;
        margin-top: 15px;
        margin-bottom: 20px;
        border: 1px solid #ccc;
        border-radius: 5px;
      }

      .modal-box button {
        background-color: #ffd500;
        color: black;
        font-weight: bold;
        padding: 10px 20px;
        border: none;
        border-radius: 20px;
        cursor: pointer;
      }

      .modal-box button:hover {
        background-color: #e6c300;
      }

      .modal-close {
        position: absolute;
        top: 10px;
        right: 15px;
        font-size: 20px;
        cursor: pointer;
      } 
      `}
    </style>

    {/*Stepper Header*/}
    <div className="stepper-header">
      <div className="stepper-container">
        <div className="step">
          <div className="step-number active" id="step-1-num">1</div>
          <div className="step-title" id="step-1-title">
            Select Layout for Receipt
          </div>
        </div>
        <div className="step-connector" id="connector-1"></div>
        <div className="step">
          <div className="step-number inactive" id="step-2-num">2</div>
          <div className="step-title inactive" id="step-2-title">
            Configure Receipt
          </div>
        </div>
        <div className="step-connector" id="connector-2"></div>
        <div className="step">
          <div className="step-number inactive" id="step-3-num">3</div>
          <div className="step-title inactive" id="step-3-title">
            Edit Resource bundles
          </div>
        </div>
      </div>
    </div>

    {/*Content Area*/}
    <div className="content-area">
      <div className="step-content active" id="step-1">
        <div className="top-row">
          <h2>Select Layout for Receipt & click Next</h2>
          <a onClick={() => handleRedirect('/')} className="back-home"
          >Back to Home</a
          >
        </div>
        <div className="main-container">
          <div id="uploaded-images"></div>
        </div>
      </div>

      <div className="step-content" id="step-2">
        <div className="top-row">
          <h2>Configure your Receipt</h2>
          <a onClick={() => handleRedirect('/')} className="back-home"
          >Back to Home</a
          >
        </div>
        <div className="content-box" id="step-2-content">
          Please select a layout and click Next.
        </div>
      </div>

      <div className="step-content" id="step-3">
        <div className="top-row">
          <h2>Edit Resource bundles</h2>
          <a onClick={() => handleRedirect('/')} className="back-home"
          >Back to Home</a
          >
        </div>
        <div className="content-box">
          {currentStep === 3 && <ResourceBundlesContentUser/>}
        </div>
      </div>
    </div>

    {/*Navigation*/}
    <div className="navigation">
      <button
        className="nav-button btn-back"
        id="back-btn"
        onClick={previousStep}
      >
        ← Back
      </button>
      <button className="nav-button btn-next" id="next-btn" onClick={nextStep}>
        Next →
      </button>
    </div>

    {/*Footer*/}
    <div className="footer">© 2025 Western Union. All rights reserved.</div>

    {/*Modal*/}
    <div id="receipt-modal" style={{display: "none"}} className="modal-overlay">
      <div className="modal-box">
        <span className="modal-close" onClick={closeModal}>✕</span>
        <label htmlFor="receipt-name">Please name your receipt</label>
        <input type="text" id="receipt-name" placeholder="Receipt Name"/>
        <button onClick={submitReceiptName}>Submit</button>
      </div>
    </div>
  </>);
};

export default Wizard;
