// "use client";

// import { useParams, useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import UserTrackingMap from "@/components/UserTrackingMap";

// const API = process.env.NEXT_PUBLIC_API_URL!;

// export default function UserTrackingDetailsPage() {
//   const params = useParams();
//   const userId = params.userId as string;

//   const router = useRouter();

//   const [points, setPoints] = useState<any[]>([]);
//   const [session, setSession] = useState<any>(null);
//   const [user, setUser] = useState<any>(null);
//   const [loading, setLoading] = useState(false);

//   /* ================= FETCH TRACKING ================= */
//   const fetchTracking = async () => {
//     try {
//       setLoading(true);

//       const res = await fetch(`${API}/api/tracking/user/${userId}`);
//       if (!res.ok) throw new Error("API failed");

//       const data = await res.json();

//       setPoints(data.points || []);
//       setSession(data.session || null);
//       setUser(data.user || null);
//     } catch (err) {
//       console.error("TRACK FETCH ERROR:", err);
//       alert("Failed to load tracking");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (userId) fetchTracking();
//   }, [userId]);

//   return (
//     <div className="p-6 space-y-6">
//       {/* BACK */}
//       <button onClick={() => router.back()} className="text-blue-600 underline">
//         ← Back
//       </button>

//       {/* HEADER */}
//       <div>
//         <h1 className="text-2xl font-bold">User Tracking Details</h1>
//         {user && (
//           <p className="text-gray-600">
//             {user.name} • {user.phone}
//           </p>
//         )}
//       </div>

//       {loading && <p>Loading...</p>}

//       {/* ================= START & END IMAGES ================= */}
//       {session && (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* START IMAGE */}
//           <div className="border rounded p-3">
//             <p className="font-semibold mb-2">Start Photo</p>
//             {session.startImage ? (
//               <img
//                 src={session.startImage}
//                 className="w-full h-64 object-cover rounded"
//                 alt="Start"
//               />
//             ) : (
//               <p className="text-sm text-gray-500">No start image</p>
//             )}
//             <p className="text-sm text-gray-500 mt-1">
//               {session.startTime
//                 ? new Date(session.startTime).toLocaleString()
//                 : ""}
//             </p>
//           </div>

//           {/* END IMAGE */}
//           <div className="border rounded p-3">
//             <p className="font-semibold mb-2">End Photo</p>
//             {session.endImage ? (
//               <img
//                 src={session.endImage}
//                 className="w-full h-64 object-cover rounded"
//                 alt="End"
//               />
//             ) : (
//               <p className="text-sm text-gray-500">Not ended yet</p>
//             )}
//             <p className="text-sm text-gray-500 mt-1">
//               {session.endTime
//                 ? new Date(session.endTime).toLocaleString()
//                 : ""}
//             </p>
//           </div>
//         </div>
//       )}

//       {/* ================= MAP ================= */}
//       {points.length > 0 && <UserTrackingMap points={points} />}

//       {/* ================= POINT TABLE ================= */}
//       {points.length > 0 && (
//         <table className="w-full border text-sm mt-4">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="border p-2">Time</th>
//               <th className="border p-2">Lat</th>
//               <th className="border p-2">Lng</th>
//               <th className="border p-2">Accuracy</th>
//             </tr>
//           </thead>
//           <tbody>
//             {points.map((p, i) => (
//               <tr key={i}>
//                 <td className="border p-2">
//                   {new Date(p.timestamp).toLocaleTimeString()}
//                 </td>
//                 <td className="border p-2">{p.lat}</td>
//                 <td className="border p-2">{p.lng}</td>
//                 <td className="border p-2">{p.accuracy}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       {!loading && points.length === 0 && (
//         <p className="text-gray-500">No tracking data found.</p>
//       )}
//     </div>
//   );
// }
// app/tracking/[userId]/page.tsx   or wherever this component lives

"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Image,
  ImageOff,
  Navigation,
} from "lucide-react";
import UserTrackingMap from "@/components/UserTrackingMap"; // assuming you already have this

const API = process.env.NEXT_PUBLIC_API_URL!;

type Point = {
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: string;
};

type SessionData = {
  user: { name: string; phone: string };
  session: {
    startTime: string;
    endTime: string;
    startImage?: string;
    endImage?: string;
    startLocation: { lat: number; lng: number };
    endLocation: { lat: number; lng: number };
    totalPoints: number;
  };
  points: Point[];
};

export default function TrackingDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const router = useRouter();

  const [data, setData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API}/api/tracking/user/${userId}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to load session");
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError("Couldn't load tracking data. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const session = data?.session;
  const points = data?.points ?? [];

  const duration = useMemo(() => {
    if (!session?.startTime || !session?.endTime) return "—";
    const start = new Date(session.startTime);
    const end = new Date(session.endTime);
    const diff = (end.getTime() - start.getTime()) / 1000 / 60; // minutes
    return diff < 1 ? "< 1 min" : `${Math.round(diff)} min`;
  }, [session]);

  const avgAccuracy = useMemo(() => {
    if (points.length === 0) return 0;
    const sum = points.reduce((acc, p) => acc + p.accuracy, 0);
    return (sum / points.length).toFixed(1);
  }, [points]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading session details...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto text-center py-12">
          <p className="text-red-600 text-lg">{error || "No data found"}</p>
          <button
            onClick={() => router.back()}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
          >
            <ArrowLeft size={18} /> Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/70 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to list</span>
          </button>

          <div className="text-center sm:text-right">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Tracking Session — {data.user.name}
            </h1>
            <p className="text-gray-600 mt-1">{data.user.phone}</p>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard icon={<Clock />} label="Duration" value={duration} />
          <StatCard
            icon={<Navigation />}
            label="Points"
            value={`${points.length} / ${session.totalPoints}`}
          />
          <StatCard
            icon={<MapPin />}
            label="Avg Accuracy"
            value={`${avgAccuracy} m`}
            accent={
              Number(avgAccuracy) <= 10 ? "text-green-600" : "text-amber-600"
            }
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
            time={session.endTime}
            location={session.endLocation}
            isEnd
          />
        </div>

        {/* Map */}
        {points.length > 1 && (
          <div className="mb-10 rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white">
            <div className="bg-gray-50 px-5 py-3 border-b">
              <h2 className="font-semibold flex items-center gap-2">
                <MapPin size={18} className="text-blue-600" />
                Route Overview
              </h2>
            </div>
            <div className="h-[400px] sm:h-[500px]">
              <UserTrackingMap
                points={points}
                start={session.startLocation}
                end={session.endLocation}
              />
            </div>
          </div>
        )}

        {/* Points Table */}
        {points.length > 0 && (
          <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white">
            <div className="bg-gray-50 px-5 py-3 border-b">
              <h2 className="font-semibold">Location History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Lat
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Lng
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Accuracy
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {points.map((p, i) => (
                    <tr
                      key={i}
                      className="hover:bg-blue-50/40 transition-colors"
                    >
                      <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">
                        {new Date(p.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-600 font-mono">
                        {p.lat.toFixed(6)}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-600 font-mono">
                        {p.lng.toFixed(6)}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-sm">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            p.accuracy <= 10
                              ? "bg-green-100 text-green-800"
                              : p.accuracy <= 20
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {Math.round(p.accuracy)} m
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {points.length === 0 && (
          <div className="text-center py-16 text-gray-500 bg-white rounded-2xl border border-dashed">
            No location points recorded in this session.
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent = "",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="text-blue-600">{icon}</div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            {label}
          </p>
          <p className={`text-xl font-bold ${accent}`}>{value}</p>
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
  time: string;
  location?: { lat: number; lng: number };
  isEnd?: boolean;
}) {
  const status = isEnd ? "Completed" : "Started";
  const bg = isEnd
    ? "from-green-50 to-emerald-50"
    : "from-blue-50 to-indigo-50";

  return (
    <div
      className={`rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-gradient-to-br ${bg}`}
    >
      <div className="px-5 py-3.5 border-b bg-white/60 backdrop-blur-sm">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">{title} Photo</h3>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/80">
            {status}
          </span>
        </div>
      </div>

      <div className="aspect-[4/3] relative bg-gray-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${title} capture`}
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
            <ImageOff size={48} strokeWidth={1.5} />
            <p className="mt-3 text-sm">No photo available</p>
          </div>
        )}
      </div>

      <div className="p-4 text-sm text-gray-600 bg-white/60 backdrop-blur-sm">
        <div className="flex items-center gap-1.5 mb-1">
          <Clock size={14} />
          {new Date(time).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin size={14} />
          {/* <span className="font-mono text-xs">
            {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
          </span> */}
          <span className="font-mono text-xs">
            {location
              ? `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`
              : "Location not available"}
          </span>
        </div>
      </div>
    </div>
  );
}
