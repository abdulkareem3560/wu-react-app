import React from 'react';
import logo from "../assets/images/Western-Union.png"

const Home = () => {
  const handleRedirect = (path) => {
    window.location.href = path;
  };

  return (
    <>
      <style>
        {`.home-container {
    margin: 0;
    height: 100vh;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f0f0f0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 40px;
}

.logo {
    width: 220px;
    user-select: none;
}

.button-container {
    display: flex;
    gap: 40px;
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
    transition: background-color 0.3s ease, color 0.3s ease;
    box-shadow: 0 3px 6px rgb(0 0 0 / 0.25);
}

button:hover {
    background-color: black;
    color: #ffcc00;
    box-shadow: 0 3px 8px rgb(0 0 0 / 0.5);
}
`}
      </style>
      <div className="home-container">
        <img className="logo" src={logo} alt="Western Union Logo"/>

        <div className="button-container">
          <button onClick={() => handleRedirect('/admin')}>Admin</button>
          <button onClick={() => handleRedirect('/wizard')}>Content - User 1</button>
          <button onClick={() => handleRedirect('/content-user')}>Content - User 2</button>
        </div>
      </div>
    </>

  );
};

export default Home;
