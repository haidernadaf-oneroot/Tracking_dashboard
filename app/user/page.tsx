// "use client";

// import { useEffect, useState } from "react";

// export default function UsersPage() {
//   const [users, setUsers] = useState<any[]>([]);
//   const API = process.env.NEXT_PUBLIC_API_URL!;

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const token = localStorage.getItem("token");

//         const res = await fetch(`${API}/api/users`, {
//           headers: { Authorization: `Bearer ${token}` },
//           cache: "no-store",
//         });

//         const data = await res.json();

//         // ✅ SUPPORT BOTH RESPONSE TYPES
//         if (Array.isArray(data)) {
//           setUsers(data);
//         } else if (Array.isArray(data.users)) {
//           setUsers(data.users);
//         } else {
//           console.error("Unexpected users response:", data);
//           setUsers([]);
//         }
//       } catch (e) {
//         console.error("User fetch error:", e);
//       }
//     };

//     load();
//   }, []);

//   return (
//     <div>
//       <h1 className="text-xl font-bold mb-4">Users</h1>

//       <table className="w-full bg-white rounded shadow">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="p-3 text-left">Name</th>
//             <th className="p-3 text-left">Phone</th>
//             <th className="p-3 text-left">Role</th>
//           </tr>
//         </thead>

//         <tbody>
//           {users.map((u) => (
//             <tr key={u._id} className="border-t">
//               <td className="p-3">{u.name}</td>
//               <td className="p-3">{u.phone}</td>
//               <td className="p-3 capitalize">{u.role}</td>
//               <td className="p-3">
//                 <a
//                   href={`/tracking/history/${u._id}`}
//                   className="text-blue-600 underline"
//                 >
//                   View History
//                 </a>
//               </td>
//             </tr>
//           ))}

//           {users.length === 0 && (
//             <tr>
//               <td colSpan={3} className="p-4 text-center text-gray-500">
//                 No users found
//               </td>
//             </tr>
//           )}
//           <td className="p-3">
//             <a
//               href={`/tracking/history/${u._id}`}
//               className="text-blue-600 underline"
//             >
//               View History
//             </a>
//           </td>
//         </tbody>
//       </table>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";

// export default function UsersPage() {
//   const [users, setUsers] = useState<any[]>([]);
//   const API = process.env.NEXT_PUBLIC_API_URL!;

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const token = localStorage.getItem("token");

//         const res = await fetch(`${API}/api/users`, {
//           headers: { Authorization: `Bearer ${token}` },
//           cache: "no-store",
//         });

//         const data = await res.json();

//         // ✅ SUPPORT BOTH RESPONSE TYPES
//         if (Array.isArray(data)) {
//           setUsers(data);
//         } else if (Array.isArray(data.users)) {
//           setUsers(data.users);
//         } else {
//           console.error("Unexpected users response:", data);
//           setUsers([]);
//         }
//       } catch (e) {
//         console.error("User fetch error:", e);
//       }
//     };

//     load();
//   }, []);

//   return (
//     <div>
//       <h1 className="text-xl font-bold mb-4">Users</h1>

//       <table className="w-full bg-white rounded shadow">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="p-3 text-left">Name</th>
//             <th className="p-3 text-left">Phone</th>
//             <th className="p-3 text-left">Role</th>
//             {/* <th className="p-3 text-left">Tracking</th> */}
//           </tr>
//         </thead>

//         <tbody>
//           {users.map((u) => (
//             <tr key={u._id} className="border-t">
//               <td className="p-3">{u.name}</td>
//               <td className="p-3">{u.phone}</td>
//               <td className="p-3 capitalize">{u.role}</td>
//             </tr>
//           ))}

//           {users.length === 0 && (
//             <tr>
//               <td colSpan={4} className="p-4 text-center text-gray-500">
//                 No users found
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import { Search, RefreshCw, AlertCircle, Loader2 } from "lucide-react";

// const API = process.env.NEXT_PUBLIC_API_URL!;

// type User = {
//   _id: string;
//   name: string;
//   phone: string;
//   role: string;
//   createdAt: string;
// };

// export default function UsersPage() {
//   const [users, setUsers] = useState<User[]>([]);
//   const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [search, setSearch] = useState("");

//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const token = localStorage.getItem("token");
//       if (!token) {
//         setError("Authentication token not found");
//         return;
//       }

//       const res = await fetch(`${API}/api/users`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         cache: "no-store",
//       });

//       if (!res.ok) throw new Error(`HTTP ${res.status}`);

//       const data = await res.json();

//       let userList: User[] = [];

//       if (Array.isArray(data)) {
//         userList = data;
//       } else if (Array.isArray(data.users)) {
//         userList = data.users;
//       }

//       setUsers(userList);
//       setFilteredUsers(userList);
//     } catch (err) {
//       console.error("Users fetch error:", err);
//       setError("Failed to load users list");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   // Filter when search changes
//   useEffect(() => {
//     const term = search.toLowerCase().trim();
//     if (!term) {
//       setFilteredUsers(users);
//       return;
//     }

//     const results = users.filter(
//       (u) => u.name?.toLowerCase().includes(term) || u.phone?.includes(term),
//     );

//     setFilteredUsers(results);
//   }, [search, users]);

//   const formatDate = (isoString: string) => {
//     if (!isoString) return "—";
//     return new Date(isoString).toLocaleString("en-IN", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gray-50/70 pb-12">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
//         {/* Header + Controls */}
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
//           <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
//             <svg
//               className="h-8 w-8 text-indigo-600"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
//               />
//             </svg>
//             All Users
//           </h1>

//           <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
//             <div className="relative flex-1 min-w-[280px]">
//               <input
//                 type="text"
//                 placeholder="Search by name or phone..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm"
//               />
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
//             </div>

//             <button
//               onClick={fetchUsers}
//               disabled={loading}
//               className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-60 transition shadow-sm whitespace-nowrap"
//             >
//               {loading ? (
//                 <Loader2 className="h-4 w-4 animate-spin" />
//               ) : (
//                 <RefreshCw className="h-4 w-4" />
//               )}
//               Refresh
//             </button>
//           </div>
//         </div>

//         {/* Loading / Error / Empty States */}
//         {loading && (
//           <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
//             <div className="p-12 text-center">
//               <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-4" />
//               <p className="text-gray-600">Loading users...</p>
//             </div>
//           </div>
//         )}

//         {error && !loading && (
//           <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
//             <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
//             <h3 className="text-lg font-medium text-red-800 mb-2">{error}</h3>
//             <button
//               onClick={fetchUsers}
//               className="mt-4 px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
//             >
//               Try Again
//             </button>
//           </div>
//         )}

//         {!loading && !error && filteredUsers.length === 0 && (
//           <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
//             <UserCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-xl font-semibold text-gray-700 mb-2">
//               {search ? "No matching users" : "No users found"}
//             </h3>
//             <p className="text-gray-500">
//               {search
//                 ? "Try a different search term"
//                 : "No users registered yet"}
//             </p>
//           </div>
//         )}

//         {/* Main Table */}
//         {!loading && !error && filteredUsers.length > 0 && (
//           <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="w-full min-w-[600px]">
//                 <thead className="bg-gray-50 border-b">
//                   <tr>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Name
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Phone
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Role
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Created At
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100">
//                   {filteredUsers.map((user) => (
//                     <tr
//                       key={user._id}
//                       className="hover:bg-indigo-50/30 transition-colors"
//                     >
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="font-medium text-gray-900">
//                           {user.name || "—"}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap font-mono text-gray-600">
//                         {user.phone || "—"}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize bg-gray-100 text-gray-800">
//                           {user.role?.replace("_", " ") || "unknown"}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-gray-600">
//                         {formatDate(user.createdAt)}
//                       </td>
//                     </tr>
//                   ))}
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
import {
  Search,
  RefreshCw,
  AlertCircle,
  Loader2,
  UserCircle,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL!;

type User = {
  _id: string;
  name: string;
  phone: string;
  role: string;
  createdAt: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      // ✅ NO TOKEN, NO AUTH HEADER
      const res = await fetch(`${API}/api/users`, {
        cache: "no-store",
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      let userList: User[] = [];

      if (Array.isArray(data)) {
        userList = data;
      } else if (Array.isArray(data.users)) {
        userList = data.users;
      }

      setUsers(userList);
      setFilteredUsers(userList);
    } catch (err) {
      console.error("Users fetch error:", err);
      setError("Failed to load users list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter when search changes
  useEffect(() => {
    const term = search.toLowerCase().trim();
    if (!term) {
      setFilteredUsers(users);
      return;
    }

    const results = users.filter(
      (u) => u.name?.toLowerCase().includes(term) || u.phone?.includes(term),
    );

    setFilteredUsers(results);
  }, [search, users]);

  const formatDate = (isoString: string) => {
    if (!isoString) return "—";
    return new Date(isoString).toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50/70 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header + Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <UserCircle className="h-8 w-8 text-purple-600" />
            All Users
          </h1>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative flex-1 min-w-[280px]">
              <input
                type="text"
                placeholder="Search by name or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition shadow-sm text-black"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>

            <button
              onClick={fetchUsers}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-60 transition shadow-sm whitespace-nowrap text-black"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Refresh
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading users...</p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-800 mb-2">{error}</h3>
            <button
              onClick={fetchUsers}
              className="mt-4 px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filteredUsers.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
            <UserCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {search ? "No matching users" : "No users found"}
            </h3>
            <p className="text-gray-500">
              {search
                ? "Try a different search term"
                : "No users registered yet"}
            </p>
          </div>
        )}

        {/* Table */}
        {!loading && !error && filteredUsers.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-indigo-50/30 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                        {user.name || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-gray-600">
                        {user.phone || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap capitalize">
                        <span className="px-2.5 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800">
                          {user.role?.replace("_", " ") || "unknown"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {formatDate(user.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
