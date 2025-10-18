import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  Polygon,
  useJsApiLoader,
} from "@react-google-maps/api";

const libraries = ["places"];

const campusData = {
  Moravian: {
    name: "Moravian University",
    address: "348 Main St, Bethlehem, PA 18018",
    buildings: [
      {
        name: "PPHAC",
        address: "1130 Monocacy St, Bethlehem, PA 18018",
        availability: "Open",
        rooms: [
          { name: "Room 101", availability: "Open", style: "Lecture" },
          { name: "Room 202", availability: "Busy", style: "Seminar" },
          { name: "Room 305", availability: "Moderate", style: "Study" },
        ],
      },
      {
        name: "HUB Lounge",
        address: "1125 Monocacy St, Bethlehem, PA 18018",
        availability: "Moderate",
        rooms: [
          { name: "North Lounge", availability: "Open", style: "Lounge" },
          { name: "South Lounge", availability: "Busy", style: "Café" },
        ],
      },
    ],
    centerOverride: { lat: 40.6303, lng: -75.3809 },
  },
  Lehigh: {
    name: "Lehigh University",
    address: "421 E Packer Ave, Bethlehem, PA 18015",
    buildings: [
      {
        name: "FML Library",
        address: "8 E Packer Ave, Bethlehem, PA 18015",
        availability: "Open",
        rooms: [
          { name: "Lower Study", availability: "Moderate", style: "Study" },
          { name: "Silent Zone", availability: "Open", style: "Quiet Study" },
        ],
      },
      {
        name: "Lamberton Hall",
        address: "34 University Dr, Bethlehem, PA 18015",
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
    address: "2755 Station Ave, Center Valley, PA",
    buildings: [
      {
        name: "Dooling Hall",
        address: "2755 Station Ave, Center Valley, PA",
        availability: "Open",
        rooms: [
          { name: "Room A", availability: "Open", style: "Classroom" },
          { name: "Room B", availability: "Busy", style: "Lab" },
        ],
      },
      {
        name: "University Center",
        address: "2755 Station Ave, Center Valley, PA",
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
      return "#16a34a"; // green
    case "Moderate":
      return "#f59e0b"; // orange
    case "Busy":
      return "#dc2626"; // red
    default:
      return "#6b7280"; // gray
  }
};

function App() {
  const [selectedCampus, setSelectedCampus] = useState("Moravian");
  const [campusCenters, setCampusCenters] = useState({});
  const [buildingCoords, setBuildingCoords] = useState({});
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY",
    libraries,
  });

  useEffect(() => {
    if (isLoaded) {
      const geocoder = new window.google.maps.Geocoder();

      Object.entries(campusData).forEach(([campus, data]) => {
        geocoder.geocode({ address: data.address }, (results, status) => {
          if (status === "OK" && results[0]) {
            setCampusCenters((prev) => ({
              ...prev,
              [campus]: results[0].geometry.location,
            }));
          }
        });

        data.buildings.forEach((b) => {
          geocoder.geocode({ address: b.address }, (results, status) => {
            if (status === "OK" && results[0]) {
              const loc = results[0].geometry.location;
              const offset = 0.0002;
              const square = [
                { lat: loc.lat() + offset, lng: loc.lng() - offset },
                { lat: loc.lat() + offset, lng: loc.lng() + offset },
                { lat: loc.lat() - offset, lng: loc.lng() + offset },
                { lat: loc.lat() - offset, lng: loc.lng() - offset },
              ];
              setBuildingCoords((prev) => ({
                ...prev,
                [b.name]: square,
              }));
            }
          });
        });
      });
    }
  }, [isLoaded]);

  if (!isLoaded) return <div>Loading map...</div>;
  if (!campusCenters[selectedCampus])
    return <div>Loading {selectedCampus} campus...</div>;

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Main Map Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <header
          style={{
            padding: "1rem",
            background: "#1e293b",
            color: "white",
            fontWeight: "bold",
            textAlign: "center",
            fontSize: "1.5rem",
          }}
        >
          Study Spot Finder 🧠
        </header>

        {/* Campus Selector */}
        <div
          style={{
            padding: "0.75rem",
            display: "flex",
            justifyContent: "center",
            background: "#f8fafc",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
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

        <GoogleMap
          center={campusCenters[selectedCampus]}
          zoom={16}
          mapContainerStyle={{ flex: 1 }}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
          }}
        >
          {campusData[selectedCampus].buildings.map((b) => {
            const coords = buildingCoords[b.name];
            if (!coords) return null;
            return (
              <Polygon
                key={b.name}
                paths={coords}
                options={{
                  fillColor: getAvailabilityColor(b.availability),
                  fillOpacity: 0.5,
                  strokeColor: getAvailabilityColor(b.availability),
                  strokeWeight: 2,
                }}
                onClick={() => setSelectedBuilding(b)}
              />
            );
          })}
        </GoogleMap>
      </div>

      {/* Right Sidebar */}
      {selectedBuilding && (
        <div
          style={{
            width: "350px",
            background: "#f9fafb",
            borderLeft: "1px solid #d1d5db",
            padding: "1rem",
            overflowY: "auto",
            transition: "transform 0.3s ease",
          }}
        >
          <h2 style={{ marginBottom: "0.5rem", color: "#111827" }}>
            {selectedBuilding.name}
          </h2>
          <p
            style={{
              color: getAvailabilityColor(selectedBuilding.availability),
              fontWeight: "bold",
            }}
          >
            Overall: {selectedBuilding.availability}
          </p>
          <hr style={{ margin: "0.5rem 0" }} />
          <h3 style={{ marginBottom: "0.5rem" }}>Rooms:</h3>

          {selectedBuilding.rooms && selectedBuilding.rooms.length > 0 ? (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {selectedBuilding.rooms.map((room, i) => (
                <li
                  key={i}
                  style={{
                    background: "#fff",
                    marginBottom: "0.5rem",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                  }}
                >
                  <strong>{room.name}</strong>
                  <p style={{ margin: "0.25rem 0" }}>
                    Availability:{" "}
                    <span
                      style={{ color: getAvailabilityColor(room.availability) }}
                    >
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

export default App;
