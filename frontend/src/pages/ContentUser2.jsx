import React from "react";

const ContentUser2 = () => {
  const handleTemplateClick = (templateUrl) => {
    window.location.href = templateUrl;
  };

  return (
    <div>
      <header className="header">
        <div className="header-title">
          <img
            src="WU.png"
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
              onClick={() => handleTemplateClick("template1.html")}
            >
              Layout 1 - Receipt System
            </div>
            <img
              className="template-img"
              src="template1.jpg"
              alt="Receipt Template"
              style={{ height: "300px", marginTop: "10px" }}
              onClick={() => handleTemplateClick("template1.html")}
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
              onClick={() => handleTemplateClick("template2.html")}
            >
              Layout 2 - Statement Viewer
            </div>
            <img
              className="template-img"
              src="template2.jpg"
              alt="Statement Template"
              style={{ height: "300px", marginTop: "10px" }}
              onClick={() => handleTemplateClick("template2.html")}
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