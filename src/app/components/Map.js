import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '50vh', // Adjusted to 50% of viewport height
};

const center = {
  lat: -17.90265655517578, // Latitude
  lng: 30.94776725769043,  // Longitude
};

const Map = () => {
  return (
    <div style={{ height: '50vh', width: '100%' }}>
      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={16}
        >
          <Marker position={center} title="Glenview 2 High School" />
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default Map;
