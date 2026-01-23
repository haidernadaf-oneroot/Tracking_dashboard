"use client";

import {
  GoogleMap,
  Marker,
  Polyline,
  useLoadScript,
} from "@react-google-maps/api";

type Point = { lat: number; lng: number };

const containerStyle = { width: "100%", height: "400px" };

export default function UserTrackingMap({ points }: { points: Point[] }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  if (!isLoaded) return <p>Loading map...</p>;
  if (!points.length) return <p>No location data</p>;

  const center = points[0];

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
      <Polyline
        path={points}
        options={{
          strokeColor: "#16a34a",
          strokeOpacity: 0.9,
          strokeWeight: 4,
        }}
      />
      <Marker position={points[0]} label="S" />
      <Marker position={points[points.length - 1]} label="E" />
    </GoogleMap>
  );
}
