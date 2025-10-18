import React, { useState, useEffect } from "react";
import ProfilePage from "./Profile";
import { getAllLocations, transformDataForApp } from "./apiService";

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
function HomeScreen({ onNavigate, campusData }) {
  const campusCount = Object.keys(campusData).length;
  const buildingCount = Object.values(campusData).reduce((acc, campus) => 
    acc + campus.buildings.length, 0
  );

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
            <div style={{ fontSize: "0.9rem", color: "#64748b" }}>{campusCount} Universities</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🏢</div>
            <div style={{ fontSize: "0.9rem", color: "#64748b" }}>{buildingCount} Buildings</div>
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
function BuildingsView({ onNavigate, campusData }) {
  const [selectedCampus, setSelectedCampus] = useState(Object.keys(campusData)[0] || "");
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [filters, setFilters] = useState({
    minCapacity: "",
    reservableOnly: false,
    availabilityFilter: "All"
  });

  const currentCampus = campusData[selectedCampus];

  // Apply filters to selected building rooms
  useEffect(() => {
    if (selectedBuilding) {
      let rooms = [...selectedBuilding.rooms];

      // Filter by capacity
      if (filters.minCapacity) {
        rooms = rooms.filter(r => r.maxCapacity >= parseInt(filters.minCapacity));
      }

      // Filter by reservable
      if (filters.reservableOnly) {
        rooms = rooms.filter(r => r.reservable);
      }

      // Filter by availability
      if (filters.availabilityFilter !== "All") {
        rooms = rooms.filter(r => r.availability === filters.availabilityFilter);
      }

      setFilteredRooms(rooms);
    }
  }, [selectedBuilding, filters]);

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
          alignItems: "center",
          gap: "1rem",
          background: "#f8fafc",
          borderBottom: "1px solid #e2e8f0",
          flexWrap: "wrap"
        }}>
          <div>
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
                <option key={name} value={name}>{campusData[name].name}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "2rem",
          background: "#f8fafc"
        }}>
          {currentCampus ? (
            <>
              <h2 style={{ marginBottom: "1.5rem", color: "#1e293b" }}>
                {currentCampus.name} - Buildings
              </h2>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "1.5rem"
              }}>
                {currentCampus.buildings.map((building, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedBuilding(building);
                      setFilteredRooms(building.rooms);
                    }}
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
                      margin: "0 0 0.5rem 0",
                      color: getAvailabilityColor(building.availability),
                      fontWeight: "bold"
                    }}>
                      Status: {building.availability}
                    </p>
                    <p style={{ margin: "0 0 0.25rem 0", color: "#64748b", fontSize: "0.9rem" }}>
                      {building.rooms.length} rooms available
                    </p>
                    {building.address && (
                      <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.8rem" }}>
                        📍 {building.address}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <p>No data available. Loading...</p>
            </div>
          )}
        </div>
      </div>

      {selectedBuilding && (
        <div style={{
          width: "400px",
          background: "#f9fafb",
          borderLeft: "1px solid #d1d5db",
          padding: "1rem",
          overflowY: "auto",
          transition: "transform 0.3s ease",
        }}>
          <div style={{ position: "sticky", top: 0, background: "#f9fafb", paddingBottom: "1rem", zIndex: 10 }}>
            <h2 style={{ marginBottom: "0.5rem", color: "#111827" }}>
              {selectedBuilding.name}
            </h2>
            <p style={{
              color: getAvailabilityColor(selectedBuilding.availability),
              fontWeight: "bold",
              marginBottom: "1rem"
            }}>
              Overall: {selectedBuilding.availability}
            </p>

            {/* Filters */}
            <div style={{
              background: "white",
              padding: "1rem",
              borderRadius: "8px",
              marginBottom: "1rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}>
              <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem" }}>Filters</h4>
              
              <div style={{ marginBottom: "0.5rem" }}>
                <label style={{ fontSize: "0.85rem", display: "block", marginBottom: "0.25rem" }}>
                  Min Capacity:
                </label>
                <input
                  type="number"
                  value={filters.minCapacity}
                  onChange={(e) => setFilters({...filters, minCapacity: e.target.value})}
                  placeholder="Any"
                  style={{
                    width: "100%",
                    padding: "0.4rem",
                    borderRadius: "4px",
                    border: "1px solid #cbd5e1",
                    fontSize: "0.85rem"
                  }}
                />
              </div>

              <div style={{ marginBottom: "0.5rem" }}>
                <label style={{ fontSize: "0.85rem", display: "block", marginBottom: "0.25rem" }}>
                  Availability:
                </label>
                <select
                  value={filters.availabilityFilter}
                  onChange={(e) => setFilters({...filters, availabilityFilter: e.target.value})}
                  style={{
                    width: "100%",
                    padding: "0.4rem",
                    borderRadius: "4px",
                    border: "1px solid #cbd5e1",
                    fontSize: "0.85rem"
                  }}
                >
                  <option value="All">All</option>
                  <option value="Open">Open Only</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Busy">Busy</option>
                </select>
              </div>

              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
                <input
                  type="checkbox"
                  checked={filters.reservableOnly}
                  onChange={(e) => setFilters({...filters, reservableOnly: e.target.checked})}
                />
                Reservable only
              </label>
            </div>
          </div>

          <h3 style={{ marginBottom: "0.5rem", fontSize: "1rem" }}>
            Rooms ({filteredRooms.length}):
          </h3>

          {filteredRooms.length > 0 ? (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {filteredRooms.map((room, i) => (
                <li key={i} style={{
                  background: "#fff",
                  marginBottom: "0.5rem",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                }}>
                  <strong>{room.name}</strong>
                  {room.formalName && room.formalName !== room.name && (
                    <p style={{ margin: "0.25rem 0", fontSize: "0.85rem", color: "#64748b" }}>
                      {room.formalName}
                    </p>
                  )}
                  <p style={{ margin: "0.25rem 0" }}>
                    Availability:{" "}
                    <span style={{ color: getAvailabilityColor(room.availability), fontWeight: "bold" }}>
                      {room.availability}
                    </span>
                  </p>
                  <p style={{ margin: "0.25rem 0", fontSize: "0.9rem" }}>
                    Style: {room.style}
                  </p>
                  <p style={{ margin: "0.25rem 0", fontSize: "0.9rem" }}>
                    Capacity: {room.defaultCapacity || room.maxCapacity} 
                    {room.defaultCapacity && room.maxCapacity && ` (max ${room.maxCapacity})`}
                  </p>
                  {room.floor && (
                    <p style={{ margin: "0.25rem 0", fontSize: "0.85rem", color: "#64748b" }}>
                      Floor: {room.floor}
                    </p>
                  )}
                  {room.reservable && (
                    <span style={{
                      display: "inline-block",
                      marginTop: "0.25rem",
                      padding: "0.15rem 0.5rem",
                      background: "#dbeafe",
                      color: "#1e40af",
                      borderRadius: "4px",
                      fontSize: "0.75rem",
                      fontWeight: "600"
                    }}>
                      Reservable
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
              No rooms match your filters.
            </p>
          )}

          <button
            onClick={() => {
              setSelectedBuilding(null);
              setFilters({
                minCapacity: "",
                reservableOnly: false,
                availabilityFilter: "All"
              });
            }}
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
  const [campusData, setCampusData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API Gateway on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const items = await getAllLocations();
        const transformed = transformDataForApp(items);
        setCampusData(transformed);
        setError(null);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load data from API. Please check your API Gateway configuration.');
        setCampusData({});
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#f8fafc"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📚</div>
          <p style={{ fontSize: "1.2rem", color: "#64748b" }}>Loading study spots...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#f8fafc"
      }}>
        <div style={{
          textAlign: "center",
          maxWidth: "500px",
          padding: "2rem",
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
          <h2 style={{ color: "#dc2626", marginBottom: "1rem" }}>Error Loading Data</h2>
          <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "0.75rem 1.5rem",
              background: "#667eea",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "600"
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  switch (currentPage) {
    case "home":
      return <HomeScreen onNavigate={handleNavigate} campusData={campusData} />;
    case "profile":
      return <ProfilePage onNavigate={handleNavigate} campusData={campusData} />;
    case "map":
      return <BuildingsView onNavigate={handleNavigate} campusData={campusData} />;
    default:
      return <HomeScreen onNavigate={handleNavigate} campusData={campusData} />;
  }
}

export default App;