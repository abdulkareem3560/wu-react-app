import React from 'react';
import logo from "../assets/images/Western-Union.png"

const Admin = () => {
  const handleRedirect = (path) => {
    window.location.href = path;
  };

  return (
    <>
      <style>
        {`
          #root {
            margin: 0;
            height: 100vh;
            background-color: #f0f0f0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }

          .logo-container {
            margin-bottom: 40px;
          }

          .logo-container img {
            width: 220px;
            user-select: none;
          }
  
          .button-container {
            display: flex;
            gap: 30px;
          }

          button {
            padding: 12px 35px;
            font-size: 15px;
            font-weight: 600;
            border-radius: 30px;
            border: 1px solid black;
            background-color: white;
            color: black;
            cursor: pointer;
            min-width: 160px;
            transition: background-color 0.3s ease, color 0.3s ease;
            box-shadow: 0 3px 6px rgb(0 0 0 / 0.25);
          }

          button:hover {
            background-color: black;
            color: #ffcc00;
            box-shadow: 0 3px 8px rgb(0 0 0 / 0.5);
          }

          .back-button {
            position: fixed;
            top: 20px;
            right: 20px;
            background: transparent;
            border: 1.5px solid #007bff;
            color: #007bff;
            font-weight: 600;
            border-radius: 20px;
            padding: 8px 18px;
            cursor: pointer;
            transition: background-color 0.3s ease, color 0.3s ease;
            user-select: none;
          }

          .back-button:hover {
            background-color: #007bff;
            color: white;
          }
        `}
      </style>

      <button className="back-button" onClick={() => handleRedirect('/')}>
        Back to Home
      </button>

      <div className="logo-container">
        <img className="logo" src={logo} alt="Western Union Logo" />
      </div>

      <div className="button-container">
        <button onClick={() => handleRedirect('layout-library')}>Layout Library</button>
        <button onClick={() => handleRedirect('template-library')}>Template Library</button>
        <button onClick={() => handleRedirect('global-attributes')}>Global Attributes</button>
        <button onClick={() => handleRedirect('resource-bundles')}>Resource Bundles</button>
      </div>
    </>
  );
};

export default Admin;
