"use client";

import {
  GoogleMap,
  Marker,
  Polyline,
  useLoadScript,
} from "@react-google-maps/api";

type Point = { lat: number; lng: number };

type Record = {
  user: { name: string };
  points: Point[];
};

const containerStyle = {
  width: "100%",
  height: "450px",
};

const COLORS = [
  "#16a34a", // green
  "#2563eb", // blue
  "#dc2626", // red
  "#9333ea", // purple
  "#ea580c", // orange
];

export default function MultiUserTrackingMap({
  records,
}: {
  records: Record[];
}) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  if (!isLoaded) return <p>Loading map...</p>;
  if (!records.length) return <p>No tracking data</p>;

  const first = records[0].points[0];

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={{ lat: first.lat, lng: first.lng }}
      zoom={13}
    >
      {records.map((r, i) => {
        if (!r.points.length) return null;

        const color = COLORS[i % COLORS.length];

        return (
          <div key={i}>
            {/* ROUTE */}
            <Polyline
              path={r.points}
              options={{
                strokeColor: color,
                strokeOpacity: 0.9,
                strokeWeight: 4,
              }}
            />

            {/* START */}
            <Marker
              position={r.points[0]}
              label={`S`}
              title={`${r.user?.name} Start`}
            />

            {/* END */}
            <Marker
              position={r.points[r.points.length - 1]}
              label={`E`}
              title={`${r.user?.name} End`}
            />
          </div>
        );
      })}
    </GoogleMap>
  );
}
