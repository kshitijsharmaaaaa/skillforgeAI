// src/pages/SavedCodes.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 🔧 Step 1: Import navigate

const SavedCodes = () => {
  const [savedCodes, setSavedCodes] = useState([]);
  const navigate = useNavigate(); // 🔧 Step 2: Initialize navigate

  useEffect(() => {
    const storedCodes = JSON.parse(sessionStorage.getItem("savedCodes")) || [];
    setSavedCodes(storedCodes);
  }, []);

  return (
    <div className="p-6">
      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="bg-[#00FFD1] text-black px-4 py-2 rounded mb-4 hover:bg-[#00ddb5] transition"
      >
        ⬅️ Back
      </button>

      <h2 className="text-2xl font-bold mb-4">Your Saved Codes</h2>

      {savedCodes.length === 0 ? (
        <p>No saved codes found.</p>
      ) : (
        <ul className="space-y-4">
          {savedCodes.map((code, index) => (
            <li key={index}>
              <pre className="bg-black text-green-400 p-4 rounded overflow-x-auto">
                <code>{code}</code>
              </pre>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SavedCodes;

