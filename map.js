export function initMap() {
try {
    const map = L.map('map').setView([48.8567, 2.3508], 13);
    
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '©OpenStreetMap, ©CartoDB',
    subdomains: 'abcd',
    maxZoom: 19
    }).addTo(map);

    const routeLine = L.polyline([], {
    color: '#00ff88',
    weight: 4,
    opacity: 0.8
    }).addTo(map);

    return {
    leafletMap: map,
    routeLine,
    setView: (pos) => map.setView(pos),
    updateRoute: (path) => routeLine.setLatLngs(path),
    calculateDistance: (point1, point2) => map.distance(point1, point2)
    };
} catch (error) {
    console.error('Failed to initialize map:', error);
    throw error;
}
}

