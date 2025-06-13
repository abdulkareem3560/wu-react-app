import React from "react";

const RuleModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div
      style={{
        position: "fixed",
        zIndex: 1000,
        left: 0,
        top: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: "8px",
          minWidth: "300px",
          maxWidth: "90vw"
        }}
      >
        <button
          onClick={onClose}
          style={{
            float: "right",
            background: "none",
            border: "none",
            fontSize: "1.2rem",
            cursor: "pointer"
          }}
        >
          ×
        </button>
        <div style={{ clear: "both" }} />
        {children}
      </div>
    </div>
  );
};

export default RuleModal;
