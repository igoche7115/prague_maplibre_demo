const PRAGUE_CENTER = {
  lat: 50.0755,
  lng: 14.4378,
};

const EMOJIS = ["🚗", "🚙", "🚕", "🚐", "🚘", "🚖"];

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function createRandomPoint(id) {
  return {
    id,
    lat: randomBetween(49.98, 50.15),
    lng: randomBetween(14.25, 14.65),
    emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
  };
}

function createClusteredPoint(id, centerLat, centerLng) {
  return {
    id,
    lat: centerLat + randomBetween(-0.01, 0.01),
    lng: centerLng + randomBetween(-0.015, 0.015),
    emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
  };
}

export function generateLocations() {
  const locations = [];
  let id = 1;

  // 120 scattered points
  for (let i = 0; i < 120; i++) {
    locations.push(createRandomPoint(id++));
  }

  // 6 cluster centers around Prague
  const clusterCenters = [
    { lat: PRAGUE_CENTER.lat + 0.02, lng: PRAGUE_CENTER.lng + 0.03 },
    { lat: PRAGUE_CENTER.lat - 0.03, lng: PRAGUE_CENTER.lng + 0.05 },
    { lat: PRAGUE_CENTER.lat + 0.01, lng: PRAGUE_CENTER.lng - 0.06 },
    { lat: PRAGUE_CENTER.lat - 0.02, lng: PRAGUE_CENTER.lng - 0.03 },
    { lat: PRAGUE_CENTER.lat + 0.04, lng: PRAGUE_CENTER.lng - 0.01 },
    { lat: PRAGUE_CENTER.lat - 0.01, lng: PRAGUE_CENTER.lng + 0.07 },
  ];

  for (const center of clusterCenters) {
    for (let i = 0; i < 30; i++) {
      locations.push(createClusteredPoint(id++, center.lat, center.lng));
    }
  }

  return locations;
}