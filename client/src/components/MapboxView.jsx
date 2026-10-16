import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { MapPin } from "lucide-react";

export default function MapboxView({ coordinates, title, locationName, mapToken }) {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);

  // Nashik coordinates fallback [lng, lat]
  const validCoordinates = (Array.isArray(coordinates) && coordinates.length === 2 && !isNaN(coordinates[0]) && !isNaN(coordinates[1]))
    ? coordinates
    : [73.7898, 19.9975];

  useEffect(() => {
    if (!mapContainer.current || !mapToken) return;

    try {
      mapboxgl.accessToken = mapToken;

      mapInstance.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: validCoordinates,
        zoom: 12.5,
        attributionControl: false,
      });

      mapInstance.current.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");

      // Custom marker
      new mapboxgl.Marker({ color: "#FF385C" })
        .setLngLat(validCoordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div style="font-family: inherit; padding: 4px;">
              <h4 style="font-size: 0.95rem; font-weight: 700; margin: 0 0 4px;">${title || "Accommodation"}</h4>
              <p style="font-size: 0.8rem; color: #717171; margin: 0;">Exact location provided after booking</p>
            </div>
          `)
        )
        .addTo(mapInstance.current);
    } catch (err) {
      console.warn("Mapbox initialization error:", err.message);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
      }
    };
  }, [coordinates, mapToken, title]);

  if (!mapToken) {
    return (
      <div className="sh-map-fallback">
        <MapPin size={28} color="var(--sh-primary)" />
        <div>
          <h4>{locationName || "Nashik, Maharashtra"}</h4>
          <p>Exact location provided after confirmed reservation</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sh-map-wrapper">
      <div ref={mapContainer} className="sh-map-canvas" />

      <style>{`
        .sh-map-wrapper {
          width: 100%;
          border-radius: var(--sh-radius-xl);
          overflow: hidden;
          border: 1px solid var(--sh-border-light);
          box-shadow: var(--sh-shadow-card);
        }

        .sh-map-canvas {
          width: 100%;
          height: 380px;
        }

        .sh-map-fallback {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 32px;
          background: #FAFAFA;
          border: 1px solid var(--sh-border-light);
          border-radius: var(--sh-radius-xl);
        }

        .sh-map-fallback h4 {
          font-size: 1.05rem;
          margin-bottom: 4px;
        }

        .sh-map-fallback p {
          font-size: 0.875rem;
          color: var(--sh-text-secondary);
        }
      `}</style>
    </div>
  );
}
