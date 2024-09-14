import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '50vh', // Adjusted to 50% of viewport height
};

const center = {
  lat: -17.771555, // Updated Latitude
  lng: 30.986481,  // Updated Longitude
};

const Map = () => {
  return (
    <div className="map-container">
      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={16}
          options={{
            disableDefaultUI: true,
            draggable: true,
          }}
        >
          <Marker position={center} title="Divaris Makaharis High" />
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default Map;
