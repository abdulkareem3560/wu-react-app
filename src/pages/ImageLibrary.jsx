import React from 'react';

const ImageLibrary = () => {
  return (
    <>
      <style>
        {`
          body {
            margin: 0;
            height: 100vh;
            font-family: "Segoe UI", sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #fff9db; /* Light yellow background */
          }

          .button-container {
            display: flex;
            flex-direction: column; /* Changed to column for better stacking of h2 and form */
            gap: 30px;
            background: white;
            padding: 40px 60px;
            border-radius: 12px;
            box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);
            align-items: center; /* Center items horizontally in the container */
          }

          button {
            padding: 15px 30px;
            font-size: 18px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            background-color: #28a745;
            color: white;
            transition: background 0.3s ease;
            min-width: 180px;
          }

          .back-button {
            position: fixed;
            bottom: 20px; /* Distance from the bottom */
            left: 20px; /* Distance from the left */
            padding: 5px 10px;
            font-size: 16px;
            cursor: pointer;
            background-color: #959292;
            color: white;
            border: none;
            border-radius: 5px;
          }

          button:hover {
            background-color: #218838;
          }

          /* Style for the file input and upload button within the form */
          .button-container input[type="file"] {
            border: 1px solid #ccc;
            padding: 8px;
            border-radius: 5px;
            width: 100%;
            box-sizing: border-box; /* Include padding in the element's total width and height */
          }

          .button-container input[type="submit"] {
            background-color: #007bff;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            transition: background 0.3s ease;
            margin-top: 15px; /* Space between file input and upload button */
          }

          .button-container input[type="submit"]:hover {
            background-color: #0056b3;
          }

          /* Added styles for the form to control its layout */
          .button-container form {
            display: flex;
            flex-direction: column;
            gap: 15px; /* Space between form elements */
            width: 100%; /* Ensure form takes full width of its container */
            max-width: 300px; /* Limit form width for better appearance */
          }
        `}
      </style>

      <div className="button-container">
        <h2>Upload a File</h2>

        <form action="upload.php" method="post" enctype="multipart/form-data">
          <label htmlFor="fileUpload">Choose file:</label>
          <input type="file" id="fileUpload" name="uploadedFile" />
          <input type="submit" value="Upload" />
        </form>
      </div>

      <button className="back-button" onClick={() => (window.location.href = 'admin')}>
        ⬅️ Back
      </button>
    </>
  );
};

export default ImageLibrary;