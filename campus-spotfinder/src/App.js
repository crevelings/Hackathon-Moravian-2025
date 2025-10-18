import React, { useState, useEffect } from "react";

// Placeholder ProfilePage component to allow the app to compile.
// In a real application, this would be in its own file (e.g., Profile.js).
function ProfilePage({ onNavigate }) {
  return (
    <div style={{ padding: "2rem" }}>
      <header style={{
          padding: "1rem",
          background: "#1e2b3b",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem"
        }}>
        <span style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
          My Profile
        </span>
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
      </header>
      <div style={{textAlign: 'center'}}>
        <h2>Profile Page</h2>
        <p>This is where user information and saved favorites will go.</p>
        <p>Functionality for this page has not been implemented yet.</p>
      </div>
    </div>
  );
}


const getAvailabilityColor = (level) => {
  switch (level) {
    case "Open": return "#16a34a";
    case "Moderate": return "#f59e0b";
    case "Busy": return "#dc2626";
    default: return "#6b7280";
  }
};

const transformApiData = (apiData) => {
  if (!apiData || apiData.length === 0) {
    return [];
  }

  const buildingsMap = new Map();

  apiData.forEach(spot => {
    if (!buildingsMap.has(spot.buildingName)) {
      buildingsMap.set(spot.buildingName, {
        name: spot.buildingName,
        rooms: [],
      });
    }
    const room = {
      name: spot.formalName,
      availability: "Open", 
      style: spot.locationName || "Study",
    };
    buildingsMap.get(spot.buildingName).rooms.push(room);
  });

  const buildings = Array.from(buildingsMap.values());
  
  buildings.forEach(b => {
      const openCount = b.rooms.filter(r => r.availability === 'Open').length;
      if (b.rooms.length === 0) {
          b.availability = "Unknown";
      } else if (openCount === 0) {
          b.availability = 'Busy';
      } else if (openCount < b.rooms.length / 2) {
          b.availability = 'Moderate';
      } else {
          b.availability = 'Open';
      }
  });

  return buildings;
};

// ** REMOVED **: The MOCKED_API_DATA constant has been removed.

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
  const [selectedCampusId, setSelectedCampusId] = useState("moravian_university");
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const schools = {
    moravian_university: "Moravian University",
    lehigh_university: "Lehigh University",
    desales: "DeSales University",
  };
  
  // **MODIFIED**: This useEffect now makes a live API call to your backend.
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setSelectedBuilding(null);

      const invokeUrl = ``;

      try {
        const response = await fetch(invokeUrl);
        if (!response.ok) {
          throw new Error(`API returned status ${response.status}`);
        }
        const data = await response.json();
        
        // ** ADDED FOR DEBUGGING **: This will print the raw data to your browser's console.
        console.log("Data returned from API:", data);
        
        const transformedBuildings = transformApiData(data);
        setBuildings(transformedBuildings);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Could not load study spots. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCampusId]);

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
            value={selectedCampusId}
            onChange={(e) => setSelectedCampusId(e.target.value)}
            style={{
              padding: "0.4rem 0.6rem",
              borderRadius: "6px",
              border: "1px solid #cbd5e1",
            }}
          >
            {Object.entries(schools).map(([id, name]) => (
              <option key={id} value={id}>{name}</option>
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
            {schools[selectedCampusId]} - Buildings
          </h2>

          {loading && <p>Loading buildings...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {!loading && !error && (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1.5rem"
            }}>
              {buildings.map((building) => (
                <div
                  key={building.name}
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
          )}
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
