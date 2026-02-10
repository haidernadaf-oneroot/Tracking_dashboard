// "use client";

// import { useEffect, useState } from "react";
// import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

// type LiveUser = {
//   sessionId: string;
//   lat: number;
//   lng: number;
//   time: string;
//   user: {
//     _id: string;
//     name: string;
//     phone: string;
//   };
// };

// export default function TrackingDashboard() {
//   const [users, setUsers] = useState<LiveUser[]>([]);
//   const [selected, setSelected] = useState<LiveUser | null>(null);

//   const API = process.env.NEXT_PUBLIC_API_URL!;

//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
//   });

//   const loadLiveUsers = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const res = await fetch(`${API}/api/tracking/live`, {
//         headers: {
//           Authorization: token ? `Bearer ${token}` : "",
//         },
//         cache: "no-store",
//       });

//       const data = await res.json();
//       setUsers(data);
//     } catch (err) {
//       console.error("Live tracking error:", err);
//     }
//   };

//   useEffect(() => {
//     loadLiveUsers();
//     const timer = setInterval(loadLiveUsers, 10000); // refresh every 10 sec
//     return () => clearInterval(timer);
//   }, []);

//   const center = selected
//     ? { lat: selected.lat, lng: selected.lng }
//     : users[0]
//       ? { lat: users[0].lat, lng: users[0].lng }
//       : { lat: 12.9716, lng: 77.5946 }; // default Bangalore

//   return (
//     <div className="flex h-[calc(100vh-64px)]">
//       {/* LEFT USER LIST */}
//       <div className="w-80 border-r bg-white overflow-y-auto">
//         <h2 className="p-4 font-semibold text-lg border-b">Live Field Users</h2>

//         {users.map((u) => (
//           <button
//             key={u.sessionId}
//             onClick={() => setSelected(u)}
//             className={`w-full text-left px-4 py-3 border-b hover:bg-gray-100 ${
//               selected?.sessionId === u.sessionId ? "bg-gray-100" : ""
//             }`}
//           >
//             <div className="font-medium">{u.user.name}</div>
//             <div className="text-sm text-gray-500">{u.user.phone}</div>
//           </button>
//         ))}

//         {users.length === 0 && (
//           <p className="p-4 text-gray-500">No active tracking users</p>
//         )}
//       </div>

//       {/* MAP */}
//       <div className="flex-1">
//         {isLoaded && (
//           <GoogleMap
//             mapContainerStyle={{ width: "100%", height: "100%" }}
//             center={center}
//             zoom={14}
//           >
//             {users.map((u) => (
//               <Marker
//                 key={u.sessionId}
//                 position={{ lat: u.lat, lng: u.lng }}
//                 label={u.user.name}
//               />
//             ))}
//           </GoogleMap>
//         )}
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useRef, useState } from "react";
// import {
//   GoogleMap,
//   Marker,
//   Polyline,
//   useJsApiLoader,
// } from "@react-google-maps/api";

// type Point = { lat: number; lng: number };

// export default function TrackingPage() {
//   const API = process.env.NEXT_PUBLIC_API_URL!;
//   const [sessions, setSessions] = useState<any[]>([]);
//   const [route, setRoute] = useState<Point[]>([]);
//   const [selected, setSelected] = useState<any>(null);

//   const mapRef = useRef<google.maps.Map | null>(null);

//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
//   });

//   // ✅ LOAD ACTIVE + COMPLETED TODAY
//   useEffect(() => {
//     const load = async () => {
//       const res = await fetch(`${API}/api/tracking/today`);
//       const data = await res.json();
//       setSessions(Array.isArray(data) ? data : []);
//     };
//     load();
//   }, []);

//   // ✅ LOAD ROUTE
//   const loadRoute = async (sessionId: string) => {
//     const res = await fetch(`${API}/api/tracking/route/${sessionId}`);
//     const data = await res.json();

//     const path = data.map((p: any) => ({ lat: p.lat, lng: p.lng }));
//     setRoute(path);

//     if (mapRef.current && path.length) {
//       const bounds = new google.maps.LatLngBounds();
//       path.forEach((p) => bounds.extend(p));
//       mapRef.current.fitBounds(bounds);
//     }
//   };

//   return (
//     <div className="flex gap-6 h-[calc(100vh-100px)]">
//       {/* LEFT — USERS */}
//       <div className="w-96 bg-white rounded shadow overflow-y-auto">
//         <h2 className="p-4 font-semibold border-b">Tracking Sessions</h2>

//         {sessions.map((s) => (
//           <button
//             key={s._id}
//             onClick={() => {
//               setSelected(s);
//               loadRoute(s._id);
//             }}
//             className={`w-full text-left px-4 py-3 border-b hover:bg-gray-100 ${
//               selected?._id === s._id ? "bg-gray-100" : ""
//             }`}
//           >
//             <div className="font-medium">{s.user?.name || "User"}</div>
//             <div className="text-sm text-gray-500">
//               {new Date(s.start.time).toLocaleTimeString()} →{" "}
//               {s.end ? new Date(s.end.time).toLocaleTimeString() : "Traveling"}
//             </div>
//             <div
//               className={`text-xs mt-1 ${
//                 s.status === "completed" ? "text-green-600" : "text-blue-600"
//               }`}
//             >
//               {s.status}
//             </div>
//           </button>
//         ))}

//         {sessions.length === 0 && (
//           <p className="p-4 text-gray-500">No tracking today</p>
//         )}
//       </div>

//       {/* RIGHT — MAP */}
//       <div className="flex-1 bg-white rounded shadow overflow-hidden">
//         {isLoaded && (
//           <GoogleMap
//             onLoad={(map) => (mapRef.current = map)}
//             mapContainerStyle={{ width: "100%", height: "100%" }}
//             center={{ lat: 12.9716, lng: 77.5946 }}
//             zoom={13}
//           >
//             {route.length > 0 && (
//               <>
//                 <Polyline
//                   path={route}
//                   options={{ strokeColor: "#2563eb", strokeWeight: 4 }}
//                 />
//                 <Marker position={route[0]} label="S" />
//                 <Marker position={route[route.length - 1]} label="E" />
//               </>
//             )}
//           </GoogleMap>
//         )}
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import TrackingMap from "@/components/TrackingMap";

// export default function TrackingDashboard() {
//   const [records, setRecords] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [activeIndex, setActiveIndex] = useState(0);

//   const fetchTodayTracking = async () => {
//     try {
//       setLoading(true);

//       const res = await fetch("http://localhost:5000/api/tracking/today");
//       const data = await res.json();

//       setRecords(data || []);
//     } catch (e) {
//       alert("Failed to load tracking");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTodayTracking(); // ✅ AUTO LOAD TODAY
//   }, []);

//   const active = records[activeIndex];

//   return (
//     <div className="p-6 space-y-4">
//       <h1 className="text-2xl font-bold">Today Field Tracking</h1>

//       {loading && <p>Loading...</p>}

//       {/* USER TABS */}
//       <div className="flex gap-2 overflow-x-auto">
//         {records.map((r, i) => (
//           <button
//             key={i}
//             onClick={() => setActiveIndex(i)}
//             className={`px-4 py-2 rounded ${
//               i === activeIndex ? "bg-green-600 text-white" : "bg-gray-200"
//             }`}
//           >
//             {r.user?.name || "User"} ({r.points.length})
//           </button>
//         ))}
//       </div>

//       {/* MAP */}
//       {active?.points?.length > 0 && <TrackingMap points={active.points} />}

//       {/* TABLE */}
//       {active?.points?.length > 0 && (
//         <table className="w-full border text-sm mt-4">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="border p-2">Time</th>
//               <th className="border p-2">Lat</th>
//               <th className="border p-2">Lng</th>
//               <th className="border p-2">Accuracy</th>
//             </tr>
//           </thead>
//           <tbody>
//             {active.points.map((p: any, i: number) => (
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

//       {!loading && records.length === 0 && <p>No users tracked today.</p>}
//     </div>
//   );
// }"
//

// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// const API = process.env.NEXT_PUBLIC_API_URL!;

// export default function TrackingUsersPage() {
//   const [users, setUsers] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const fetchTodayUsers = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch(`${API}/api/tracking/today`);
//       if (!res.ok) throw new Error("API error");

//       const data = await res.json();
//       setUsers(data || []);
//     } catch (err) {
//       console.error("USER FETCH ERROR:", err);
//       alert("Failed to load users");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTodayUsers();
//   }, []);

//   return (
//     <div className="p-6 space-y-4">
//       <h1 className="text-2xl font-bold">Today Field Users</h1>

//       {loading && <p>Loading...</p>}

//       <table className="w-full border text-sm">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="border p-2">Name</th>
//             <th className="border p-2">Phone</th>
//             <th className="border p-2">Status</th>
//             <th className="border p-2">Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.map((u, i) => (
//             <tr key={i}>
//               <td className="border p-2">{u.user?.name || "-"}</td>
//               <td className="border p-2">{u.user?.phone || "-"}</td>
//               <td className="border p-2">
//                 {u.session?.endTime ? "Completed" : "Running"}
//               </td>
//               <td className="border p-2">
//                 <button
//                   onClick={() => router.push(`/tracking/${u.user._id}`)}
//                   className="bg-green-600  px-3 py-1 rounded"
//                 >
//                   View Tracking
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {!loading && users.length === 0 && (
//         <p className="text-center">No users tracked today</p>
//       )}
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   Users,
//   MapPin,
//   Clock,
//   CheckCircle2,
//   AlertCircle,
//   ArrowRight,
//   RefreshCw,
// } from "lucide-react";

// const API = process.env.NEXT_PUBLIC_API_URL!;

// type UserTrackingEntry = {
//   user: {
//     _id: string;
//     name: string;
//     phone: string;
//   };
//   session?: {
//     endTime?: string;
//     // ... other session fields if needed
//   };
// };

// export default function TrackingUsersPage() {
//   const [users, setUsers] = useState<UserTrackingEntry[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();

//   const fetchTodayUsers = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const res = await fetch(`${API}/api/tracking/today`, {
//         cache: "no-store",
//       });

//       if (!res.ok) throw new Error("Failed to fetch today's tracking");

//       const data = await res.json();
//       setUsers(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error("FETCH TODAY USERS ERROR:", err);
//       setError("Failed to load today's field users");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTodayUsers();
//   }, []);

//   const refresh = () => fetchTodayUsers();

//   return (
//     <div className="min-h-screen bg-gray-50/70">
//       <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
//           <div>
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
//               <Users className="h-8 w-8 text-blue-600" />
//               Today's Field Users
//             </h1>
//             <p className="mt-1.5 text-gray-600">
//               Active tracking sessions — {new Date().toLocaleDateString()}
//             </p>
//           </div>

//           <button
//             onClick={refresh}
//             disabled={loading}
//             className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition"
//           >
//             <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
//             Refresh
//           </button>
//         </div>

//         {/* Loading / Error / Empty states */}
//         {loading && (
//           <div className="space-y-4">
//             {[...Array(5)].map((_, i) => (
//               <div
//                 key={i}
//                 className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 animate-pulse"
//               >
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-4">
//                     <div className="h-12 w-12 bg-gray-200 rounded-full" />
//                     <div className="space-y-2">
//                       <div className="h-5 w-40 bg-gray-200 rounded" />
//                       <div className="h-4 w-28 bg-gray-200 rounded" />
//                     </div>
//                   </div>
//                   <div className="h-9 w-32 bg-gray-200 rounded-lg" />
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {error && !loading && (
//           <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
//             <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
//             <p className="text-red-800 font-medium">{error}</p>
//             <button
//               onClick={refresh}
//               className="mt-4 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
//             >
//               Try Again
//             </button>
//           </div>
//         )}

//         {!loading && !error && users.length === 0 && (
//           <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
//             <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//             <h3 className="text-xl font-semibold text-gray-700 mb-2">
//               No field activity today
//             </h3>
//             <p className="text-gray-500 max-w-md mx-auto">
//               No users have started tracking sessions yet today.
//             </p>
//           </div>
//         )}

//         {/* User Cards */}
//         {!loading && !error && users.length > 0 && (
//           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//             {users.map((entry) => {
//               const isActive = !entry.session?.endTime;
//               const statusColor = isActive
//                 ? "bg-emerald-100 text-emerald-800"
//                 : "bg-gray-100 text-gray-700";
//               const statusText = isActive ? "Active" : "Completed";

//               return (
//                 <div
//                   key={entry.user._id}
//                   className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group"
//                 >
//                   <div className="p-5">
//                     <div className="flex items-start justify-between gap-4">
//                       <div className="flex items-center gap-4">
//                         <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium text-lg">
//                           {entry.user.name?.[0]?.toUpperCase() || "?"}
//                         </div>

//                         <div>
//                           <h3 className="font-semibold text-gray-900">
//                             {entry.user.name || "Unknown"}
//                           </h3>
//                           <p className="text-sm text-gray-600 font-mono">
//                             {entry.user.phone || "—"}
//                           </p>
//                         </div>
//                       </div>

//                       <span
//                         className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}
//                       >
//                         {statusText}
//                       </span>
//                     </div>

//                     {isActive && (
//                       <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600 flex items-center gap-1.5">
//                         <Clock size={14} />
//                         Started •{" "}
//                         {new Date().toLocaleTimeString([], {
//                           hour: "2-digit",
//                           minute: "2-digit",
//                         })}
//                       </div>
//                     )}
//                   </div>

//                   <div className="px-5 py-4 bg-gray-50/70 border-t border-gray-100">
//                     <button
//                       onClick={() => router.push(`/tracking/${entry.user._id}`)}
//                       className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
//                     >
//                       View Tracking Details
//                       <ArrowRight size={16} />
//                     </button>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   Users,
//   MapPin,
//   Clock,
//   AlertCircle,
//   ArrowRight,
//   RefreshCw,
// } from "lucide-react";

// const API = process.env.NEXT_PUBLIC_API_URL!;

// type TrackingRow = {
//   sessionId: string;
//   user: {
//     _id: string;
//     name: string;
//     phone: string;
//   };
//   date: string;
//   startTime: string;
//   endTime: string | null;
// };

// export default function TrackingUsersPage() {
//   const [users, setUsers] = useState<TrackingRow[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();

//   const fetchHistory = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const res = await fetch(`${API}/api/tracking/history`, {
//         cache: "no-store",
//       });

//       if (!res.ok) throw new Error("Failed to fetch tracking history");

//       const data = await res.json();
//       setUsers(Array.isArray(data.records) ? data.records : []);
//     } catch (err) {
//       console.error("FETCH HISTORY ERROR:", err);
//       setError("Failed to load tracking history");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchHistory();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-50/70">
//       <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
//           <div>
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
//               <Users className="h-8 w-8 text-blue-600" />
//               Field Tracking History
//             </h1>
//             <p className="mt-1.5 text-gray-600">
//               All users — all tracking sessions
//             </p>
//           </div>

//           <button
//             onClick={fetchHistory}
//             disabled={loading}
//             className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition"
//           >
//             <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
//             Refresh
//           </button>
//         </div>

//         {/* Loading */}
//         {loading && (
//           <div className="space-y-4">
//             {[...Array(6)].map((_, i) => (
//               <div
//                 key={i}
//                 className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 animate-pulse"
//               >
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-4">
//                     <div className="h-12 w-12 bg-gray-200 rounded-full" />
//                     <div className="space-y-2">
//                       <div className="h-5 w-40 bg-gray-200 rounded" />
//                       <div className="h-4 w-28 bg-gray-200 rounded" />
//                     </div>
//                   </div>
//                   <div className="h-9 w-32 bg-gray-200 rounded-lg" />
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Error */}
//         {error && !loading && (
//           <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
//             <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
//             <p className="text-red-800 font-medium">{error}</p>
//             <button
//               onClick={fetchHistory}
//               className="mt-4 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
//             >
//               Try Again
//             </button>
//           </div>
//         )}

//         {/* Cards */}
//         {!loading && !error && users.length > 0 && (
//           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//             {users.map((entry) => {
//               const isActive = !entry.endTime;

//               return (
//                 <div
//                   key={entry.sessionId}
//                   className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition"
//                 >
//                   <div className="p-5">
//                     <div className="flex items-start justify-between gap-4">
//                       <div className="flex items-center gap-4">
//                         <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-lg">
//                           {entry.user.name?.[0]?.toUpperCase() || "?"}
//                         </div>

//                         <div>
//                           <h3 className="font-semibold text-gray-900">
//                             {entry.user.name}
//                           </h3>
//                           <p className="text-sm text-gray-600 font-mono">
//                             {entry.user.phone}
//                           </p>
//                         </div>
//                       </div>

//                       <span
//                         className={`px-3 py-1 rounded-full text-xs font-medium ${
//                           isActive
//                             ? "bg-emerald-100 text-emerald-800"
//                             : "bg-gray-100 text-gray-700"
//                         }`}
//                       >
//                         {isActive ? "Active" : "Completed"}
//                       </span>
//                     </div>

//                     <div className="mt-4 text-sm text-gray-600 flex items-center gap-2">
//                       <Clock size={14} />
//                       {new Date(entry.startTime).toLocaleString("en-IN", {
//                         dateStyle: "medium",
//                         timeStyle: "short",
//                       })}
//                     </div>
//                   </div>

//                   <div className="px-5 py-4 bg-gray-50 border-t">
//                     <button
//                       onClick={() =>
//                         router.push(
//                           `/tracking/${entry.user._id}?date=${entry.date}`,
//                         )
//                       }
//                       className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium"
//                     >
//                       View Tracking
//                       <ArrowRight size={16} />
//                     </button>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {!loading && !error && users.length === 0 && (
//           <div className="text-center py-16 bg-white border border-dashed rounded-xl text-gray-500">
//             No tracking history found.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   Users,
//   Clock,
//   MapPin,
//   AlertCircle,
//   RefreshCw,
//   Loader2,
//   ArrowRight,
// } from "lucide-react";

// const API = process.env.NEXT_PUBLIC_API_URL!;

// type TrackingRow = {
//   sessionId: string;
//   user: {
//     _id: string;
//     name: string;
//     phone: string;
//   };
//   date: string;
//   startTime: string;
//   endTime: string | null;
// };

// export default function TrackingUsersPage() {
//   const [users, setUsers] = useState<TrackingRow[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();

//   const fetchHistory = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const res = await fetch(`${API}/api/tracking/history`, {
//         cache: "no-store",
//       });

//       if (!res.ok) throw new Error("Failed to fetch tracking history");

//       const data = await res.json();
//       setUsers(Array.isArray(data.records) ? data.records : []);
//     } catch (err) {
//       console.error("FETCH HISTORY ERROR:", err);
//       setError("Failed to load tracking history");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchHistory();
//   }, []);

//   const formatTime = (iso?: string) => {
//     if (!iso) return "—";
//     return new Date(iso).toLocaleString("en-IN", {
//       dateStyle: "medium",
//       timeStyle: "short",
//       hour12: true,
//     });
//   };

//   const isActive = (endTime: string | null) => !endTime;

//   return (
//     <div className="min-h-screen bg-gray-50/70 pb-12">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
//           <div className="flex items-center gap-3">
//             <Users className="h-8 w-8 text-indigo-600" />
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//               Field Tracking History
//             </h1>
//           </div>

//           <button
//             onClick={fetchHistory}
//             disabled={loading}
//             className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-60 transition shadow-sm whitespace-nowrap"
//           >
//             {loading ? (
//               <Loader2 className="h-4 w-4 animate-spin" />
//             ) : (
//               <RefreshCw className="h-4 w-4" />
//             )}
//             Refresh
//           </button>
//         </div>

//         {/* Loading */}
//         {loading && (
//           <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
//             <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mx-auto mb-4" />
//             <p className="text-gray-600">Loading tracking history...</p>
//           </div>
//         )}

//         {/* Error */}
//         {error && !loading && (
//           <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
//             <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
//             <h3 className="text-lg font-medium text-red-800 mb-2">{error}</h3>
//             <button
//               onClick={fetchHistory}
//               className="mt-4 px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
//             >
//               Try Again
//             </button>
//           </div>
//         )}

//         {/* Empty State */}
//         {!loading && !error && users.length === 0 && (
//           <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
//             <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//             <h3 className="text-xl font-semibold text-gray-700 mb-2">
//               No tracking history found
//             </h3>
//             <p className="text-gray-500">
//               No users have any recorded tracking sessions.
//             </p>
//           </div>
//         )}

//         {/* Table */}
//         {!loading && !error && users.length > 0 && (
//           <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="w-full min-w-[900px]">
//                 <thead className="bg-gray-50 border-b">
//                   <tr>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       User Name
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Phone
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Date
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Start Time
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Action
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100">
//                   {users.map((entry) => {
//                     const active = isActive(entry.endTime);

//                     return (
//                       <tr
//                         key={entry.sessionId}
//                         className="hover:bg-indigo-50/30 transition-colors"
//                       >
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="font-medium text-gray-900">
//                             {entry.user.name || "Unknown"}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap font-mono text-gray-600">
//                           {entry.user.phone || "—"}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-gray-600">
//                           {entry.date || "—"}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-gray-600">
//                           {entry.startTime
//                             ? new Date(entry.startTime).toLocaleTimeString(
//                                 "en-IN",
//                                 {
//                                   hour: "2-digit",
//                                   minute: "2-digit",
//                                   hour12: true,
//                                 },
//                               )
//                             : "—"}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span
//                             className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
//                               active
//                                 ? "bg-emerald-100 text-emerald-800"
//                                 : "bg-gray-100 text-gray-700"
//                             }`}
//                           >
//                             {active ? "Active" : "Completed"}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-right">
//                           <button
//                             onClick={() =>
//                               router.push(
//                                 `/tracking/${entry.user._id}?date=${entry.date}`,
//                               )
//                             }
//                             className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
//                           >
//                             View Tracking
//                             <ArrowRight size={14} />
//                           </button>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  MapPin,
  AlertCircle,
  RefreshCw,
  Loader2,
  ArrowRight,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL!;

type TrackingRow = {
  sessionId: string;
  user: {
    _id: string;
    name: string;
    phone: string;
  } | null;
  date: string;
  startTime: string;
  endTime: string | null;
};

export default function TrackingUsersPage() {
  const [rows, setRows] = useState<TrackingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API}/api/tracking/history`, {
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Failed to fetch tracking history");

      const data = await res.json();

      // ✅ support both array & { records: [] }
      const list: TrackingRow[] = Array.isArray(data)
        ? data
        : Array.isArray(data.records)
          ? data.records
          : [];

      setRows(list);
    } catch (err) {
      console.error("FETCH HISTORY ERROR:", err);
      setError("Failed to load tracking history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const isActive = (endTime: string | null) => !endTime;

  const formatDate = (date?: string) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-IN");
  };

  const formatTime = (iso?: string | null) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50/70 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-purple-600" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Field Tracking History
            </h1>
          </div>

          <button
            onClick={fetchHistory}
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-60 transition shadow-sm"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-xl border p-12 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading tracking history...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && rows.length === 0 && (
          <div className="bg-white rounded-xl border p-12 text-center">
            <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No tracking history found</p>
          </div>
        )}

        {/* Table */}
        {!loading && !error && rows.length > 0 && (
          <div className="bg-white rounded-xl border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Phone
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Start
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Ended
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {rows.map((entry) => {
                    const active = isActive(entry.endTime);

                    return (
                      <tr
                        key={entry.sessionId}
                        className="hover:bg-indigo-50/30"
                      >
                        <td className="px-6 py-4 font-medium">
                          {entry.user?.name || "Unknown"}
                        </td>
                        <td className="px-6 py-4 font-mono text-gray-600">
                          {entry.user?.phone || "—"}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {formatDate(entry.date)}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {formatTime(entry.startTime)}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {formatTime(entry.endTime)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              active
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {active ? "Active" : "Completed"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {entry.user?._id && (
                            <button
                              onClick={() =>
                                // router.push(
                                //   `/tracking/${entry.user!._id}?date=${entry.date}`,
                                // )
                                router.push(
                                  `/tracking/session/${entry.sessionId}`,
                                )
                              }
                              className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-800"
                            >
                              View
                              <ArrowRight size={14} />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
