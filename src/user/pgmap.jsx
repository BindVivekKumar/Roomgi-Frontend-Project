import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useJsApiLoader } from "@react-google-maps/api";

export default function PGMap() {
  const { branchId } = useParams();
  const [branch, setBranch] = useState(null);
  const mapRef = useRef(null);
  const directionsRendererRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);

  // 1️⃣ Load Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBI_1GjWzjhnK--jH94wVq3dmdOGm6sUos",
    libraries: ["marker"], 
  });

  // 2️⃣ Fetch branch from backend
  useEffect(() => {
    async function loadBranch() {
      try {
        const res = await fetch(
          `http://localhost:5000/api/property/location/${branchId}`
        );
        const data = await res.json();
        if (data.success && data.branch) {
          setBranch(data.branch);
        } else {
          console.error("Invalid branch data:", data);
        }
      } catch (err) {
        console.error("Failed to fetch branch:", err);
      }
    }
    loadBranch();
  }, [branchId]);

  // 3️⃣ Initialize map and marker
  useEffect(() => {
    if (!isLoaded || !branch?.location) return;

    const { lat, lng } = branch.location;

    const map = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat, lng },
      zoom: 14,
    });
    mapRef.current = map;

    // ✅ AdvancedMarkerElement for PG
    new window.google.maps.marker.AdvancedMarkerElement({
      map,
      position: { lat, lng },
      title: branch.name,
    });

    // Directions renderer
    const directionsRenderer = new window.google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);
    directionsRendererRef.current = directionsRenderer;
  }, [isLoaded, branch]);

  // 4️⃣ Track user location and draw route
  useEffect(() => {
    if (!branch?.location || !navigator.geolocation || !isLoaded) return;

    const { lat: pgLat, lng: pgLng } = branch.location;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });

        if (mapRef.current && directionsRendererRef.current) {
          const directionsService = new window.google.maps.DirectionsService();
          directionsService.route(
            {
              origin: { lat: latitude, lng: longitude },
              destination: { lat: pgLat, lng: pgLng },
              travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
              if (status === "OK") {
                directionsRendererRef.current.setDirections(result);
              } else {
                console.error("Directions error:", status);
              }
            }
          );
        }
      },
      (err) => console.error("Geolocation error:", err),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [branch, isLoaded]);

  if (loadError) return <div>Error loading Google Maps</div>;
  if (!isLoaded) return <div>Loading Google Maps...</div>;

  return (
    <div
      id="map"
      style={{
        width: "100%",
        height: "500px",
        borderRadius: "10px",
        marginTop: "20px",
      }}
    ></div>
  );
}
