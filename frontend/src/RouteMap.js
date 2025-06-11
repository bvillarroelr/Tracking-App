import React from 'react';
import { GoogleMap, Polyline, useJsApiLoader } from '@react-google-maps/api';

function RouteMap({ path }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  if (!isLoaded) return <div>Cargando mapa...</div>;

  return (
    <GoogleMap
      center={path[0]}
      zoom={12}
      mapContainerStyle={{ height: '400px', width: '100%' }}
    >
      <Polyline path={path} options={{ strokeColor: '#FF0000', strokeWeight: 4 }} />
    </GoogleMap>
  );
}

export default RouteMap;