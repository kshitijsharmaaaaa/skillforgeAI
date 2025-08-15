// src/pages/SavedIdeas.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Step 1: Import useNavigate

const SavedIdeas = () => {
  const [savedIdeas, setSavedIdeas] = useState([]);
  const navigate = useNavigate(); // ✅ Step 2: Initialize navigate

  useEffect(() => {
    const storedIdeas = JSON.parse(sessionStorage.getItem("savedIdeas")) || [];
    setSavedIdeas(storedIdeas);
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

      <h2 className="text-2xl font-bold mb-4">Your Saved Ideas</h2>

      {savedIdeas.length === 0 ? (
        <p>No saved ideas found.</p>
      ) : (
        <ul className="space-y-2">
          {savedIdeas.map((idea, index) => (
            <li key={index} className="bg-gray-100 p-4 rounded shadow">
              {idea}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SavedIdeas;
