import React, { useState } from "react";
import ProfilePage from "./Profile";

const campusData = {
  Moravian: {
    name: "Moravian University",
    buildings: [
      {
        name: "PPHAC",
        availability: "Open",
        rooms: [
          { name: "Room 101", availability: "Open", style: "Lecture" },
          { name: "Room 202", availability: "Busy", style: "Seminar" },
          { name: "Room 305", availability: "Moderate", style: "Study" },
        ],
      },
      {
        name: "HUB Lounge",
        availability: "Moderate",
        rooms: [
          { name: "North Lounge", availability: "Open", style: "Lounge" },
          { name: "South Lounge", availability: "Busy", style: "Café" },
        ],
      },
    ],
  },
  Lehigh: {
    name: "Lehigh University",
    buildings: [
      {
        name: "FML Library",
        availability: "Open",
        rooms: [
          { name: "Lower Study", availability: "Moderate", style: "Study" },
          { name: "Silent Zone", availability: "Open", style: "Quiet Study" },
        ],
      },
      {
        name: "Lamberton Hall",
        availability: "Moderate",
        rooms: [
          { name: "Main Hall", availability: "Busy", style: "Event Space" },
          { name: "Cafe Area", availability: "Moderate", style: "Dining" },
        ],
      },
    ],
  },
  DeSales: {
    name: "DeSales University",
    buildings: [
      {
        name: "Dooling Hall",
        availability: "Open",
        rooms: [
          { name: "Room A", availability: "Open", style: "Classroom" },
          { name: "Room B", availability: "Busy", style: "Lab" },
        ],
      },
      {
        name: "University Center",
        availability: "Busy",
        rooms: [
          { name: "Ballroom", availability: "Busy", style: "Event Hall" },
          { name: "Dining Area", availability: "Moderate", style: "Cafeteria" },
        ],
      },
    ],
  },
};

const getAvailabilityColor = (level) => {
  switch (level) {
    case "Open":
      return "#16a34a";
    case "Moderate":
      return "#f59e0b";
    case "Busy":
      return "#dc2626";
    default:
      return "#6b7280";
  }
};

// Home Screen Component
function HomeScreen({ onNavigate }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem"
    }}>
      <div style={{
        maxWidth: "600px",
        background: "white",
        borderRadius: "20px",
        padding: "3rem",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        textAlign: "center"
      }}>
        <h1 style={{
          fontSize: "3rem",
          marginBottom: "1rem",
          color: "#1e293b",
          fontWeight: "800"
        }}>
          📚 Study Spot Finder
        </h1>
        <p style={{
          fontSize: "1.2rem",
          color: "#64748b",
          marginBottom: "2rem",
          lineHeight: "1.6"
        }}>
          Find the perfect place to study across local universities. 
          Check real-time availability and discover quiet spaces.
        </p>
        
        <div style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
          flexWrap: "wrap"
        }}>
          <button
            onClick={() => onNavigate("map")}
            style={{
              padding: "1rem 2rem",
              fontSize: "1.1rem",
              background: "#667eea",
              color: "white",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: "600",
              boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
              transition: "transform 0.2s"
            }}
            onMouseOver={(e) => e.target.style.transform = "scale(1.05)"}
            onMouseOut={(e) => e.target.style.transform = "scale(1)"}
          >
            Explore Buildings
          </button>
          
          <button
            onClick={() => onNavigate("profile")}
            style={{
              padding: "1rem 2rem",
              fontSize: "1.1rem",
              background: "white",
              color: "#667eea",
              border: "2px solid #667eea",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: "600",
              transition: "transform 0.2s"
            }}
            onMouseOver={(e) => e.target.style.transform = "scale(1.05)"}
            onMouseOut={(e) => e.target.style.transform = "scale(1)"}
          >
            My Profile
          </button>
        </div>

        <div style={{
          marginTop: "3rem",
          display: "flex",
          justifyContent: "space-around",
          gap: "1rem"
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🎓</div>
            <div style={{ fontSize: "0.9rem", color: "#64748b" }}>3 Universities</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🏢</div>
            <div style={{ fontSize: "0.9rem", color: "#64748b" }}>Multiple Buildings</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>⏱️</div>
            <div style={{ fontSize: "0.9rem", color: "#64748b" }}>Real-time Updates</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Buildings View Component
function BuildingsView({ onNavigate }) {
  const [selectedCampus, setSelectedCampus] = useState("Moravian");
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <header style={{
          padding: "1rem",
          background: "#1e293b",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <span style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
            Study Spot Finder 📚
          </span>
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
              onClick={() => onNavigate("profile")}
              style={{
                padding: "0.5rem 1rem",
                background: "#667eea",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              Profile
            </button>
          </div>
        </header>

        <div style={{
          padding: "0.75rem",
          display: "flex",
          justifyContent: "center",
          background: "#f8fafc",
          borderBottom: "1px solid #e2e8f0",
        }}>
          <label style={{ marginRight: "0.5rem", fontWeight: "bold" }}>
            Select University:
          </label>
          <select
            value={selectedCampus}
            onChange={(e) => {
              setSelectedCampus(e.target.value);
              setSelectedBuilding(null);
            }}
            style={{
              padding: "0.4rem 0.6rem",
              borderRadius: "6px",
              border: "1px solid #cbd5e1",
            }}
          >
            {Object.keys(campusData).map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>
        </div>

        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "2rem",
          background: "#f8fafc"
        }}>
          <h2 style={{ marginBottom: "1.5rem", color: "#1e293b" }}>
            {campusData[selectedCampus].name} - Buildings
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.5rem"
          }}>
            {campusData[selectedCampus].buildings.map((building, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedBuilding(building)}
                style={{
                  background: "white",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  cursor: "pointer",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  borderLeft: `4px solid ${getAvailabilityColor(building.availability)}`
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                }}
              >
                <h3 style={{ margin: "0 0 0.5rem 0", color: "#1e293b" }}>
                  {building.name}
                </h3>
                <p style={{
                  margin: "0 0 0.75rem 0",
                  color: getAvailabilityColor(building.availability),
                  fontWeight: "bold"
                }}>
                  Status: {building.availability}
                </p>
                <p style={{ margin: 0, color: "#64748b", fontSize: "0.9rem" }}>
                  {building.rooms.length} rooms available
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedBuilding && (
        <div style={{
          width: "350px",
          background: "#f9fafb",
          borderLeft: "1px solid #d1d5db",
          padding: "1rem",
          overflowY: "auto",
          transition: "transform 0.3s ease",
        }}>
          <h2 style={{ marginBottom: "0.5rem", color: "#111827" }}>
            {selectedBuilding.name}
          </h2>
          <p style={{
            color: getAvailabilityColor(selectedBuilding.availability),
            fontWeight: "bold",
          }}>
            Overall: {selectedBuilding.availability}
          </p>
          <hr style={{ margin: "0.5rem 0" }} />
          <h3 style={{ marginBottom: "0.5rem" }}>Rooms:</h3>

          {selectedBuilding.rooms && selectedBuilding.rooms.length > 0 ? (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {selectedBuilding.rooms.map((room, i) => (
                <li key={i} style={{
                  background: "#fff",
                  marginBottom: "0.5rem",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                }}>
                  <strong>{room.name}</strong>
                  <p style={{ margin: "0.25rem 0" }}>
                    Availability:{" "}
                    <span style={{ color: getAvailabilityColor(room.availability) }}>
                      {room.availability}
                    </span>
                  </p>
                  <p style={{ margin: 0 }}>Style: {room.style}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No room data available.</p>
          )}

          <button
            onClick={() => setSelectedBuilding(null)}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              background: "#1e293b",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              width: "100%",
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

// Main App Component with Navigation
function App() {
  const [currentPage, setCurrentPage] = useState("home");

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  switch (currentPage) {
    case "home":
      return <HomeScreen onNavigate={handleNavigate} />;
    case "profile":
      return <ProfilePage onNavigate={handleNavigate} />;
    case "map":
      return <BuildingsView onNavigate={handleNavigate} />;
    default:
      return <HomeScreen onNavigate={handleNavigate} />;
  }
}

export default App;