import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

interface GoogleMapComponentProps {
  address?: string;
  setCoordinates: (lat: number, lng: number) => void;
}

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '8px'
};

const defaultCenter = {
  lat: -9.189967,  // Perú centro aproximado
  lng: -75.015152
};

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({ address, setCoordinates }) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [center, setCenter] = useState(defaultCenter);
  const [marker, setMarker] = useState(defaultCenter);
  
  // Función para obtener coordenadas desde una dirección
  useEffect(() => {
    if (address && map) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          const position = results[0].geometry.location;
          const newPos = { lat: position.lat(), lng: position.lng() };
          setCenter(newPos);
          setMarker(newPos);
          map.panTo(newPos);
          setCoordinates(newPos.lat, newPos.lng);
        }
      });
    }
  }, [address, map, setCoordinates]);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newPos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      setMarker(newPos);
      setCoordinates(newPos.lat, newPos.lng);
    }
  };

  const handleMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newPos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      setMarker(newPos);
      setCoordinates(newPos.lat, newPos.lng);
    }
  };

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="p-3 border rounded bg-light text-muted">
        Configura <code>VITE_GOOGLE_MAPS_API_KEY</code> en <code>frontend/.env</code> para ver el mapa.
      </div>
    );
  }

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={14}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleMapClick}
        options={{
          fullscreenControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          zoomControl: true
        }}
      >
        <Marker
          position={marker}
          draggable={true}
          onDragEnd={handleMarkerDragEnd}
        />
        <div className="map-search-overlay" style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          backgroundColor: 'white',
          padding: '5px',
          borderRadius: '4px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          display: 'flex'
        }}>
          <input 
            type="text" 
            placeholder="Buscar dirección" 
            style={{
              border: 'none',
              outline: 'none',
              padding: '8px',
              width: '250px'
            }}
            id="map-search-input"
          />
        </div>
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapComponent;