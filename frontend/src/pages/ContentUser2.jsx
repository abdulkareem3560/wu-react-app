import React from "react";
import {useNavigate} from 'react-router-dom';
import template1 from "../assets/images/template1.jpg";
import template2 from "../assets/images/template2.jpg";
import WU from "../assets/images/WU.png";


const ContentUser2 = () => {
  const navigate = useNavigate();

  const handleTemplateClick = (target) => {
    navigate(target);
  };

  return (
    <div>
      <style>
        {`
          body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
      }
      .header {
        background-color: #f1d837;
        padding: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid #ccc;
      }
      .header-title {
        display: flex;
        align-items: center;
        gap: 15px;
      }
      .header-title strong {
        font-size: 28px;
      }
      .main-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: #e6f0ff;
        padding: 60px 20px;
      }
      .main-container h2 {
        font-size: 24px;
        margin-bottom: 20px;
      }
      .main-container label {
        font-size: 18px;
        display: block; /* Ensure labels are on separate lines */
        margin: 10px 0;
      }
      .footer {
        background-color: #f1d837;
        padding: 15px;
        text-align: center;
        position: fixed;
        width: 100%;
        bottom: 0;
        font-size: 14px;
      }
      .template-img {
        height: 300px;
        margin-top: 10px;
        transition: transform 0.3s ease;
      }

      .template-img:hover {
        transform: scale(1.05);
        cursor: pointer;
      }
        `}
      </style>
          <header className="header">
            <div className="header-title">
              <img
                src={WU}
                alt="Workbox Logo"
                style={{ height: "60px", borderRadius: "10px" }}
              />
              <strong style={{ fontSize: "24px" }}>Workbox Portal</strong>
            </div>
          </header>

          <div
            className="main-container"
            style={{ textAlign: "center", paddingTop: "30px" }}
          >
            <h2>Select a Layout</h2>
            <form
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "60px",
                marginTop: "30px",
                flexDirection: "row",
              }}
            >
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{ marginTop: "10px" }}
                  onClick={() => handleTemplateClick("/template1")}
                >
                  Layout 1 - Receipt System
                </div>
                <img
                  className="template-img"
                  src={template1}
                  alt="Receipt Template"
                  style={{ height: "300px", marginTop: "10px" }}
                  onClick={() => handleTemplateClick("/template1")}
                />
              </label>

              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{ marginTop: "10px" }}
                  onClick={() => handleTemplateClick("/template2")}
                >
                  Layout 2 - Statement Viewer
                </div>
                <img
                  className="template-img"
                  src={template2}
                  alt="Statement Template"
                  style={{ height: "300px", marginTop: "10px" }}
                  onClick={() => handleTemplateClick("/template2")}
                />
              </label>
            </form>
          </div>



      <footer className="footer">
        <div className="index-content-box">
          © 2025 Western Union. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default ContentUser2;