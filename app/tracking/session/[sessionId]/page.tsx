"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { ArrowLeft, Clock, MapPin, ImageOff, Navigation } from "lucide-react";
import UserTrackingMap from "@/components/UserTrackingMap";

const API = process.env.NEXT_PUBLIC_API_URL!;

type Location = { lat: number; lng: number };

type AvailabilityEntry = {
  location: Location;
  available: boolean;
  createdAt: string; // ISO timestamp
};

type Session = {
  startTime: string;
  endTime: string | null;
  startImage?: string;
  endImage?: string;
  startLocation?: Location;
  endLocation?: Location;
};

type SessionResponse = {
  user: { name: string; phone: string };
  session: Session;
  availabilityHistory: AvailabilityEntry[];
};

/* Map-friendly point (for UserTrackingMap) */
type MapPoint = {
  lat: number;
  lng: number;
  timestamp: string;
  available?: boolean; // undefined = start or end
  isStart?: boolean;
  isEnd?: boolean;
};

export default function TrackingDetailPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const router = useRouter();

  const [data, setData] = useState<SessionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API}/api/tracking/session/${sessionId}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const json: SessionResponse = await res.json();
        setData(json);
      } catch (err) {
        console.error("Session fetch failed:", err);
        setError("Failed to load session data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sessionId]);

  const session = data?.session;
  const history = data?.availabilityHistory ?? [];

  // Build points for map + table
  const mapPoints = useMemo<MapPoint[]>(() => {
    const pts: MapPoint[] = [];

    // 1. Start
    if (session?.startLocation && session.startTime) {
      pts.push({
        ...session.startLocation,
        timestamp: session.startTime,
        isStart: true,
      });
    }

    // 2. Availability changes
    pts.push(
      ...history.map((h) => ({
        ...h.location,
        timestamp: h.createdAt,
        available: h.available,
      })),
    );

    // 3. End (only if meaningfully different)
    if (session?.endLocation && session.endTime) {
      const last = pts[pts.length - 1];
      const diff = last
        ? Math.hypot(
            last.lat - session.endLocation.lat,
            last.lng - session.endLocation.lng,
          )
        : Infinity;

      if (diff > 0.0002) {
        // ~20 meters
        pts.push({
          ...session.endLocation,
          timestamp: session.endTime,
          isEnd: true,
        });
      }
    }

    return pts;
  }, [session, history]);

  const duration = useMemo(() => {
    if (!session?.startTime || !session?.endTime) return "—";
    const ms =
      new Date(session.endTime).getTime() -
      new Date(session.startTime).getTime();
    const min = Math.round(ms / 1000 / 60);
    return min < 1 ? "< 1 min" : `${min} min`;
  }, [session]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading session...</p>
        </div>
      </div>
    );
  }

  if (error || !data || !session) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto text-center py-12">
          <p className="text-red-600 text-lg">{error || "Session not found"}</p>
          <button
            onClick={() => router.back()}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
          >
            <ArrowLeft size={18} /> Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/70 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back</span>
          </button>

          <div className="text-center sm:text-right">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Session — {data.user.name}
            </h1>
            <p className="text-gray-600 mt-1">{data.user.phone}</p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard icon={<Clock />} label="Duration" value={duration} />
          <StatCard
            icon={<Navigation />}
            label="Checks"
            value={history.length.toString()}
          />
          <StatCard
            icon={<MapPin />}
            label="Locations"
            value={mapPoints.length.toString()}
          />
        </div>

        {/* Photos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <PhotoCard
            title="Start"
            imageUrl={session.startImage}
            time={session.startTime}
            location={session.startLocation}
          />
          <PhotoCard
            title="End"
            imageUrl={session.endImage}
            time={session.endTime ?? undefined}
            location={session.endLocation}
            isEnd
          />
        </div>

        {/* Map */}
        {mapPoints.length >= 1 && (
          <div className="mb-10 rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white">
            <div className="bg-gray-50 px-5 py-3 border-b">
              <h2 className="font-semibold flex items-center gap-2">
                <MapPin size={18} className="text-blue-600" />
                Route & Availability Status
              </h2>
            </div>
            <div className="h-[500px]">
              <UserTrackingMap points={mapPoints} />
            </div>
          </div>
        )}

        {/* Availability History Table */}
        {history.length > 0 ? (
          <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white">
            <div className="bg-gray-50 px-5 py-3 border-b">
              <h2 className="font-semibold">Availability History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Lat
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Lng
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {history.map((entry, i) => (
                    <tr key={i} className="hover:bg-blue-50/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {new Date(entry.createdAt).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-700">
                        {entry.location.lat.toFixed(6)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-700">
                        {entry.location.lng.toFixed(6)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                            entry.available
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {entry.available ? "Available" : "Not Available"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500 bg-white rounded-2xl border border-dashed">
            No availability updates recorded
          </div>
        )}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────── */
/*               Reusable Components              */
/* ────────────────────────────────────────────── */

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="text-blue-600">{icon}</div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            {label}
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
        </div>
      </div>
    </div>
  );
}

function PhotoCard({
  title,
  imageUrl,
  time,
  location,
  isEnd = false,
}: {
  title: string;
  imageUrl?: string;
  time?: string;
  location?: Location;
  isEnd?: boolean;
}) {
  const gradient = isEnd
    ? "from-green-50 to-emerald-50"
    : "from-blue-50 to-indigo-50";

  return (
    <div
      className={`rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-gradient-to-br ${gradient}`}
    >
      <div className="px-5 py-3.5 border-b bg-white/60 backdrop-blur-sm">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">{title} Photo</h3>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/80">
            {isEnd ? "Completed" : "Started"}
          </span>
        </div>
      </div>

      <div className="aspect-[4/3] relative bg-gray-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
            <ImageOff size={48} />
            <p className="mt-3 text-sm">No photo</p>
          </div>
        )}
      </div>

      <div className="p-4 text-sm text-gray-700 bg-white/60 backdrop-blur-sm">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Clock size={14} />
          {time
            ? new Date(time).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })
            : "—"}
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin size={14} />
          <span className="font-mono text-xs">
            {location
              ? `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`
              : "No location"}
          </span>
        </div>
      </div>
    </div>
  );
}

// "use client";

// import { useParams, useRouter } from "next/navigation";
// import { useEffect, useState, useMemo } from "react";
// import { ArrowLeft, Clock, MapPin, ImageOff, Navigation } from "lucide-react";
// import UserTrackingMap from "@/components/UserTrackingMap";

// const API = process.env.NEXT_PUBLIC_API_URL!;

// type Location = { lat: number; lng: number };

// type AvailabilityEntry = {
//   location: Location;
//   available: boolean;
//   createdAt: string;
// };

// type Session = {
//   startTime: string;
//   endTime: string | null;
//   startImage?: string;
//   endImage?: string;
//   startLocation?: Location;
//   endLocation?: Location;
//   totalPoints?: number;
// };

// type PointFromAPI = {
//   lat: number;
//   lng: number;
//   timestamp: string;
//   accuracy?: number;
//   availability: boolean | null;
//   createdAt: string;
//   updatedAt: string;
// };

// type SessionResponse = {
//   user: { name: string; phone: string };
//   session: Session;
//   points: PointFromAPI[]; // ← we now use this as fallback
//   latestAvailability: any;
//   availabilityHistory: AvailabilityEntry[];
// };

// type MapPoint = {
//   lat: number;
//   lng: number;
//   timestamp: string;
//   available?: boolean;
//   isStart?: boolean;
//   isEnd?: boolean;
//   source?: "availability" | "gps" | "start" | "end"; // for debugging/tooltip
// };

// export default function TrackingDetailPage() {
//   const { sessionId } = useParams<{ sessionId: string }>();
//   const router = useRouter();

//   const [data, setData] = useState<SessionResponse | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!sessionId) return;

//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const res = await fetch(`${API}/api/tracking/session/${sessionId}`, {
//           cache: "no-store",
//         });

//         if (!res.ok) throw new Error(`HTTP ${res.status}`);

//         const json: SessionResponse = await res.json();
//         setData(json);
//       } catch (err) {
//         console.error("Session fetch failed:", err);
//         setError("Failed to load session data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [sessionId]);

//   const session = data?.session;
//   const history = data?.availabilityHistory ?? [];
//   const rawPoints = data?.points ?? [];

//   // ── Build map points ────────────────────────────────────────
//   const mapPoints = useMemo<MapPoint[]>(() => {
//     const pts: MapPoint[] = [];

//     // 1. Start point
//     if (session?.startLocation && session.startTime) {
//       pts.push({
//         ...session.startLocation,
//         timestamp: session.startTime,
//         isStart: true,
//         source: "start",
//       });
//     }

//     // 2. Real availability changes (preferred)
//     pts.push(
//       ...history.map((h) => ({
//         ...h.location,
//         timestamp: h.createdAt,
//         available: h.available,
//         source: "availability" as const,
//       })),
//     );

//     // 3. Fallback: use raw GPS points that have availability !== null
//     //    (most will be null → we can show them grayed out or with info)
//     if (history.length === 0 && rawPoints.length > 0) {
//       pts.push(
//         ...rawPoints.map((p) => ({
//           lat: p.lat,
//           lng: p.lng,
//           timestamp: p.timestamp || p.createdAt,
//           available: p.availability ?? undefined,
//           source: "gps" as const,
//         })),
//       );
//     }

//     // 4. End point (only if different enough)
//     if (session?.endLocation && session.endTime) {
//       const last = pts[pts.length - 1];
//       const diff = last
//         ? Math.hypot(
//             last.lat - session.endLocation.lat,
//             last.lng - session.endLocation.lng,
//           )
//         : Infinity;

//       if (diff > 0.0002) {
//         pts.push({
//           ...session.endLocation,
//           timestamp: session.endTime,
//           isEnd: true,
//           source: "end",
//         });
//       }
//     }

//     // Sort just in case (usually API returns in order)
//     pts.sort(
//       (a, b) =>
//         new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
//     );

//     return pts;
//   }, [session, history, rawPoints]);

//   const duration = useMemo(() => {
//     if (!session?.startTime || !session?.endTime) return "—";
//     const ms =
//       new Date(session.endTime).getTime() -
//       new Date(session.startTime).getTime();
//     const min = Math.round(ms / 1000 / 60);
//     return min < 1 ? "< 1 min" : `${min} min`;
//   }, [session]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading session...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error || !data || !session) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-6">
//         <div className="max-w-5xl mx-auto text-center py-12">
//           <p className="text-red-600 text-lg">{error || "Session not found"}</p>
//           <button
//             onClick={() => router.back()}
//             className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
//           >
//             <ArrowLeft size={18} /> Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const showFallbackMessage = history.length === 0 && rawPoints.length > 0;

//   return (
//     <div className="min-h-screen bg-gray-50/70 pb-12">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
//           <button
//             onClick={() => router.back()}
//             className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
//           >
//             <ArrowLeft size={20} />
//             <span className="font-medium">Back</span>
//           </button>

//           <div className="text-center sm:text-right">
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//               Session — {data.user.name}
//             </h1>
//             <p className="text-gray-600 mt-1">{data.user.phone}</p>
//           </div>
//         </div>

//         {/* Quick stats */}
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
//           <StatCard icon={<Clock />} label="Duration" value={duration} />
//           <StatCard
//             icon={<Navigation />}
//             label="GPS Points"
//             value={rawPoints.length.toString()}
//           />
//           <StatCard
//             icon={<MapPin />}
//             label="Availability Checks"
//             value={history.length.toString()}
//           />
//         </div>

//         {/* Photos */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
//           <PhotoCard
//             title="Start"
//             imageUrl={session.startImage}
//             time={session.startTime}
//             location={session.startLocation}
//           />
//           <PhotoCard
//             title="End"
//             imageUrl={session.endImage}
//             time={session.endTime ?? undefined}
//             location={session.endLocation}
//             isEnd
//           />
//         </div>

//         {/* Map */}
//         {mapPoints.length >= 1 && (
//           <div className="mb-10 rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white">
//             <div className="bg-gray-50 px-5 py-3 border-b">
//               <h2 className="font-semibold flex items-center gap-2">
//                 <MapPin size={18} className="text-blue-600" />
//                 Route & Status
//                 {showFallbackMessage && (
//                   <span className="text-xs font-normal text-amber-700">
//                     (showing GPS points – no availability data)
//                   </span>
//                 )}
//               </h2>
//             </div>
//             <div className="h-[500px]">
//               <UserTrackingMap points={mapPoints} />
//             </div>
//           </div>
//         )}

//         {/* Availability / Points Table */}
//         {history.length > 0 || rawPoints.length > 0 ? (
//           <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white">
//             <div className="bg-gray-50 px-5 py-3 border-b">
//               <h2 className="font-semibold">
//                 {history.length > 0
//                   ? "Availability History"
//                   : "Recorded GPS Points (no availability data)"}
//               </h2>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-100">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Time
//                     </th>
//                     <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Lat
//                     </th>
//                     <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Lng
//                     </th>
//                     <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Status
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100">
//                   {(history.length > 0 ? history : rawPoints).map(
//                     (entry: any, i: number) => {
//                       const isAvailability = "available" in entry;
//                       const time = isAvailability
//                         ? entry.createdAt
//                         : entry.timestamp || entry.createdAt;
//                       const lat = isAvailability
//                         ? entry.location.lat
//                         : entry.lat;
//                       const lng = isAvailability
//                         ? entry.location.lng
//                         : entry.lng;
//                       const avail = isAvailability
//                         ? entry.available
//                         : entry.availability;

//                       return (
//                         <tr key={i} className="hover:bg-blue-50/50">
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                             {new Date(time).toLocaleString("en-IN", {
//                               dateStyle: "medium",
//                               timeStyle: "short",
//                             })}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-700">
//                             {lat.toFixed(6)}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-700">
//                             {lng.toFixed(6)}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             {avail === null || avail === undefined ? (
//                               <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
//                                 No data
//                               </span>
//                             ) : avail ? (
//                               <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
//                                 Available
//                               </span>
//                             ) : (
//                               <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
//                                 Not Available
//                               </span>
//                             )}
//                           </td>
//                         </tr>
//                       );
//                     },
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         ) : (
//           <div className="text-center py-16 text-gray-500 bg-white rounded-2xl border border-dashed">
//             No location or availability data recorded
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// /* ── Reusable components (unchanged) ── */
// function StatCard({
//   icon,
//   label,
//   value,
// }: {
//   icon: React.ReactNode;
//   label: string;
//   value: string;
// }) {
//   return (
//     <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
//       <div className="flex items-center gap-3">
//         <div className="text-blue-600">{icon}</div>
//         <div>
//           <p className="text-xs text-gray-500 uppercase tracking-wide">
//             {label}
//           </p>
//           <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// function PhotoCard({
//   title,
//   imageUrl,
//   time,
//   location,
//   isEnd = false,
// }: {
//   title: string;
//   imageUrl?: string;
//   time?: string;
//   location?: Location;
//   isEnd?: boolean;
// }) {
//   const gradient = isEnd
//     ? "from-green-50 to-emerald-50"
//     : "from-blue-50 to-indigo-50";

//   return (
//     <div
//       className={`rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-gradient-to-br ${gradient}`}
//     >
//       <div className="px-5 py-3.5 border-b bg-white/60 backdrop-blur-sm">
//         <div className="flex justify-between items-center">
//           <h3 className="font-semibold text-gray-800">{title} Photo</h3>
//           <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/80">
//             {isEnd ? "Completed" : "Started"}
//           </span>
//         </div>
//       </div>

//       <div className="aspect-[4/3] relative bg-gray-100">
//         {imageUrl ? (
//           <img
//             src={imageUrl}
//             alt={title}
//             className="w-full h-full object-cover"
//           />
//         ) : (
//           <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
//             <ImageOff size={48} />
//             <p className="mt-3 text-sm">No photo</p>
//           </div>
//         )}
//       </div>

//       <div className="p-4 text-sm text-gray-700 bg-white/60 backdrop-blur-sm">
//         <div className="flex items-center gap-1.5 mb-1.5">
//           <Clock size={14} />
//           {time
//             ? new Date(time).toLocaleString("en-IN", {
//                 dateStyle: "medium",
//                 timeStyle: "short",
//               })
//             : "—"}
//         </div>
//         <div className="flex items-center gap-1.5">
//           <MapPin size={14} />
//           <span className="font-mono text-xs">
//             {location
//               ? `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`
//               : "No location"}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }
