import React, { useState } from "react";

const campusData = {
  Moravian: {
    name: "Moravian University",
  },
  Lehigh: {
    name: "Lehigh University",
  },
  DeSales: {
    name: "DeSales University",
  },
};

// Profile Page Component
function ProfilePage({ onNavigate }) {
  const [userName, setUserName] = useState("Student");
  const [university, setUniversity] = useState("Moravian");
  const [favoriteSpots, setFavoriteSpots] = useState([
    "PPHAC - Room 101",
    "HUB Lounge - North Lounge"
  ]);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <nav style={{
        background: "#1e293b",
        color: "white",
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <h2 style={{ margin: 0 }}>📚 Study Spot Finder</h2>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            onClick={() => onNavigate("home")}
            style={{
              padding: "0.5rem 1rem",
              background: "transparent",
              color: "white",
              border: "1px solid white",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate("map")}
            style={{
              padding: "0.5rem 1rem",
              background: "#667eea",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            View Buildings
          </button>
        </div>
      </nav>

      <div style={{
        maxWidth: "800px",
        margin: "2rem auto",
        padding: "0 1rem"
      }}>
        <div style={{
          background: "white",
          borderRadius: "12px",
          padding: "2rem",
          marginBottom: "1.5rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <div style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2.5rem"
            }}>
              👤
            </div>
            <div style={{ flex: 1 }}>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                style={{
                  fontSize: "1.8rem",
                  fontWeight: "bold",
                  border: "none",
                  borderBottom: "2px solid transparent",
                  marginBottom: "0.5rem",
                  width: "100%",
                  outline: "none"
                }}
                onFocus={(e) => e.target.style.borderBottom = "2px solid #667eea"}
                onBlur={(e) => e.target.style.borderBottom = "2px solid transparent"}
              />
              <select
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                style={{
                  padding: "0.5rem",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  fontSize: "1rem"
                }}
              >
                {Object.keys(campusData).map((name) => (
                  <option key={name}>{campusData[name].name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div style={{
          background: "white",
          borderRadius: "12px",
          padding: "2rem",
          marginBottom: "1.5rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}>
          <h3 style={{ marginTop: 0, marginBottom: "1rem" }}>⭐ Favorite Study Spots</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {favoriteSpots.map((spot, i) => (
              <li key={i} style={{
                padding: "1rem",
                background: "#f8fafc",
                borderRadius: "8px",
                marginBottom: "0.5rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <span>{spot}</span>
                <button
                  onClick={() => setFavoriteSpots(favoriteSpots.filter((_, idx) => idx !== i))}
                  style={{
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "0.25rem 0.75rem",
                    cursor: "pointer",
                    fontSize: "0.9rem"
                  }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div style={{
          background: "white",
          borderRadius: "12px",
          padding: "2rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}>
          <h3 style={{ marginTop: 0, marginBottom: "1rem" }}>⚙️ Study Preferences</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <input type="checkbox" defaultChecked />
              <span>Quiet environments</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <input type="checkbox" />
              <span>Group study spaces</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <input type="checkbox" defaultChecked />
              <span>Near food/coffee</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <input type="checkbox" />
              <span>24/7 access</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;