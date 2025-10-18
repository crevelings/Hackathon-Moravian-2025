// API Gateway Service for Study Spot Finder
// This replaces direct DynamoDB access with API calls

const API_BASE_URL = process.env.REACT_APP_API_GATEWAY_URL || 'https://511tt3ig28.execute-api.us-east-1.amazonaws.com/test';

/**
 * Fetch all locations from API Gateway
 */
export const getAllLocations = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/locations`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.items || data;
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw error;
  }
};

/**
 * Fetch locations by university
 */
export const getLocationsByUniversity = async (university) => {
  try {
    const response = await fetch(`${API_BASE_URL}/locations?university=${encodeURIComponent(university)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.items || data;
  } catch (error) {
    console.error('Error fetching locations by university:', error);
    throw error;
  }
};

/**
 * Fetch locations by building
 */
export const getLocationsByBuilding = async (university, buildingName) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/locations?university=${encodeURIComponent(university)}&building=${encodeURIComponent(buildingName)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.items || data;
  } catch (error) {
    console.error('Error fetching locations by building:', error);
    throw error;
  }
};

/**
 * Search rooms by criteria
 */
export const searchRooms = async (filters) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters.university) queryParams.append('university', filters.university);
    if (filters.building) queryParams.append('building', filters.building);
    if (filters.minCapacity) queryParams.append('minCapacity', filters.minCapacity);
    if (filters.reservable !== undefined) queryParams.append('reservable', filters.reservable);
    if (filters.floor) queryParams.append('floor', filters.floor);

    const response = await fetch(`${API_BASE_URL}/locations/search?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.items || data;
  } catch (error) {
    console.error('Error searching rooms:', error);
    throw error;
  }
};

/**
 * Get real-time occupancy for a room
 */
export const getRoomOccupancy = async (university, building, room) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/occupancy?university=${encodeURIComponent(university)}&building=${encodeURIComponent(building)}&room=${encodeURIComponent(room)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching room occupancy:', error);
    throw error;
  }
};

/**
 * Transform API response data to app format
 * Groups rooms by building and calculates availability
 */
export const transformDataForApp = (items) => {
  const campusData = {};

  items.forEach(item => {
    const uni = item.UNI || item.university;
    const buildingName = item.BuildingName || item.building;

    // Initialize university if not exists
    if (!campusData[uni]) {
      campusData[uni] = {
        name: getUniversityFullName(uni),
        buildings: []
      };
    }

    // Find or create building
    let building = campusData[uni].buildings.find(b => b.name === buildingName);
    if (!building) {
      building = {
        name: buildingName,
        address: item.Address || item.address || '',
        availability: 'Open', // Default, will be calculated
        rooms: []
      };
      campusData[uni].buildings.push(building);
    }

    // Add room to building
    building.rooms.push({
      name: item.LocationName || item.RoomNumber || item.room,
      formalName: item.FormalName || item.formalName,
      availability: item.availability || calculateAvailability(item.DefaultCapacity, item.MaxCapacity, item.currentOccupancy),
      style: item.style || determineRoomStyle(item),
      defaultCapacity: item.DefaultCapacity || item.defaultCapacity,
      maxCapacity: item.MaxCapacity || item.maxCapacity,
      reservable: item.Reservable !== undefined ? item.Reservable : item.reservable,
      floor: item.FloorNumber || item.floor
    });
  });

  // Calculate building-level availability
  Object.values(campusData).forEach(campus => {
    campus.buildings.forEach(building => {
      building.availability = calculateBuildingAvailability(building.rooms);
    });
  });

  return campusData;
};

/**
 * Get full university name from abbreviation
 */
const getUniversityFullName = (abbreviation) => {
  const universityNames = {
    'Moravian': 'Moravian University',
    'Lehigh': 'Lehigh University',
    'DeSales': 'DeSales University'
  };
  return universityNames[abbreviation] || abbreviation;
};

/**
 * Calculate room availability based on capacity and occupancy
 */
const calculateAvailability = (defaultCapacity, maxCapacity, currentOccupancy = null) => {
  // If we have real occupancy data, use it
  if (currentOccupancy !== null && currentOccupancy !== undefined) {
    const ratio = currentOccupancy / maxCapacity;
    if (ratio < 0.3) return 'Open';
    if (ratio < 0.7) return 'Moderate';
    return 'Busy';
  }
  
  // Otherwise use mock logic
  const random = Math.random();
  if (random < 0.4) return 'Open';
  if (random < 0.7) return 'Moderate';
  return 'Busy';
};

/**
 * Calculate building availability based on room statuses
 */
const calculateBuildingAvailability = (rooms) => {
  if (rooms.length === 0) return 'Open';
  
  const openCount = rooms.filter(r => r.availability === 'Open').length;
  const ratio = openCount / rooms.length;
  
  if (ratio >= 0.6) return 'Open';
  if (ratio >= 0.3) return 'Moderate';
  return 'Busy';
};

/**
 * Determine room style/type based on attributes
 */
const determineRoomStyle = (item) => {
  const name = ((item.LocationName || item.FormalName || item.room || item.formalName) + '').toLowerCase();
  
  if (name.includes('lecture')) return 'Lecture';
  if (name.includes('seminar')) return 'Seminar';
  if (name.includes('lab')) return 'Lab';
  if (name.includes('lounge')) return 'Lounge';
  if (name.includes('study')) return 'Study';
  if (name.includes('library')) return 'Library';
  if (name.includes('cafe') || name.includes('dining')) return 'Dining';
  if (name.includes('event') || name.includes('ballroom')) return 'Event Space';
  
  // Default based on capacity
  const maxCap = item.MaxCapacity || item.maxCapacity || 0;
  if (maxCap > 50) return 'Lecture Hall';
  if (maxCap > 20) return 'Classroom';
  return 'Study Room';
};

/**
 * Get unique list of universities from data
 */
export const getUniversitiesList = (items) => {
  const universities = [...new Set(items.map(item => item.UNI || item.university))];
  return universities.sort();
};

/**
 * Get unique list of buildings for a university
 */
export const getBuildingsList = (items, university) => {
  const buildings = items
    .filter(item => (item.UNI || item.university) === university)
    .map(item => item.BuildingName || item.building);
  return [...new Set(buildings)].sort();
};