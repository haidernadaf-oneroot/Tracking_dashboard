// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";

// const API = process.env.NEXT_PUBLIC_API_URL!;

// export default function DashboardPage() {
//   const [rows, setRows] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const res = await fetch(`${API}/api/dashboard/loads`, {
//           cache: "no-store",
//         });

//         const data = await res.json();

//         if (Array.isArray(data)) {
//           setRows(data);
//         } else {
//           console.error("Unexpected dashboard response:", data);
//           setRows([]);
//         }
//       } catch (e) {
//         console.error("Dashboard error:", e);
//         setRows([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     load();
//   }, []);

//   return (
//     <div className="p-6">
//       <h1 className="text-xl font-bold mb-4">Today Field Activity</h1>

//       <table className="w-full border bg-white rounded shadow">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="p-3 text-left">User</th>
//             <th className="p-3 text-center">Visited</th>
//             <th className="p-3 text-center">Load</th>
//             <th className="p-3 text-center">Action</th>
//           </tr>
//         </thead>

//         <tbody>
//           {loading && (
//             <tr>
//               <td colSpan={4} className="p-4 text-center">
//                 Loading...
//               </td>
//             </tr>
//           )}

//           {!loading &&
//             rows.map((r, i) => (
//               <tr key={r.visit?._id || i} className="border-t">
//                 <td className="p-3">
//                   <div className="font-medium">{r.user?.name || "-"}</div>
//                   <div className="text-sm text-gray-500">{r.user?.phone}</div>
//                 </td>

//                 <td className="p-3 text-center">{r.visit ? "Yes" : "No"}</td>

//                 <td className="p-3 text-center">{r.hasLoad ? "Yes" : "No"}</td>

//                 {/* ✅ PASS VISIT ID */}
//                 <td className="p-3 text-center">
//                   {r.visit?._id ? (
//                     <Link
//                       href={`/dashboard/view/${r.visit._id}`}
//                       className="text-blue-600 hover:underline"
//                     >
//                       View
//                     </Link>
//                   ) : (
//                     "-"
//                   )}
//                 </td>
//               </tr>
//             ))}

//           {!loading && rows.length === 0 && (
//             <tr>
//               <td colSpan={4} className="p-4 text-center text-gray-500">
//                 No activity today
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// // }
// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import {
//   Users,
//   MapPinCheck,
//   Package,
//   ArrowRight,
//   RefreshCw,
//   AlertCircle,
// } from "lucide-react";

// const API = process.env.NEXT_PUBLIC_API_URL!;

// type DashboardRow = {
//   user: {
//     name: string;
//     phone: string;
//   };
//   visit?: {
//     _id: string;
//     // ... other visit fields
//   };
//   hasLoad: boolean;
// };

// export default function DashboardPage() {
//   const [rows, setRows] = useState<DashboardRow[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchDashboard = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const res = await fetch(`${API}/api/dashboard/loads`, {
//         cache: "no-store",
//       });

//       if (!res.ok) throw new Error("Failed to load dashboard data");

//       const data = await res.json();

//       if (Array.isArray(data)) {
//         setRows(data);
//       } else {
//         setRows([]);
//       }
//     } catch (err) {
//       console.error("Dashboard fetch error:", err);
//       setError("Couldn't load today's activity");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDashboard();
//   }, []);

//   const refresh = () => fetchDashboard();

//   return (
//     <div className="min-h-screen bg-gray-50/60">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header + Refresh */}
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
//           <div>
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
//               <Users className="h-8 w-8 text-indigo-600" />
//               Today's Field Activity
//             </h1>
//             <p className="mt-1.5 text-gray-600">
//               {new Date().toLocaleDateString("en-IN", {
//                 weekday: "long",
//                 year: "numeric",
//                 month: "long",
//                 day: "numeric",
//               })}
//             </p>
//           </div>

//           <button
//             onClick={refresh}
//             disabled={loading}
//             className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-60 transition shadow-sm"
//           >
//             <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
//             Refresh
//           </button>
//         </div>

//         {/* Loading Skeleton */}
//         {loading && (
//           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
//                       <div className="h-4 w-32 bg-gray-200 rounded" />
//                     </div>
//                   </div>
//                   <div className="h-9 w-24 bg-gray-200 rounded-lg" />
//                 </div>
//                 <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4">
//                   <div className="h-5 bg-gray-200 rounded" />
//                   <div className="h-5 bg-gray-200 rounded" />
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Error State */}
//         {error && !loading && (
//           <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
//             <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
//             <h3 className="text-lg font-medium text-red-800 mb-2">{error}</h3>
//             <button
//               onClick={refresh}
//               className="mt-4 px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
//             >
//               Try Again
//             </button>
//           </div>
//         )}

//         {/* Empty State */}
//         {!loading && !error && rows.length === 0 && (
//           <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
//             <MapPinCheck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//             <h3 className="text-xl font-semibold text-gray-700 mb-2">
//               No field activity today
//             </h3>
//             <p className="text-gray-500 max-w-md mx-auto">
//               No users have recorded visits or loads yet today.
//             </p>
//           </div>
//         )}

//         {/* Cards Grid */}
//         {!loading && !error && rows.length > 0 && (
//           <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//             {rows.map((row, index) => {
//               const hasVisit = !!row.visit?._id;
//               const hasLoad = row.hasLoad;

//               return (
//                 <div
//                   key={row.visit?._id || `row-${index}`}
//                   className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group"
//                 >
//                   <div className="p-5">
//                     <div className="flex items-start justify-between gap-4">
//                       <div className="flex items-center gap-3.5">
//                         <div className="h-11 w-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium text-lg">
//                           {row.user?.name?.[0]?.toUpperCase() || "?"}
//                         </div>

//                         <div>
//                           <h3 className="font-semibold text-gray-900 truncate max-w-[180px]">
//                             {row.user?.name || "Unknown"}
//                           </h3>
//                           <p className="text-sm text-gray-600 font-mono tracking-tight">
//                             {row.user?.phone || "—"}
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4 text-sm">
//                       <div className="flex flex-col items-center text-center">
//                         <div
//                           className={`font-medium ${hasVisit ? "text-emerald-700" : "text-gray-500"}`}
//                         >
//                           {hasVisit ? "Visited" : "Not visited"}
//                         </div>
//                         <div className="mt-1">
//                           {hasVisit ? (
//                             <MapPinCheck
//                               size={20}
//                               className="text-emerald-600"
//                             />
//                           ) : (
//                             <MapPinCheck size={20} className="text-gray-300" />
//                           )}
//                         </div>
//                       </div>

//                       <div className="flex flex-col items-center text-center">
//                         <div
//                           className={`font-medium ${hasLoad ? "text-blue-700" : "text-gray-500"}`}
//                         >
//                           {hasLoad ? "Loaded" : "No load"}
//                         </div>
//                         <div className="mt-1">
//                           {hasLoad ? (
//                             <Package size={20} className="text-blue-600" />
//                           ) : (
//                             <Package size={20} className="text-gray-300" />
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="px-5 py-4 bg-gray-50/70 border-t border-gray-100">
//                     {hasVisit ? (
//                       <Link
//                         href={`/dashboard/view/${row.visit._id}`}
//                         className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
//                       >
//                         View Details
//                         <ArrowRight size={16} />
//                       </Link>
//                     ) : (
//                       <button
//                         disabled
//                         className="w-full flex items-center justify-center gap-2 bg-gray-300 text-gray-500 px-5 py-2.5 rounded-lg font-medium cursor-not-allowed"
//                       >
//                         No Visit Data
//                       </button>
//                     )}
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

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  MapPinCheck,
  Package,
  RefreshCw,
  AlertCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL!;

type DashboardRow = {
  user: {
    name: string;
    phone: string;
  };
  visit?: {
    _id: string;
    createdAt: string; // ✅ add this
  };
  hasLoad: boolean;
};

export default function DashboardPage() {
  const [rows, setRows] = useState<DashboardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API}/api/dashboard/loads`, {
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Failed to load dashboard data");

      const data = await res.json();

      if (Array.isArray(data)) {
        setRows(data);
      } else {
        setRows([]);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Couldn't load today's activity");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50/70 pb-12">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header + Refresh */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-purple-600" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Today's Field Activity
            </h1>
          </div>

          <button
            onClick={fetchDashboard}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-60 transition shadow-sm whitespace-nowrap"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading today's activity...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-800 mb-2">{error}</h3>
            <button
              onClick={fetchDashboard}
              className="mt-4 px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && rows.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
            <MapPinCheck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No activity today
            </h3>
            <p className="text-gray-500">
              No users have recorded visits or loads yet today.
            </p>
          </div>
        )}

        {/* Main Table */}
        {!loading && !error && rows.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      User Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Visited
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Visit Date
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Has Load
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rows.map((row, index) => {
                    const hasVisit = !!row.visit?._id;
                    const hasLoad = row.hasLoad;

                    return (
                      <tr
                        key={row.visit?._id || `row-${index}`}
                        className="hover:bg-indigo-50/30 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">
                            {row.user?.name || "Unknown"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-mono text-gray-600">
                          {row.user?.phone || "—"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              hasVisit
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {hasVisit ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {hasVisit ? formatDate(row.visit?.createdAt) : "—"}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              hasLoad
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {hasLoad ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {hasVisit ? (
                            <Link
                              href={`/dashboard/view/${row.visit?._id}`}
                              className="inline-flex items-center gap-1.5 text-purple-600 hover:text-purple-800 font-medium transition-colors"
                            >
                              View Details
                              <ArrowRight size={14} />
                            </Link>
                          ) : (
                            <span className="text-gray-400 text-sm">
                              No visit
                            </span>
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
