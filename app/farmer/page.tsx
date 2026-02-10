// "use client";

// import { useEffect, useState } from "react";
// import {
//   Users,
//   RefreshCw,
//   AlertCircle,
//   Loader2,
//   Leaf,
//   Pencil,
//   X,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";

// /* ================= BASE URLS ================= */
// const API_BASE = "https://markhet-internal-ngfs.onrender.com";
// const API = process.env.NEXT_PUBLIC_API_URL!;

// /* ================= TYPES ================= */
// type Farmer = {
//   _id: string;
//   name: string;
//   phone: string;
//   cropType: string;
//   state: string;
//   district: string;
//   taluk: string;
//   village: string;
//   landSize?: number;
// };

// export default function FarmerDashboardPage() {
//   /* ================= DATA ================= */
//   const [farmers, setFarmers] = useState<Farmer[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   /* ================= PAGINATION ================= */
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const LIMIT = 10;
//   const PAGE_WINDOW = 5;

//   /* ================= FILTERS ================= */
//   const [cropType, setCropType] = useState("");
//   const [state, setState] = useState("");
//   const [district, setDistrict] = useState("");
//   const [taluk, setTaluk] = useState("");
//   const [village, setVillage] = useState("");

//   /* ================= LOCATION OPTIONS ================= */
//   const [states, setStates] = useState<string[]>([]);
//   const [districts, setDistricts] = useState<string[]>([]);
//   const [taluks, setTaluks] = useState<string[]>([]);
//   const [villages, setVillages] = useState<string[]>([]);

//   /* ================= EDIT MODAL ================= */
//   const [openEdit, setOpenEdit] = useState(false);
//   const [editFarmer, setEditFarmer] = useState<Farmer | null>(null);
//   const [savingEdit, setSavingEdit] = useState(false);

//   /* ================= LOCATION (FILTER) ================= */
//   useEffect(() => {
//     fetch(`${API_BASE}/newlocations/states`)
//       .then((r) => r.json())
//       .then((j) => setStates(j.data || []));
//   }, []);

//   useEffect(() => {
//     if (!state) return;
//     setDistrict("");
//     setTaluk("");
//     setVillage("");
//     setDistricts([]);
//     setTaluks([]);
//     setVillages([]);

//     fetch(`${API_BASE}/newlocations/districts?state=${state}`)
//       .then((r) => r.json())
//       .then((j) => setDistricts(j.data || []));
//   }, [state]);

//   useEffect(() => {
//     if (!district) return;
//     setTaluk("");
//     setVillage("");
//     setTaluks([]);
//     setVillages([]);

//     fetch(`${API_BASE}/newlocations/taluks?state=${state}&district=${district}`)
//       .then((r) => r.json())
//       .then((j) => setTaluks(j.data || []));
//   }, [district]);

//   useEffect(() => {
//     if (!taluk) return;
//     setVillage("");
//     setVillages([]);

//     fetch(
//       `${API_BASE}/newlocations/villages?state=${state}&district=${district}&taluk=${taluk}`,
//     )
//       .then((r) => r.json())
//       .then((j) => setVillages(j.data || []));
//   }, [taluk]);

//   /* ================= FETCH FARMERS ================= */
//   const fetchFarmers = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const params = new URLSearchParams({
//         page: String(page),
//         limit: String(LIMIT),
//         cropType,
//         state,
//         district,
//         taluk,
//         village,
//       });

//       const res = await fetch(`${API}/api/farmer?${params}`, {
//         cache: "no-store",
//       });

//       if (!res.ok) throw new Error();

//       const data = await res.json();
//       setFarmers(data.data || []);
//       setTotalPages(data.totalPages || 1);
//     } catch {
//       setError("Could not load farmers");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchFarmers();
//   }, [page, cropType, state, district, taluk, village]);

//   const resetPage = () => setPage(1);

//   /* ================= PAGINATION RANGE ================= */
//   const startPage = Math.floor((page - 1) / PAGE_WINDOW) * PAGE_WINDOW + 1;

//   const endPage = Math.min(startPage + PAGE_WINDOW - 1, totalPages);

//   /* ================= UI ================= */
//   return (
//     <div className="min-h-screen bg-gray-50/70 pb-12">
//       <div className="max-w-8xl mx-auto px-4 pt-8 space-y-6">
//         {/* HEADER */}
//         <div className="flex justify-between items-center">
//           <div className="flex items-center gap-3">
//             <Users className="h-8 w-8 text-emerald-600" />
//             <h1 className="text-2xl font-bold">Farmers</h1>
//           </div>

//           <button
//             onClick={fetchFarmers}
//             className="flex items-center gap-2 px-5 py-2.5 bg-white border rounded-lg"
//           >
//             <RefreshCw className="h-4 w-4" />
//             Refresh
//           </button>
//         </div>

//         {/* FILTERS */}
//         <div className="bg-white border rounded-xl p-4 grid grid-cols-2 md:grid-cols-6 gap-4">
//           <select
//             className="border p-2"
//             value={cropType}
//             onChange={(e) => {
//               resetPage();
//               setCropType(e.target.value);
//             }}
//           >
//             <option value="">All Crops</option>
//             <option>Banana</option>
//             <option>Dry Coconut</option>
//             <option>Tender Coconut</option>
//             <option>Turmeric</option>
//           </select>

//           <select
//             className="border p-2"
//             value={state}
//             onChange={(e) => {
//               resetPage();
//               setState(e.target.value);
//             }}
//           >
//             <option value="">All States</option>
//             {states.map((s) => (
//               <option key={s}>{s}</option>
//             ))}
//           </select>

//           <select
//             className="border p-2"
//             value={district}
//             disabled={!state}
//             onChange={(e) => {
//               resetPage();
//               setDistrict(e.target.value);
//             }}
//           >
//             <option value="">All Districts</option>
//             {districts.map((d) => (
//               <option key={d}>{d}</option>
//             ))}
//           </select>

//           <select
//             className="border p-2"
//             value={taluk}
//             disabled={!district}
//             onChange={(e) => {
//               resetPage();
//               setTaluk(e.target.value);
//             }}
//           >
//             <option value="">All Taluks</option>
//             {taluks.map((t) => (
//               <option key={t}>{t}</option>
//             ))}
//           </select>

//           <select
//             className="border p-2"
//             value={village}
//             disabled={!taluk}
//             onChange={(e) => {
//               resetPage();
//               setVillage(e.target.value);
//             }}
//           >
//             <option value="">All Villages</option>
//             {villages.map((v) => (
//               <option key={v}>{v}</option>
//             ))}
//           </select>
//         </div>

//         {/* TABLE */}
//         {!loading && farmers.length > 0 && (
//           <div className="bg-white border rounded-xl overflow-x-auto">
//             <table className="w-full min-w-[1000px]">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-4 text-left">Name</th>
//                   <th className="px-6 py-4 text-left">Phone</th>
//                   <th className="px-6 py-4 text-left">Crop</th>
//                   <th className="px-6 py-4 text-left">Location</th>
//                   <th className="px-6 py-4 text-left">Land</th>
//                   <th className="px-6 py-4 text-left">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {farmers.map((f) => (
//                   <tr key={f._id} className="border-t">
//                     <td className="px-6 py-4">{f.name}</td>
//                     <td className="px-6 py-4">{f.phone}</td>
//                     <td className="px-6 py-4">{f.cropType}</td>
//                     <td className="px-6 py-4">
//                       {f.village}, {f.taluk}, {f.district}
//                     </td>
//                     <td className="px-6 py-4">{f.landSize ?? "—"}</td>
//                     <td className="px-6 py-4">
//                       <button
//                         onClick={() => {
//                           setEditFarmer({ ...f });
//                           setOpenEdit(true);
//                         }}
//                         className="flex items-center gap-1 text-emerald-700"
//                       >
//                         <Pencil size={14} /> Edit
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {/* NUMBER PAGINATION */}
//         {!loading && totalPages > 1 && (
//           <div className="flex justify-center items-center gap-2 mt-4">
//             <button
//               disabled={startPage === 1}
//               onClick={() => setPage(startPage - 1)}
//               className="p-2 border rounded disabled:opacity-40"
//             >
//               <ChevronLeft size={16} />
//             </button>

//             {Array.from({ length: endPage - startPage + 1 }).map((_, i) => {
//               const p = startPage + i;
//               return (
//                 <button
//                   key={p}
//                   onClick={() => setPage(p)}
//                   className={`px-3 py-1 border rounded ${
//                     p === page
//                       ? "bg-emerald-600 text-white border-emerald-600"
//                       : "bg-white"
//                   }`}
//                 >
//                   {p}
//                 </button>
//               );
//             })}

//             <button
//               disabled={endPage === totalPages}
//               onClick={() => setPage(endPage + 1)}
//               className="p-2 border rounded disabled:opacity-40"
//             >
//               <ChevronRight size={16} />
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import {
//   Users,
//   RefreshCw,
//   AlertCircle,
//   Loader2,
//   Pencil,
//   X,
//   ChevronLeft,
//   ChevronRight,
//   Save,
//   Image as ImageIcon,
// } from "lucide-react";

// /* ================= BASE URLS ================= */
// const API_BASE = "https://markhet-internal-ngfs.onrender.com";
// const API = process.env.NEXT_PUBLIC_API_URL!;

// /* ================= TYPES ================= */
// type Farmer = {
//   _id: string;
//   name: string;
//   phone: string;
//   cropType: string;
//   state: string;
//   district: string;
//   taluk: string;
//   village: string;
//   landSize?: number;
//   cropCost?: number | null;
//   inputSupplier?: string;
//   additionalInfo?: string;
//   paymentType?: "credit" | "cash" | string;
//   droneSprayingConsent?: boolean;
//   agronomistCareConsent?: boolean;
//   photo?: string; // Cloudinary or other public URL
//   createdAt?: string;
//   updatedAt?: string;
// };

// export default function FarmerDashboardPage() {
//   const [farmers, setFarmers] = useState<Farmer[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Pagination
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const LIMIT = 10;
//   const PAGE_WINDOW = 5;

//   // Filters
//   const [cropType, setCropType] = useState("");
//   const [state, setState] = useState("");
//   const [district, setDistrict] = useState("");
//   const [taluk, setTaluk] = useState("");
//   const [village, setVillage] = useState("");

//   // Location dropdown options
//   const [states, setStates] = useState<string[]>([]);
//   const [districts, setDistricts] = useState<string[]>([]);
//   const [taluks, setTaluks] = useState<string[]>([]);
//   const [villages, setVillages] = useState<string[]>([]);

//   // Edit modal
//   const [openEdit, setOpenEdit] = useState(false);
//   const [editFarmer, setEditFarmer] = useState<Farmer | null>(null);
//   const [savingEdit, setSavingEdit] = useState(false);
//   const [editForm, setEditForm] = useState<Partial<Farmer>>({});

//   // Photo preview modal
//   const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

//   /* ================= LOCATION FILTER DROPDOWNS ================= */
//   useEffect(() => {
//     fetch(`${API_BASE}/newlocations/states`)
//       .then((r) => r.json())
//       .then((j) => setStates(j.data || []));
//   }, []);

//   useEffect(() => {
//     if (!state) return;
//     setDistrict("");
//     setTaluk("");
//     setVillage("");
//     setDistricts([]);
//     setTaluks([]);
//     setVillages([]);

//     fetch(`${API_BASE}/newlocations/districts?state=${state}`)
//       .then((r) => r.json())
//       .then((j) => setDistricts(j.data || []));
//   }, [state]);

//   useEffect(() => {
//     if (!district) return;
//     setTaluk("");
//     setVillage("");
//     setTaluks([]);
//     setVillages([]);

//     fetch(`${API_BASE}/newlocations/taluks?state=${state}&district=${district}`)
//       .then((r) => r.json())
//       .then((j) => setTaluks(j.data || []));
//   }, [district]);

//   useEffect(() => {
//     if (!taluk) return;
//     setVillage("");
//     setVillages([]);

//     fetch(
//       `${API_BASE}/newlocations/villages?state=${state}&district=${district}&taluk=${taluk}`,
//     )
//       .then((r) => r.json())
//       .then((j) => setVillages(j.data || []));
//   }, [taluk]);

//   /* ================= FETCH FARMERS ================= */
//   const fetchFarmers = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const params = new URLSearchParams({
//         page: String(page),
//         limit: String(LIMIT),
//         cropType,
//         state,
//         district,
//         taluk,
//         village,
//       });

//       const res = await fetch(`${API}/api/farmer?${params}`, {
//         cache: "no-store",
//       });

//       if (!res.ok) throw new Error("Failed to fetch farmers");

//       const data = await res.json();
//       setFarmers(data.data || []);
//       setTotalPages(data.totalPages || 1);
//     } catch {
//       setError("Could not load farmers");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchFarmers();
//   }, [page, cropType, state, district, taluk, village]);

//   const resetPage = () => setPage(1);

//   /* ================= PAGINATION RANGE ================= */
//   const startPage = Math.floor((page - 1) / PAGE_WINDOW) * PAGE_WINDOW + 1;
//   const endPage = Math.min(startPage + PAGE_WINDOW - 1, totalPages);

//   /* ================= EDIT MODAL HANDLERS ================= */
//   const openEditModal = (farmer: Farmer) => {
//     setEditFarmer(farmer);
//     setEditForm({ ...farmer });
//     setOpenEdit(true);
//   };

//   const handleFormChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
//   ) => {
//     const { name, value } = e.target;
//     setEditForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleBooleanChange = (name: keyof Farmer, checked: boolean) => {
//     setEditForm((prev) => ({ ...prev, [name]: checked }));
//   };

//   const saveEdit = async () => {
//     if (!editFarmer) return;

//     try {
//       setSavingEdit(true);
//       const res = await fetch(`${API}/api/farmer/${editFarmer._id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(editForm),
//       });

//       if (!res.ok) throw new Error("Failed to update farmer");

//       await fetchFarmers();
//       setOpenEdit(false);
//     } catch (err) {
//       alert("Failed to save changes");
//       console.error(err);
//     } finally {
//       setSavingEdit(false);
//     }
//   };

//   /* ================= PHOTO PREVIEW ================= */
//   const openPhotoPreview = (url: string) => {
//     setPreviewPhoto(url);
//   };

//   const closePhotoPreview = () => {
//     setPreviewPhoto(null);
//   };

//   /* ================= RENDER ================= */
//   return (
//     <div className="min-h-screen bg-gray-50/70 pb-12">
//       <div className="max-w-8xl mx-auto px-4 pt-8 space-y-6">
//         {/* HEADER */}
//         <div className="flex justify-between items-center">
//           <div className="flex items-center gap-3">
//             <Users className="h-8 w-8 text-emerald-600" />
//             <h1 className="text-2xl font-bold">Farmers</h1>
//           </div>

//           <button
//             onClick={fetchFarmers}
//             className="flex items-center gap-2 px-5 py-2.5 bg-white border rounded-lg hover:bg-gray-50"
//           >
//             <RefreshCw className="h-4 w-4" />
//             Refresh
//           </button>
//         </div>

//         {/* FILTERS */}
//         <div className="bg-white border rounded-xl p-4 grid grid-cols-2 md:grid-cols-6 gap-4">
//           <select
//             className="border p-2 rounded"
//             value={cropType}
//             onChange={(e) => {
//               resetPage();
//               setCropType(e.target.value);
//             }}
//           >
//             <option value="">All Crops</option>
//             <option>Banana</option>
//             <option>Dry Coconut</option>
//             <option>Tender Coconut</option>
//             <option>Turmeric</option>
//             <option>Arecanut</option>
//             <option>Maize</option>
//             <option>Green chilli</option>
//             <option>Tomato</option>
//             <option>Cabbage</option>
//             <option>Cauliflower</option>
//             <option>Ginger</option>
//           </select>

//           <select
//             className="border p-2 rounded"
//             value={state}
//             onChange={(e) => {
//               resetPage();
//               setState(e.target.value);
//             }}
//           >
//             <option value="">All States</option>
//             {states.map((s) => (
//               <option key={s}>{s}</option>
//             ))}
//           </select>

//           <select
//             className="border p-2 rounded"
//             value={district}
//             disabled={!state}
//             onChange={(e) => {
//               resetPage();
//               setDistrict(e.target.value);
//             }}
//           >
//             <option value="">All Districts</option>
//             {districts.map((d) => (
//               <option key={d}>{d}</option>
//             ))}
//           </select>

//           <select
//             className="border p-2 rounded"
//             value={taluk}
//             disabled={!district}
//             onChange={(e) => {
//               resetPage();
//               setTaluk(e.target.value);
//             }}
//           >
//             <option value="">All Taluks</option>
//             {taluks.map((t) => (
//               <option key={t}>{t}</option>
//             ))}
//           </select>

//           <select
//             className="border p-2 rounded"
//             value={village}
//             disabled={!taluk}
//             onChange={(e) => {
//               resetPage();
//               setVillage(e.target.value);
//             }}
//           >
//             <option value="">All Villages</option>
//             {villages.map((v) => (
//               <option key={v}>{v}</option>
//             ))}
//           </select>
//         </div>

//         {/* TABLE */}
//         {loading ? (
//           <div className="bg-white border rounded-xl p-12 text-center">
//             <Loader2 className="h-8 w-8 animate-spin mx-auto text-emerald-600" />
//             <p className="mt-3 text-gray-500">Loading farmers...</p>
//           </div>
//         ) : error ? (
//           <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
//             <AlertCircle className="h-8 w-8 text-red-500 mx-auto" />
//             <p className="mt-3 text-red-700">{error}</p>
//           </div>
//         ) : farmers.length === 0 ? (
//           <div className="bg-white border rounded-xl p-12 text-center text-gray-500">
//             No farmers found matching the current filters.
//           </div>
//         ) : (
//           <div className="bg-white border rounded-xl overflow-x-auto shadow-sm">
//             <table className="w-full min-w-[1400px] text-sm">
//               <thead className="bg-gray-50 text-gray-700">
//                 <tr>
//                   <th className="px-5 py-3 text-left font-medium">Name</th>
//                   <th className="px-5 py-3 text-left font-medium">Phone</th>
//                   <th className="px-5 py-3 text-left font-medium">Crop</th>
//                   <th className="px-5 py-3 text-left font-medium">Location</th>
//                   <th className="px-5 py-3 text-left font-medium">
//                     Land (acres)
//                   </th>
//                   <th className="px-5 py-3 text-left font-medium">
//                     Input Supplier
//                   </th>
//                   <th className="px-5 py-3 text-left font-medium">
//                     Additional Info
//                   </th>
//                   <th className="px-5 py-3 text-left font-medium">Payment</th>
//                   <th className="px-5 py-3 text-left font-medium">
//                     Drone Consent
//                   </th>
//                   <th className="px-5 py-3 text-left font-medium">
//                     Agronomist Consent
//                   </th>
//                   <th className="px-5 py-3 text-left font-medium">Photo</th>
//                   <th className="px-5 py-3 text-left font-medium">Action</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y">
//                 {farmers.map((f) => (
//                   <tr key={f._id} className="hover:bg-gray-50/60">
//                     <td className="px-5 py-3">{f.name || "—"}</td>
//                     <td className="px-5 py-3 font-mono">{f.phone || "—"}</td>
//                     <td className="px-5 py-3">{f.cropType || "—"}</td>
//                     <td className="px-5 py-3">
//                       {f.village ? `${f.village}, ` : ""}
//                       {f.taluk ? `${f.taluk}, ` : ""}
//                       {f.district || "—"}
//                     </td>
//                     <td className="px-5 py-3">{f.landSize ?? "—"}</td>
//                     <td className="px-5 py-3">{f.inputSupplier || "—"}</td>
//                     <td className="px-5 py-3">{f.additionalInfo || "—"}</td>
//                     <td className="px-5 py-3 capitalize">
//                       {f.paymentType || "—"}
//                     </td>
//                     <td className="px-5 py-3">
//                       {f.droneSprayingConsent ? (
//                         <span className="text-green-600 font-medium">Yes</span>
//                       ) : (
//                         <span className="text-gray-400">No</span>
//                       )}
//                     </td>
//                     <td className="px-5 py-3">
//                       {f.agronomistCareConsent ? (
//                         <span className="text-green-600 font-medium">Yes</span>
//                       ) : (
//                         <span className="text-gray-400">No</span>
//                       )}
//                     </td>

//                     {/* Photo column */}
//                     <td className="px-5 py-3">
//                       {f.photo ? (
//                         <button
//                           onClick={() => openPhotoPreview(f.photo!)}
//                           className="block w-12 h-12 rounded-md overflow-hidden border border-gray-200 hover:border-emerald-500 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400"
//                         >
//                           <img
//                             src={f.photo}
//                             alt={`${f.name} photo`}
//                             className="w-full h-full object-cover"
//                             loading="lazy"
//                           />
//                         </button>
//                       ) : (
//                         <span className="text-gray-400 text-xs">—</span>
//                       )}
//                     </td>

//                     <td className="px-5 py-3">
//                       <button
//                         onClick={() => openEditModal(f)}
//                         className="flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 text-sm"
//                       >
//                         <Pencil size={14} /> Edit
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {/* PAGINATION */}
//         {!loading && totalPages > 1 && (
//           <div className="flex justify-center items-center gap-2 mt-6">
//             <button
//               disabled={startPage === 1}
//               onClick={() => setPage(startPage - 1)}
//               className="p-2 border rounded disabled:opacity-40 hover:bg-gray-100"
//             >
//               <ChevronLeft size={16} />
//             </button>

//             {Array.from({ length: endPage - startPage + 1 }).map((_, i) => {
//               const p = startPage + i;
//               return (
//                 <button
//                   key={p}
//                   onClick={() => setPage(p)}
//                   className={`px-3 py-1.5 border rounded text-sm font-medium ${
//                     p === page
//                       ? "bg-emerald-600 text-white border-emerald-600"
//                       : "bg-white hover:bg-gray-50"
//                   }`}
//                 >
//                   {p}
//                 </button>
//               );
//             })}

//             <button
//               disabled={endPage === totalPages}
//               onClick={() => setPage(endPage + 1)}
//               className="p-2 border rounded disabled:opacity-40 hover:bg-gray-100"
//             >
//               <ChevronRight size={16} />
//             </button>
//           </div>
//         )}
//       </div>

//       {/* ================= EDIT MODAL ================= */}
//       {openEdit && editFarmer && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
//               <h2 className="text-xl font-bold text-gray-800">Edit Farmer</h2>
//               <button
//                 onClick={() => setOpenEdit(false)}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 <X size={24} />
//               </button>
//             </div>

//             <div className="p-6 space-y-6">
//               {editForm.photo && (
//                 <div className="flex flex-col items-center gap-2">
//                   <div className="w-32 h-32 rounded-lg overflow-hidden border bg-gray-50">
//                     <img
//                       src={editForm.photo}
//                       alt="Farmer photo"
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                   <p className="text-xs text-gray-500">Current photo</p>
//                 </div>
//               )}

//               {/* rest of edit form ... */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                 {/* name, phone, cropType, landSize, inputSupplier, paymentType, cropCost */}
//                 {/* ... same as before ... */}
//               </div>

//               <div className="bg-gray-50 p-4 rounded-lg space-y-3">
//                 {/* consents */}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Photo URL (optional)
//                 </label>
//                 <input
//                   type="text"
//                   name="photo"
//                   value={editForm.photo || ""}
//                   onChange={handleFormChange}
//                   placeholder="https://..."
//                   className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500"
//                 />
//               </div>
//             </div>

//             <div className="border-t px-6 py-4 flex justify-end gap-3 sticky bottom-0 bg-white">
//               <button
//                 onClick={() => setOpenEdit(false)}
//                 disabled={savingEdit}
//                 className="px-5 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={saveEdit}
//                 disabled={savingEdit}
//                 className="px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2"
//               >
//                 {savingEdit ? (
//                   <>
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                     Saving...
//                   </>
//                 ) : (
//                   <>
//                     <Save size={16} />
//                     Save Changes
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ================= PHOTO PREVIEW MODAL ================= */}
//       {previewPhoto && (
//         <div
//           className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
//           onClick={closePhotoPreview}
//         >
//           <div
//             className="relative max-w-4xl max-h-[90vh] bg-white rounded-xl overflow-hidden shadow-2xl"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               onClick={closePhotoPreview}
//               className="absolute top-3 right-3 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition z-10"
//             >
//               <X size={24} />
//             </button>

//             <img
//               src={previewPhoto}
//               alt="Farmer photo - full view"
//               className="max-w-full max-h-[90vh] object-contain"
//             />

//             <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-center py-2 text-sm">
//               Farmer photo
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import {
//   Users,
//   RefreshCw,
//   AlertCircle,
//   Loader2,
//   Pencil,
//   X,
//   ChevronLeft,
//   ChevronRight,
//   Save,
// } from "lucide-react";

// /* ================= CONFIG ================= */
// const API_BASE = "https://markhet-internal-ngfs.onrender.com";
// const API = process.env.NEXT_PUBLIC_API_URL!;

// /* ================= TYPES ================= */
// interface Crop {
//   name: string;
//   price?: string;
//   additionalInfo?: string;
// }

// interface Payment {
//   type?: "cash" | "credit";
//   additionalInfo?: string;
// }

// interface Consent {
//   value: boolean;
//   additionalInfo?: string;
// }

// interface Farmer {
//   _id: string;
//   name: string;
//   phone: string;
//   crops: Crop[];
//   state?: string;
//   district?: string;
//   taluk?: string;
//   village?: string;
//   landSize?: number;
//   inputSupplier?: string;
//   additionalInfo?: string;
//   payment?: Payment;
//   droneSprayingConsent?: Consent;
//   agronomistCareConsent?: Consent;
//   photo?: string;
//   createdAt: string;
//   updatedAt: string;
// }

// export default function FarmerDashboardPage() {
//   const [farmers, setFarmers] = useState<Farmer[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Pagination
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const LIMIT = 10;

//   // Filters
//   const [cropName, setCropName] = useState("");
//   const [stateFilter, setStateFilter] = useState("");
//   const [districtFilter, setDistrictFilter] = useState("");
//   const [talukFilter, setTalukFilter] = useState("");
//   const [villageFilter, setVillageFilter] = useState("");

//   // Location dropdowns
//   const [states, setStates] = useState<string[]>([]);
//   const [districts, setDistricts] = useState<string[]>([]);
//   const [taluks, setTaluks] = useState<string[]>([]);
//   const [villages, setVillages] = useState<string[]>([]);

//   // Edit modal
//   const [openEdit, setOpenEdit] = useState(false);
//   const [editFarmer, setEditFarmer] = useState<Farmer | null>(null);
//   const [savingEdit, setSavingEdit] = useState(false);
//   const [editForm, setEditForm] = useState<Partial<Farmer>>({});

//   // Photo preview
//   const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

//   /* ================= LOCATION DROPDOWNS ================= */
//   useEffect(() => {
//     fetch(`${API_BASE}/newlocations/states`)
//       .then((r) => r.json())
//       .then((j) => setStates(j.data || []))
//       .catch(() => {});
//   }, []);

//   useEffect(() => {
//     if (!stateFilter) {
//       setDistricts([]);
//       setDistrictFilter("");
//       setTaluks([]);
//       setTalukFilter("");
//       setVillages([]);
//       setVillageFilter("");
//       return;
//     }
//     fetch(
//       `${API_BASE}/newlocations/districts?state=${encodeURIComponent(stateFilter)}`,
//     )
//       .then((r) => r.json())
//       .then((j) => setDistricts(j.data || []));
//   }, [stateFilter]);

//   useEffect(() => {
//     if (!districtFilter || !stateFilter) return;
//     fetch(
//       `${API_BASE}/newlocations/taluks?state=${encodeURIComponent(stateFilter)}&district=${encodeURIComponent(districtFilter)}`,
//     )
//       .then((r) => r.json())
//       .then((j) => setTaluks(j.data || []));
//   }, [districtFilter, stateFilter]);

//   useEffect(() => {
//     if (!talukFilter || !districtFilter || !stateFilter) return;
//     fetch(
//       `${API_BASE}/newlocations/villages?state=${encodeURIComponent(stateFilter)}&district=${encodeURIComponent(districtFilter)}&taluk=${encodeURIComponent(talukFilter)}`,
//     )
//       .then((r) => r.json())
//       .then((j) => setVillages(j.data || []));
//   }, [talukFilter, districtFilter, stateFilter]);

//   /* ================= FETCH FARMERS ================= */
//   const fetchFarmers = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const params = new URLSearchParams({
//         page: page.toString(),
//         limit: LIMIT.toString(),
//         ...(cropName && { cropName }),
//         ...(stateFilter && { state: stateFilter }),
//         ...(districtFilter && { district: districtFilter }),
//         ...(talukFilter && { taluk: talukFilter }),
//         ...(villageFilter && { village: villageFilter }),
//       });

//       const url = `${API}/api/farmer?${params.toString()}`;
//       console.log("Fetching:", url);

//       const res = await fetch(url, { cache: "no-store" });

//       if (!res.ok) {
//         const err = await res.json().catch(() => ({}));
//         throw new Error(err.message || `HTTP ${res.status}`);
//       }

//       const data = await res.json();
//       setFarmers(data.data || []);
//       setTotalPages(data.pagination?.totalPages || 1);
//     } catch (err: any) {
//       console.error("Fetch error:", err);
//       setError(err.message || "Failed to load farmers");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchFarmers();
//   }, [page, cropName, stateFilter, districtFilter, talukFilter, villageFilter]);

//   const resetPage = () => setPage(1);

//   /* ================= EDIT MODAL ================= */
//   const openEditModal = (farmer: Farmer) => {
//     setEditFarmer(farmer);
//     setEditForm({ ...farmer });
//     setOpenEdit(true);
//   };

//   const handleEditChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
//     >,
//   ) => {
//     const { name, value } = e.target;
//     if (name.includes(".")) {
//       const [parent, child] = name.split(".");
//       setEditForm((prev) => ({
//         ...prev,
//         [parent]: { ...prev[parent as keyof typeof prev], [child]: value },
//       }));
//     } else {
//       setEditForm((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleBooleanChange = (
//     field: "droneSprayingConsent" | "agronomistCareConsent",
//     checked: boolean,
//   ) => {
//     setEditForm((prev) => ({
//       ...prev,
//       [field]: { ...prev[field], value: checked },
//     }));
//   };

//   const saveEdit = async () => {
//     if (!editFarmer) return;
//     setSavingEdit(true);

//     try {
//       const res = await fetch(`${API}/api/farmer/${editFarmer._id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(editForm),
//       });

//       if (!res.ok) {
//         const errData = await res.json();
//         throw new Error(errData.message || "Update failed");
//       }

//       await fetchFarmers();
//       setOpenEdit(false);
//     } catch (err: any) {
//       alert(err.message || "Failed to save");
//       console.error(err);
//     } finally {
//       setSavingEdit(false);
//     }
//   };

//   /* ================= PHOTO PREVIEW ================= */
//   const openPhotoPreview = (url: string) => setPreviewPhoto(url);
//   const closePhotoPreview = () => setPreviewPhoto(null);

//   /* ================= RENDER ================= */
//   return (
//     <div className="min-h-screen bg-gray-50/70 pb-12">
//       <div className="max-w-8xl mx-auto px-4 pt-8 space-y-6">
//         {/* Header */}
//         <div className="flex justify-between items-center">
//           <div className="flex items-center gap-3">
//             <Users className="h-8 w-8 text-emerald-600" />
//             <h1 className="text-2xl font-bold">Farmers Dashboard</h1>
//           </div>
//           <button
//             onClick={fetchFarmers}
//             className="flex items-center gap-2 px-5 py-2.5 bg-white border rounded-lg hover:bg-gray-50"
//           >
//             <RefreshCw className="h-4 w-4" />
//             Refresh
//           </button>
//         </div>

//         {/* Filters */}
//         <div className="bg-white border rounded-xl p-4 grid grid-cols-2 md:grid-cols-5 gap-4">
//           <select
//             className="border p-2.5 rounded-lg"
//             value={cropName}
//             onChange={(e) => {
//               resetPage();
//               setCropName(e.target.value);
//             }}
//           >
//             <option value="">All Crops</option>
//             {[
//               "Banana",
//               "Dry Coconut",
//               "Tender Coconut",
//               "Turmeric",
//               "Green Chilli",
//               "Arecanut",
//               "Tomato",
//               "Cabbage",
//               "Cauliflower",
//               "Ginger",
//             ].map((c) => (
//               <option key={c} value={c}>
//                 {c}
//               </option>
//             ))}
//           </select>

//           <select
//             className="border p-2.5 rounded-lg"
//             value={stateFilter}
//             onChange={(e) => {
//               resetPage();
//               setStateFilter(e.target.value);
//             }}
//           >
//             <option value="">All States</option>
//             {states.map((s) => (
//               <option key={s} value={s}>
//                 {s}
//               </option>
//             ))}
//           </select>

//           <select
//             className="border p-2.5 rounded-lg"
//             value={districtFilter}
//             disabled={!stateFilter}
//             onChange={(e) => {
//               resetPage();
//               setDistrictFilter(e.target.value);
//             }}
//           >
//             <option value="">All Districts</option>
//             {districts.map((d) => (
//               <option key={d} value={d}>
//                 {d}
//               </option>
//             ))}
//           </select>

//           <select
//             className="border p-2.5 rounded-lg"
//             value={talukFilter}
//             disabled={!districtFilter}
//             onChange={(e) => {
//               resetPage();
//               setTalukFilter(e.target.value);
//             }}
//           >
//             <option value="">All Taluks</option>
//             {taluks.map((t) => (
//               <option key={t} value={t}>
//                 {t}
//               </option>
//             ))}
//           </select>

//           <select
//             className="border p-2.5 rounded-lg"
//             value={villageFilter}
//             disabled={!talukFilter}
//             onChange={(e) => {
//               resetPage();
//               setVillageFilter(e.target.value);
//             }}
//           >
//             <option value="">All Villages</option>
//             {villages.map((v) => (
//               <option key={v} value={v}>
//                 {v}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Table */}
//         {loading ? (
//           <div className="bg-white border rounded-xl p-12 text-center">
//             <Loader2 className="h-8 w-8 animate-spin mx-auto text-emerald-600" />
//             <p className="mt-3 text-gray-500">Loading farmers...</p>
//           </div>
//         ) : error ? (
//           <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
//             <AlertCircle className="h-8 w-8 text-red-500 mx-auto" />
//             <p className="mt-3 text-red-700">{error}</p>
//           </div>
//         ) : farmers.length === 0 ? (
//           <div className="bg-white border rounded-xl p-12 text-center text-gray-500">
//             No farmers found.
//           </div>
//         ) : (
//           <div className="bg-white border rounded-xl overflow-x-auto shadow-sm">
//             <table className="w-full min-w-[1400px] text-sm">
//               <thead className="bg-gray-50 text-gray-700">
//                 <tr>
//                   <th className="px-5 py-3 text-left font-medium">Name</th>
//                   <th className="px-5 py-3 text-left font-medium">Phone</th>
//                   <th className="px-5 py-3 text-left font-medium">Crops</th>
//                   <th className="px-5 py-3 text-left font-medium">Location</th>
//                   <th className="px-5 py-3 text-left font-medium">
//                     Land (acres)
//                   </th>
//                   <th className="px-5 py-3 text-left font-medium">
//                     Input Supplier
//                   </th>
//                   <th className="px-5 py-3 text-left font-medium">Payment</th>
//                   <th className="px-5 py-3 text-left font-medium">
//                     Drone Consent
//                   </th>
//                   <th className="px-5 py-3 text-left font-medium">
//                     Agronomist Consent
//                   </th>
//                   <th className="px-5 py-3 text-left font-medium">Photo</th>
//                   <th className="px-5 py-3 text-left font-medium">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y">
//                 {farmers.map((f) => (
//                   <tr key={f._id} className="hover:bg-gray-50/60">
//                     <td className="px-5 py-3 font-medium">{f.name || "—"}</td>
//                     <td className="px-5 py-3 font-mono">{f.phone || "—"}</td>

//                     {/* Crops - name + price + additionalInfo */}
//                     <td className="px-5 py-3">
//                       {f.crops?.length ? (
//                         <div className="space-y-2 text-xs">
//                           {f.crops.map((c, idx) => (
//                             <div
//                               key={idx}
//                               className="border-l-2 border-gray-300 pl-2"
//                             >
//                               <div className="font-medium">{c.name}</div>
//                               {c.price && <div>Price: ₹{c.price}</div>}
//                               {c.additionalInfo && (
//                                 <div className="text-gray-600 italic">
//                                   {c.additionalInfo}
//                                 </div>
//                               )}
//                             </div>
//                           ))}
//                         </div>
//                       ) : (
//                         "—"
//                       )}
//                     </td>

//                     <td className="px-5 py-3">
//                       {[f.village, f.taluk, f.district, f.state]
//                         .filter(Boolean)
//                         .join(", ") || "—"}
//                     </td>
//                     <td className="px-5 py-3">{f.landSize ?? "—"}</td>
//                     <td className="px-5 py-3">{f.inputSupplier || "—"}</td>

//                     {/* Payment */}
//                     <td className="px-5 py-3 capitalize">
//                       {f.payment ? (
//                         <div>
//                           <div className="font-medium">
//                             {f.payment.type || "—"}
//                           </div>
//                           {f.payment.additionalInfo && (
//                             <div className="text-xs text-gray-600">
//                               {f.payment.additionalInfo}
//                             </div>
//                           )}
//                         </div>
//                       ) : (
//                         "—"
//                       )}
//                     </td>

//                     {/* Drone Consent */}
//                     <td className="px-5 py-3">
//                       {f.droneSprayingConsent ? (
//                         <div>
//                           <div>
//                             {f.droneSprayingConsent.value ? (
//                               <span className="text-green-600 font-medium">
//                                 Yes
//                               </span>
//                             ) : (
//                               <span className="text-red-600">No</span>
//                             )}
//                           </div>
//                           {f.droneSprayingConsent.additionalInfo && (
//                             <div className="text-xs text-gray-600 mt-1">
//                               {f.droneSprayingConsent.additionalInfo}
//                             </div>
//                           )}
//                         </div>
//                       ) : (
//                         "—"
//                       )}
//                     </td>

//                     {/* Agronomist Consent */}
//                     <td className="px-5 py-3">
//                       {f.agronomistCareConsent ? (
//                         <div>
//                           <div>
//                             {f.agronomistCareConsent.value ? (
//                               <span className="text-green-600 font-medium">
//                                 Yes
//                               </span>
//                             ) : (
//                               <span className="text-red-600">No</span>
//                             )}
//                           </div>
//                           {f.agronomistCareConsent.additionalInfo && (
//                             <div className="text-xs text-gray-600 mt-1">
//                               {f.agronomistCareConsent.additionalInfo}
//                             </div>
//                           )}
//                         </div>
//                       ) : (
//                         "—"
//                       )}
//                     </td>

//                     <td className="px-5 py-3">
//                       {f.photo ? (
//                         <button
//                           onClick={() => openPhotoPreview(f.photo)}
//                           className="block w-12 h-12 rounded-md overflow-hidden border border-gray-200 hover:border-emerald-500 transition-colors"
//                         >
//                           <img
//                             src={f.photo}
//                             alt="Farmer"
//                             className="w-full h-full object-cover"
//                             loading="lazy"
//                           />
//                         </button>
//                       ) : (
//                         "—"
//                       )}
//                     </td>

//                     <td className="px-5 py-3">
//                       <button
//                         onClick={() => openEditModal(f)}
//                         className="flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 text-sm"
//                       >
//                         <Pencil size={14} /> Edit
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {/* Pagination */}
//         {!loading && totalPages > 1 && (
//           <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
//             <button
//               disabled={page === 1}
//               onClick={() => setPage((p) => Math.max(1, p - 1))}
//               className="p-2 border rounded disabled:opacity-40 hover:bg-gray-100"
//             >
//               <ChevronLeft size={16} />
//             </button>

//             {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
//               const p = Math.max(1, page - 3 + i);
//               if (p > totalPages) return null;
//               return (
//                 <button
//                   key={p}
//                   onClick={() => setPage(p)}
//                   className={`px-3 py-1.5 border rounded text-sm font-medium min-w-[36px] ${
//                     p === page
//                       ? "bg-emerald-600 text-white border-emerald-600"
//                       : "bg-white hover:bg-gray-50"
//                   }`}
//                 >
//                   {p}
//                 </button>
//               );
//             })}

//             <button
//               disabled={page === totalPages}
//               onClick={() => setPage((p) => p + 1)}
//               className="p-2 border rounded disabled:opacity-40 hover:bg-gray-100"
//             >
//               <ChevronRight size={16} />
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Edit Modal */}
//       {openEdit && editFarmer && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
//               <h2 className="text-xl font-bold">Edit Farmer</h2>
//               <button onClick={() => setOpenEdit(false)}>
//                 <X size={24} className="text-gray-500 hover:text-gray-700" />
//               </button>
//             </div>

//             <div className="p-6 space-y-6">
//               {editForm.photo && (
//                 <div className="flex flex-col items-center gap-2">
//                   <img
//                     src={editForm.photo}
//                     alt="Farmer"
//                     className="w-32 h-32 object-cover rounded-lg border"
//                   />
//                   <p className="text-xs text-gray-500">Current photo</p>
//                 </div>
//               )}

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Name</label>
//                   <input
//                     name="name"
//                     value={editForm.name || ""}
//                     onChange={handleEditChange}
//                     className="w-full border rounded-lg px-3 py-2"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Phone
//                   </label>
//                   <input
//                     name="phone"
//                     value={editForm.phone || ""}
//                     onChange={handleEditChange}
//                     className="w-full border rounded-lg px-3 py-2"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Land Size (acres)
//                   </label>
//                   <input
//                     name="landSize"
//                     type="number"
//                     value={editForm.landSize ?? ""}
//                     onChange={handleEditChange}
//                     className="w-full border rounded-lg px-3 py-2"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Input Supplier
//                   </label>
//                   <input
//                     name="inputSupplier"
//                     value={editForm.inputSupplier || ""}
//                     onChange={handleEditChange}
//                     className="w-full border rounded-lg px-3 py-2"
//                   />
//                 </div>

//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium mb-1">
//                     Additional Info
//                   </label>
//                   <textarea
//                     name="additionalInfo"
//                     value={editForm.additionalInfo || ""}
//                     onChange={handleEditChange}
//                     className="w-full border rounded-lg px-3 py-2 min-h-[80px]"
//                   />
//                 </div>
//               </div>

//               {/* Payment & Consents */}
//               <div className="bg-gray-50 p-4 rounded-lg space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Payment Type
//                   </label>
//                   <select
//                     value={editForm.payment?.type || ""}
//                     onChange={(e) =>
//                       setEditForm((p) => ({
//                         ...p,
//                         payment: {
//                           ...p.payment,
//                           type: e.target.value as "cash" | "credit",
//                         },
//                       }))
//                     }
//                     className="w-full border rounded-lg px-3 py-2"
//                   >
//                     <option value="">Select</option>
//                     <option value="cash">Cash</option>
//                     <option value="credit">Credit</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Payment Additional Info
//                   </label>
//                   <input
//                     value={editForm.payment?.additionalInfo || ""}
//                     onChange={(e) =>
//                       setEditForm((p) => ({
//                         ...p,
//                         payment: {
//                           ...p.payment,
//                           additionalInfo: e.target.value,
//                         },
//                       }))
//                     }
//                     className="w-full border rounded-lg px-3 py-2"
//                   />
//                 </div>

//                 <div className="border-t pt-3">
//                   <label className="block text-sm font-medium mb-2">
//                     Drone Spraying Consent
//                   </label>
//                   <div className="flex items-center justify-between mb-2">
//                     <span>Consent given?</span>
//                     <input
//                       type="checkbox"
//                       checked={editForm.droneSprayingConsent?.value || false}
//                       onChange={(e) =>
//                         handleBooleanChange(
//                           "droneSprayingConsent",
//                           e.target.checked,
//                         )
//                       }
//                     />
//                   </div>
//                   <input
//                     placeholder="Additional notes / acres / date"
//                     value={editForm.droneSprayingConsent?.additionalInfo || ""}
//                     onChange={(e) =>
//                       setEditForm((p) => ({
//                         ...p,
//                         droneSprayingConsent: {
//                           ...p.droneSprayingConsent,
//                           additionalInfo: e.target.value,
//                         },
//                       }))
//                     }
//                     className="w-full border rounded-lg px-3 py-2 text-sm"
//                   />
//                 </div>

//                 <div className="border-t pt-3">
//                   <label className="block text-sm font-medium mb-2">
//                     Agronomist Care Consent
//                   </label>
//                   <div className="flex items-center justify-between mb-2">
//                     <span>Consent given?</span>
//                     <input
//                       type="checkbox"
//                       checked={editForm.agronomistCareConsent?.value || false}
//                       onChange={(e) =>
//                         handleBooleanChange(
//                           "agronomistCareConsent",
//                           e.target.checked,
//                         )
//                       }
//                     />
//                   </div>
//                   <input
//                     placeholder="Additional notes / agreement details"
//                     value={editForm.agronomistCareConsent?.additionalInfo || ""}
//                     onChange={(e) =>
//                       setEditForm((p) => ({
//                         ...p,
//                         agronomistCareConsent: {
//                           ...p.agronomistCareConsent,
//                           additionalInfo: e.target.value,
//                         },
//                       }))
//                     }
//                     className="w-full border rounded-lg px-3 py-2 text-sm"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="border-t px-6 py-4 flex justify-end gap-3 sticky bottom-0 bg-white">
//               <button
//                 onClick={() => setOpenEdit(false)}
//                 disabled={savingEdit}
//                 className="px-5 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={saveEdit}
//                 disabled={savingEdit}
//                 className="px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2"
//               >
//                 {savingEdit ? (
//                   <>
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                     Saving...
//                   </>
//                 ) : (
//                   <>
//                     <Save size={16} />
//                     Save Changes
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Photo Preview */}
//       {previewPhoto && (
//         <div
//           className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
//           onClick={closePhotoPreview}
//         >
//           <div
//             className="relative max-w-4xl max-h-[90vh] bg-white rounded-xl overflow-hidden shadow-2xl"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               onClick={closePhotoPreview}
//               className="absolute top-3 right-3 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
//             >
//               <X size={24} />
//             </button>
//             <img
//               src={previewPhoto}
//               alt="Farmer photo"
//               className="max-w-full max-h-[90vh] object-contain"
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import {
//   Users,
//   RefreshCw,
//   AlertCircle,
//   Loader2,
//   Pencil,
//   X,
//   ChevronLeft,
//   ChevronRight,
//   Save,
// } from "lucide-react";

// /* ================= CONFIG ================= */
// const API_BASE = "https://markhet-internal-ngfs.onrender.com";
// const API = process.env.NEXT_PUBLIC_API_URL!;

// /* ================= TYPES ================= */
// interface Crop {
//   name: string;
//   price?: string;
//   additionalInfo?: string;
// }

// interface Payment {
//   type?: "cash" | "credit";
//   additionalInfo?: string;
// }

// interface Consent {
//   value: boolean;
//   additionalInfo?: string;
// }

// interface Farmer {
//   _id: string;
//   name: string;
//   phone: string;
//   crops: Crop[];
//   additionalCrops?: string;
//   state?: string;
//   district?: string;
//   taluk?: string;
//   village?: string;
//   landSize?: number;
//   inputSupplier?: string;
//   additionalInfo?: string;
//   payment?: Payment;
//   droneSprayingConsent?: Consent;
//   agronomistCareConsent?: Consent;
//   photo?: string;
//   createdAt: string;
//   updatedAt: string;
// }

// export default function FarmerDashboardPage() {
//   const [farmers, setFarmers] = useState<Farmer[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Pagination
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const LIMIT = 10;

//   // Filters
//   const [cropName, setCropName] = useState("");
//   const [stateFilter, setStateFilter] = useState("");
//   const [districtFilter, setDistrictFilter] = useState("");
//   const [talukFilter, setTalukFilter] = useState("");
//   const [villageFilter, setVillageFilter] = useState("");

//   // Location dropdown data
//   const [states, setStates] = useState<string[]>([]);
//   const [districts, setDistricts] = useState<string[]>([]);
//   const [taluks, setTaluks] = useState<string[]>([]);
//   const [villages, setVillages] = useState<string[]>([]);

//   // Edit modal
//   const [openEdit, setOpenEdit] = useState(false);
//   const [editFarmer, setEditFarmer] = useState<Farmer | null>(null);
//   const [savingEdit, setSavingEdit] = useState(false);
//   const [editForm, setEditForm] = useState<Partial<Farmer>>({});

//   // Photo preview
//   const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

//   /* ================= LOCATION DROPDOWNS ================= */
//   useEffect(() => {
//     fetch(`${API_BASE}/newlocations/states`)
//       .then((r) => r.json())
//       .then((j) => setStates(j.data || []))
//       .catch((err) => console.error("States fetch failed", err));
//   }, []);

//   useEffect(() => {
//     if (!stateFilter) {
//       setDistricts([]);
//       setDistrictFilter("");
//       setTaluks([]);
//       setTalukFilter("");
//       setVillages([]);
//       setVillageFilter("");
//       return;
//     }
//     fetch(
//       `${API_BASE}/newlocations/districts?state=${encodeURIComponent(stateFilter)}`,
//     )
//       .then((r) => r.json())
//       .then((j) => setDistricts(j.data || []))
//       .catch((err) => console.error("Districts fetch failed", err));
//   }, [stateFilter]);

//   useEffect(() => {
//     if (!districtFilter || !stateFilter) return;
//     fetch(
//       `${API_BASE}/newlocations/taluks?state=${encodeURIComponent(stateFilter)}&district=${encodeURIComponent(districtFilter)}`,
//     )
//       .then((r) => r.json())
//       .then((j) => setTaluks(j.data || []))
//       .catch((err) => console.error("Taluks fetch failed", err));
//   }, [districtFilter, stateFilter]);

//   useEffect(() => {
//     if (!talukFilter || !districtFilter || !stateFilter) return;
//     fetch(
//       `${API_BASE}/newlocations/villages?state=${encodeURIComponent(stateFilter)}&district=${encodeURIComponent(districtFilter)}&taluk=${encodeURIComponent(talukFilter)}`,
//     )
//       .then((r) => r.json())
//       .then((j) => setVillages(j.data || []))
//       .catch((err) => console.error("Villages fetch failed", err));
//   }, [talukFilter, districtFilter, stateFilter]);

//   /* ================= FETCH FARMERS ================= */
//   const fetchFarmers = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const params = new URLSearchParams({
//         page: page.toString(),
//         limit: LIMIT.toString(),
//         ...(cropName && { cropName }),
//         ...(stateFilter && { state: stateFilter }),
//         ...(districtFilter && { district: districtFilter }),
//         ...(talukFilter && { taluk: talukFilter }),
//         ...(villageFilter && { village: villageFilter }),
//       });

//       const url = `${API}/api/farmer?${params.toString()}`;
//       console.log("Fetching farmers from:", url);

//       const res = await fetch(url, { cache: "no-store" });

//       if (!res.ok) {
//         const text = await res.text();
//         console.log("Response error:", text);
//         throw new Error(`HTTP ${res.status} - ${text.slice(0, 200)}`);
//       }

//       const data = await res.json();
//       setFarmers(data.data || []);
//       setTotalPages(data.pagination?.totalPages || 1);
//     } catch (err: any) {
//       console.error("Fetch farmers error:", err);
//       setError(err.message || "Failed to load farmers");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchFarmers();
//   }, [page, cropName, stateFilter, districtFilter, talukFilter, villageFilter]);

//   const resetPage = () => setPage(1);

//   /* ================= EDIT MODAL ================= */
//   const openEditModal = (farmer: Farmer) => {
//     setEditFarmer(farmer);
//     setEditForm({
//       ...farmer,
//       crops: farmer.crops?.length
//         ? [...farmer.crops]
//         : [{ name: "", price: "", additionalInfo: "" }],
//     });
//     setOpenEdit(true);
//   };

//   const addCropToEdit = () => {
//     setEditForm((prev) => ({
//       ...prev,
//       crops: [
//         ...(prev.crops || []),
//         { name: "", price: "", additionalInfo: "" },
//       ],
//     }));
//   };

//   const removeCropFromEdit = (index: number) => {
//     if ((editForm.crops?.length || 0) <= 1) return;
//     setEditForm((prev) => ({
//       ...prev,
//       crops: prev.crops?.filter((_, i) => i !== index) || [],
//     }));
//   };

//   const updateCropInEdit = (
//     index: number,
//     field: keyof Crop,
//     value: string,
//   ) => {
//     setEditForm((prev) => {
//       const newCrops = [...(prev.crops || [])];
//       newCrops[index] = { ...newCrops[index], [field]: value };
//       return { ...prev, crops: newCrops };
//     });
//   };

//   const handleEditChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
//     >,
//   ) => {
//     const { name, value } = e.target;
//     setEditForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleNestedChange = (
//     parent: keyof Farmer,
//     field: string,
//     value: any,
//   ) => {
//     setEditForm((prev) => ({
//       ...prev,
//       [parent]: {
//         ...(prev[parent] as any),
//         [field]: value,
//       },
//     }));
//   };

//   const saveEdit = async () => {
//     if (!editFarmer) return;
//     setSavingEdit(true);

//     try {
//       const payload = {
//         name: editForm.name?.trim(),
//         phone: editForm.phone?.trim().replace(/\D/g, ""),
//         crops: editForm.crops
//           ?.filter((c) => c.name.trim())
//           .map((c) => ({
//             name: c.name.trim(),
//             price: c.price?.trim() || undefined,
//             additionalInfo: c.additionalInfo?.trim() || undefined,
//           })),
//         additionalCrops: editForm.additionalCrops?.trim() || undefined,
//         state: editForm.state?.trim() || undefined,
//         district: editForm.district?.trim() || undefined,
//         taluk: editForm.taluk?.trim() || undefined,
//         village: editForm.village?.trim() || undefined,
//         landSize: editForm.landSize ? Number(editForm.landSize) : undefined,
//         inputSupplier: editForm.inputSupplier?.trim() || undefined,
//         additionalInfo: editForm.additionalInfo?.trim() || undefined,
//         payment: editForm.payment
//           ? {
//               type: editForm.payment.type,
//               additionalInfo:
//                 editForm.payment.additionalInfo?.trim() || undefined,
//             }
//           : undefined,
//         droneSprayingConsent: editForm.droneSprayingConsent
//           ? {
//               value: editForm.droneSprayingConsent.value,
//               additionalInfo:
//                 editForm.droneSprayingConsent.additionalInfo?.trim() ||
//                 undefined,
//             }
//           : undefined,
//         agronomistCareConsent: editForm.agronomistCareConsent
//           ? {
//               value: editForm.agronomistCareConsent.value,
//               additionalInfo:
//                 editForm.agronomistCareConsent.additionalInfo?.trim() ||
//                 undefined,
//             }
//           : undefined,
//       };

//       const url = `${API}/api/farmer/${editFarmer._id}`;
//       console.log("Sending PUT to:", url);

//       const res = await fetch(url, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const errText = await res.text();
//         console.error("PUT error response:", errText);
//         throw new Error(
//           `Update failed: ${res.status} - ${errText.slice(0, 200)}`,
//         );
//       }

//       const result = await res.json();
//       console.log("Update success:", result);

//       await fetchFarmers();
//       setOpenEdit(false);
//       alert("Farmer updated successfully!");
//     } catch (err: any) {
//       console.error("Save edit failed:", err);
//       alert(
//         err.message || "Failed to save changes. Check console for details.",
//       );
//     } finally {
//       setSavingEdit(false);
//     }
//   };

//   /* ================= PHOTO PREVIEW ================= */
//   const openPhotoPreview = (url?: string) => url && setPreviewPhoto(url);
//   const closePhotoPreview = () => setPreviewPhoto(null);

//   /* ================= RENDER ================= */
//   return (
//     <div className="min-h-screen bg-gray-50/70 pb-12">
//       <div className="max-w-8xl mx-auto px-4 pt-8 space-y-6">
//         {/* Header */}
//         <div className="flex justify-between items-center">
//           <div className="flex items-center gap-3">
//             <Users className="h-8 w-8 text-emerald-600" />
//             <h1 className="text-2xl font-bold">Farmers Dashboard</h1>
//           </div>
//           <button
//             onClick={fetchFarmers}
//             className="flex items-center gap-2 px-5 py-2.5 bg-white border rounded-lg hover:bg-gray-50"
//           >
//             <RefreshCw className="h-4 w-4" />
//             Refresh
//           </button>
//         </div>

//         {/* Filters */}
//         <div className="bg-white border rounded-xl p-4 grid grid-cols-2 md:grid-cols-5 gap-4">
//           <select
//             className="border p-2.5 rounded-lg"
//             value={cropName}
//             onChange={(e) => {
//               resetPage();
//               setCropName(e.target.value);
//             }}
//           >
//             <option value="">All Crops</option>
//             {[
//               "Banana",
//               "Dry Coconut",
//               "Tender Coconut",
//               "Turmeric",
//               "Green Chilli",
//               "Arecanut",
//               "Tomato",
//               "Cabbage",
//               "Cauliflower",
//               "Ginger",
//             ].map((c) => (
//               <option key={c} value={c}>
//                 {c}
//               </option>
//             ))}
//           </select>

//           <select
//             className="border p-2.5 rounded-lg"
//             value={stateFilter}
//             onChange={(e) => {
//               resetPage();
//               setStateFilter(e.target.value);
//             }}
//           >
//             <option value="">All States</option>
//             {states.map((s) => (
//               <option key={s} value={s}>
//                 {s}
//               </option>
//             ))}
//           </select>

//           <select
//             className="border p-2.5 rounded-lg"
//             value={districtFilter}
//             disabled={!stateFilter}
//             onChange={(e) => {
//               resetPage();
//               setDistrictFilter(e.target.value);
//             }}
//           >
//             <option value="">All Districts</option>
//             {districts.map((d) => (
//               <option key={d} value={d}>
//                 {d}
//               </option>
//             ))}
//           </select>

//           <select
//             className="border p-2.5 rounded-lg"
//             value={talukFilter}
//             disabled={!districtFilter}
//             onChange={(e) => {
//               resetPage();
//               setTalukFilter(e.target.value);
//             }}
//           >
//             <option value="">All Taluks</option>
//             {taluks.map((t) => (
//               <option key={t} value={t}>
//                 {t}
//               </option>
//             ))}
//           </select>

//           <select
//             className="border p-2.5 rounded-lg"
//             value={villageFilter}
//             disabled={!talukFilter}
//             onChange={(e) => {
//               resetPage();
//               setVillageFilter(e.target.value);
//             }}
//           >
//             <option value="">All Villages</option>
//             {villages.map((v) => (
//               <option key={v} value={v}>
//                 {v}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Table / States */}
//         {loading ? (
//           <div className="bg-white border rounded-xl p-12 text-center">
//             <Loader2 className="h-8 w-8 animate-spin mx-auto text-emerald-600" />
//             <p className="mt-3 text-gray-500">Loading farmers...</p>
//           </div>
//         ) : error ? (
//           <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
//             <AlertCircle className="h-8 w-8 text-red-500 mx-auto" />
//             <p className="mt-3 text-red-700">{error}</p>
//           </div>
//         ) : farmers.length === 0 ? (
//           <div className="bg-white border rounded-xl p-12 text-center text-gray-500">
//             No farmers found with current filters.
//           </div>
//         ) : (
//           <div className="bg-white border rounded-xl overflow-x-auto shadow-sm">
//             <table className="w-full min-w-[1400px] text-sm">
//               <thead className="bg-gray-50 text-gray-700">
//                 <tr>
//                   <th className="px-5 py-3 text-left font-medium">Name</th>
//                   <th className="px-5 py-3 text-left font-medium">Phone</th>
//                   <th className="px-5 py-3 text-left font-medium">Crops</th>
//                   <th className="px-5 py-3 text-left font-medium">Location</th>
//                   <th className="px-5 py-3 text-left font-medium">
//                     Land (acres)
//                   </th>
//                   <th className="px-5 py-3 text-left font-medium">
//                     Input Supplier
//                   </th>
//                   <th className="px-5 py-3 text-left font-medium">Payment</th>
//                   <th className="px-5 py-3 text-left font-medium">Drone</th>
//                   <th className="px-5 py-3 text-left font-medium">
//                     Agronomist
//                   </th>
//                   <th className="px-5 py-3 text-left font-medium">Photo</th>
//                   <th className="px-5 py-3 text-left font-medium">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y">
//                 {farmers.map((f) => (
//                   <tr key={f._id} className="hover:bg-gray-50/60">
//                     <td className="px-5 py-3 font-medium">{f.name || "—"}</td>
//                     <td className="px-5 py-3 font-mono">{f.phone || "—"}</td>
//                     <td className="px-5 py-3">
//                       {f.crops?.length ? (
//                         <div className="space-y-1 text-xs">
//                           {f.crops.map((c, i) => (
//                             <div
//                               key={i}
//                               className="border-l-2 border-gray-300 pl-2"
//                             >
//                               <div className="font-medium">{c.name}</div>
//                               {c.price && <div>₹{c.price}</div>}
//                               {c.additionalInfo && (
//                                 <div className="text-gray-500 italic">
//                                   {c.additionalInfo}
//                                 </div>
//                               )}
//                             </div>
//                           ))}
//                         </div>
//                       ) : (
//                         "—"
//                       )}
//                     </td>
//                     <td className="px-5 py-3">
//                       {[f.village, f.taluk, f.district, f.state]
//                         .filter(Boolean)
//                         .join(", ") || "—"}
//                     </td>
//                     <td className="px-5 py-3">{f.landSize ?? "—"}</td>
//                     <td className="px-5 py-3">{f.inputSupplier || "—"}</td>
//                     <td className="px-5 py-3 capitalize">
//                       {f.payment?.type || "—"}
//                       {f.payment?.additionalInfo && (
//                         <div className="text-xs text-gray-500">
//                           {f.payment.additionalInfo}
//                         </div>
//                       )}
//                     </td>
//                     <td className="px-5 py-3">
//                       {f.droneSprayingConsent?.value ? "Yes" : "No"}
//                     </td>
//                     <td className="px-5 py-3">
//                       {f.agronomistCareConsent?.value ? "Yes" : "No"}
//                     </td>
//                     <td className="px-5 py-3">
//                       {f.photo ? (
//                         <button onClick={() => openPhotoPreview(f.photo)}>
//                           <img
//                             src={f.photo}
//                             alt="Farmer"
//                             className="w-10 h-10 object-cover rounded-md border hover:border-emerald-500"
//                             loading="lazy"
//                           />
//                         </button>
//                       ) : (
//                         "—"
//                       )}
//                     </td>
//                     <td className="px-5 py-3">
//                       <button
//                         onClick={() => openEditModal(f)}
//                         className="text-emerald-600 hover:text-emerald-800 text-sm flex items-center gap-1"
//                       >
//                         <Pencil size={14} /> Edit
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {/* Pagination */}
//         {!loading && totalPages > 1 && (
//           <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
//             <button
//               disabled={page === 1}
//               onClick={() => setPage((p) => Math.max(1, p - 1))}
//               className="p-2 border rounded disabled:opacity-40 hover:bg-gray-100"
//             >
//               <ChevronLeft size={16} />
//             </button>

//             {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
//               const p = Math.max(1, page - 3 + i);
//               if (p > totalPages) return null;
//               return (
//                 <button
//                   key={p}
//                   onClick={() => setPage(p)}
//                   className={`px-3 py-1.5 border rounded text-sm font-medium min-w-[36px] ${
//                     p === page
//                       ? "bg-emerald-600 text-white border-emerald-600"
//                       : "bg-white hover:bg-gray-50"
//                   }`}
//                 >
//                   {p}
//                 </button>
//               );
//             })}

//             <button
//               disabled={page === totalPages}
//               onClick={() => setPage((p) => p + 1)}
//               className="p-2 border rounded disabled:opacity-40 hover:bg-gray-100"
//             >
//               <ChevronRight size={16} />
//             </button>
//           </div>
//         )}
//       </div>

//       {/* ================= EDIT MODAL ================= */}
//       {openEdit && editFarmer && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
//             <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
//               <h2 className="text-xl font-bold">Edit Farmer</h2>
//               <button onClick={() => setOpenEdit(false)}>
//                 <X size={24} className="text-gray-500 hover:text-gray-700" />
//               </button>
//             </div>

//             <div className="p-6 space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Name *
//                   </label>
//                   <input
//                     name="name"
//                     value={editForm.name || ""}
//                     onChange={handleEditChange}
//                     className="w-full border rounded-lg px-3 py-2"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Phone *
//                   </label>
//                   <input
//                     name="phone"
//                     value={editForm.phone || ""}
//                     onChange={handleEditChange}
//                     className="w-full border rounded-lg px-3 py-2"
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Crops */}
//               <div>
//                 <div className="flex justify-between items-center mb-3">
//                   <label className="block text-sm font-medium">
//                     Crops Grown
//                   </label>
//                   <button
//                     type="button"
//                     onClick={addCropToEdit}
//                     className="text-sm text-emerald-600 hover:underline flex items-center gap-1"
//                   >
//                     + Add Crop
//                   </button>
//                 </div>

//                 {editForm.crops?.map((crop, idx) => (
//                   <div
//                     key={idx}
//                     className="border rounded-lg p-4 mb-4 bg-gray-50"
//                   >
//                     <div className="flex justify-between mb-3">
//                       <span className="font-medium">Crop {idx + 1}</span>
//                       {editForm.crops!.length > 1 && (
//                         <button
//                           type="button"
//                           onClick={() => removeCropFromEdit(idx)}
//                           className="text-red-600 hover:text-red-800 text-sm"
//                         >
//                           Remove
//                         </button>
//                       )}
//                     </div>

//                     <select
//                       value={crop.name}
//                       onChange={(e) =>
//                         updateCropInEdit(idx, "name", e.target.value)
//                       }
//                       className="w-full border rounded-lg px-3 py-2 mb-2"
//                     >
//                       <option value="">Select crop</option>
//                       {[
//                         "Banana",
//                         "Turmeric",
//                         "Tomato",
//                         "Ginger",
//                         "Chilli",
//                         "Arecanut",
//                         "Coconut",
//                         "Other",
//                       ].map((c) => (
//                         <option key={c} value={c}>
//                           {c}
//                         </option>
//                       ))}
//                     </select>

//                     <input
//                       placeholder="Expected Price (₹)"
//                       value={crop.price || ""}
//                       onChange={(e) =>
//                         updateCropInEdit(idx, "price", e.target.value)
//                       }
//                       className="w-full border rounded-lg px-3 py-2 mb-2"
//                     />
//                     <input
//                       placeholder="Variety / season / notes"
//                       value={crop.additionalInfo || ""}
//                       onChange={(e) =>
//                         updateCropInEdit(idx, "additionalInfo", e.target.value)
//                       }
//                       className="w-full border rounded-lg px-3 py-2"
//                     />
//                   </div>
//                 ))}
//               </div>

//               {/* Location & Other */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     State
//                   </label>
//                   <input
//                     name="state"
//                     value={editForm.state || ""}
//                     onChange={handleEditChange}
//                     className="w-full border rounded-lg px-3 py-2"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     District
//                   </label>
//                   <input
//                     name="district"
//                     value={editForm.district || ""}
//                     onChange={handleEditChange}
//                     className="w-full border rounded-lg px-3 py-2"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Taluk
//                   </label>
//                   <input
//                     name="taluk"
//                     value={editForm.taluk || ""}
//                     onChange={handleEditChange}
//                     className="w-full border rounded-lg px-3 py-2"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Village
//                   </label>
//                   <input
//                     name="village"
//                     value={editForm.village || ""}
//                     onChange={handleEditChange}
//                     className="w-full border rounded-lg px-3 py-2"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Land Size (acres)
//                   </label>
//                   <input
//                     name="landSize"
//                     type="number"
//                     value={editForm.landSize ?? ""}
//                     onChange={handleEditChange}
//                     className="w-full border rounded-lg px-3 py-2"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Input Supplier
//                   </label>
//                   <input
//                     name="inputSupplier"
//                     value={editForm.inputSupplier || ""}
//                     onChange={handleEditChange}
//                     className="w-full border rounded-lg px-3 py-2"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Additional Crops / Notes
//                 </label>
//                 <textarea
//                   name="additionalCrops"
//                   value={editForm.additionalCrops || ""}
//                   onChange={handleEditChange}
//                   className="w-full border rounded-lg px-3 py-2 min-h-[80px]"
//                 />
//               </div>

//               {/* Payment & Consents */}
//               <div className="bg-gray-50 p-5 rounded-xl space-y-5">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                   <div>
//                     <label className="block text-sm font-medium mb-1">
//                       Payment Type
//                     </label>
//                     <select
//                       value={editForm.payment?.type || ""}
//                       onChange={(e) =>
//                         handleNestedChange("payment", "type", e.target.value)
//                       }
//                       className="w-full border rounded-lg px-3 py-2"
//                     >
//                       <option value="">Select</option>
//                       <option value="cash">Cash</option>
//                       <option value="credit">Credit</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-1">
//                       Payment Notes
//                     </label>
//                     <input
//                       value={editForm.payment?.additionalInfo || ""}
//                       onChange={(e) =>
//                         handleNestedChange(
//                           "payment",
//                           "additionalInfo",
//                           e.target.value,
//                         )
//                       }
//                       className="w-full border rounded-lg px-3 py-2"
//                     />
//                   </div>
//                 </div>

//                 <div className="border-t pt-4">
//                   <label className="block text-sm font-medium mb-2">
//                     Drone Spraying Consent
//                   </label>
//                   <div className="flex items-center gap-3 mb-2">
//                     <input
//                       type="checkbox"
//                       checked={editForm.droneSprayingConsent?.value || false}
//                       onChange={(e) =>
//                         handleNestedChange(
//                           "droneSprayingConsent",
//                           "value",
//                           e.target.checked,
//                         )
//                       }
//                     />
//                     <span>Consent given</span>
//                   </div>
//                   <input
//                     placeholder="Notes / acres / agreement date"
//                     value={editForm.droneSprayingConsent?.additionalInfo || ""}
//                     onChange={(e) =>
//                       handleNestedChange(
//                         "droneSprayingConsent",
//                         "additionalInfo",
//                         e.target.value,
//                       )
//                     }
//                     className="w-full border rounded-lg px-3 py-2"
//                   />
//                 </div>

//                 <div className="border-t pt-4">
//                   <label className="block text-sm font-medium mb-2">
//                     Agronomist Care Consent
//                   </label>
//                   <div className="flex items-center gap-3 mb-2">
//                     <input
//                       type="checkbox"
//                       checked={editForm.agronomistCareConsent?.value || false}
//                       onChange={(e) =>
//                         handleNestedChange(
//                           "agronomistCareConsent",
//                           "value",
//                           e.target.checked,
//                         )
//                       }
//                     />
//                     <span>Consent given</span>
//                   </div>
//                   <input
//                     placeholder="Notes / agreement details"
//                     value={editForm.agronomistCareConsent?.additionalInfo || ""}
//                     onChange={(e) =>
//                       handleNestedChange(
//                         "agronomistCareConsent",
//                         "additionalInfo",
//                         e.target.value,
//                       )
//                     }
//                     className="w-full border rounded-lg px-3 py-2"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="border-t px-6 py-4 flex justify-end gap-3 sticky bottom-0 bg-white z-10">
//               <button
//                 onClick={() => setOpenEdit(false)}
//                 disabled={savingEdit}
//                 className="px-6 py-2.5 border rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={saveEdit}
//                 disabled={savingEdit}
//                 className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2"
//               >
//                 {savingEdit ? (
//                   <>
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                     Saving...
//                   </>
//                 ) : (
//                   <>
//                     <Save size={16} />
//                     Save Changes
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Photo Preview */}
//       {previewPhoto && (
//         <div
//           className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
//           onClick={closePhotoPreview}
//         >
//           <div
//             className="relative max-w-5xl max-h-[90vh]"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               onClick={closePhotoPreview}
//               className="absolute -top-12 right-0 bg-white/20 text-white p-3 rounded-full hover:bg-white/40"
//             >
//               <X size={24} />
//             </button>
//             <img
//               src={previewPhoto}
//               alt="Farmer photo"
//               className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState, useCallback } from "react";
// import {
//   Users,
//   RefreshCw,
//   AlertCircle,
//   Loader2,
//   Pencil,
//   X,
//   ChevronLeft,
//   ChevronRight,
//   Save,
//   Image as ImageIcon,
// } from "lucide-react";

// const API = "https://tracking-backend-aya4.onrender.com";
// const LIMIT = 12;

// /* ────────────────────────────────────────────────
//    TYPES – union of old + new schema
// ───────────────────────────────────────────────── */

// interface Crop {
//   name: string;
//   price?: string;
//   additionalInfo?: string;
// }

// interface Payment {
//   type?: "cash" | "credit";
//   additionalInfo?: string;
// }

// interface Consent {
//   value: boolean;
//   additionalInfo?: string;
// }

// interface UserLite {
//   _id: string;
//   name: string;
//   phone?: string;
// }

// interface Farmer {
//   _id: string;
//   name: string;
//   phone: string;

//   // New style fields
//   crops?: Crop[];
//   additionalCrops?: string;
//   state?: string;
//   district?: string;
//   taluk?: string;
//   village?: string;
//   landSize?: number;
//   inputSupplier?: string;
//   additionalInfo?: string;
//   payment?: Payment;
//   droneSprayingConsent?: Consent | boolean;
//   agronomistCareConsent?: Consent | boolean;
//   photo?: string;
//   onboardedBy?: UserLite | string;

//   // Old style fallback fields
//   cropType?: string;
//   cropCost?: string | null;
//   paymentType?: "cash" | "credit";
//   createdAt: string;
//   updatedAt: string;
//   __v?: number;
//   location?: { latitude: number; longitude: number };
// }

// /* ────────────────────────────────────────────────
//    MAIN COMPONENT
// ───────────────────────────────────────────────── */

// export default function FarmerDashboardPage() {
//   const [farmers, setFarmers] = useState<Farmer[]>([]);
//   const [users, setUsers] = useState<UserLite[]>([]);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Pagination
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [total, setTotal] = useState(0);

//   // Filters (active only when viewing all farmers)
//   const [selectedUserId, setSelectedUserId] = useState("");
//   const [cropName, setCropName] = useState("");
//   const [stateFilter, setStateFilter] = useState("");
//   const [districtFilter, setDistrictFilter] = useState("");
//   const [talukFilter, setTalukFilter] = useState("");
//   const [villageFilter, setVillageFilter] = useState("");

//   // Location dropdown data
//   const [states, setStates] = useState<string[]>([]);
//   const [districts, setDistricts] = useState<string[]>([]);
//   const [taluks, setTaluks] = useState<string[]>([]);
//   const [villages, setVillages] = useState<string[]>([]);

//   // Edit modal
//   const [editOpen, setEditOpen] = useState(false);
//   const [editFarmer, setEditFarmer] = useState<Farmer | null>(null);
//   const [editForm, setEditForm] = useState<Partial<Farmer>>({});
//   const [saving, setSaving] = useState(false);

//   // Photo preview
//   const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

//   /* ────────────────────────────────────────────────
//      DISPLAY HELPERS – normalize old/new fields
//   ───────────────────────────────────────────────── */

//   const getCropsDisplay = (f: Farmer) => {
//     if (f.crops?.length) return f.crops.map((c) => c.name).join(", ");
//     if (f.cropType) return f.cropType;
//     return "—";
//   };

//   const getPaymentDisplay = (f: Farmer) => {
//     if (f.payment?.type) return f.payment.type;
//     if (f.paymentType) return f.paymentType;
//     return "—";
//   };

//   const getDroneConsent = (f: Farmer): boolean =>
//     typeof f.droneSprayingConsent === "object"
//       ? !!f.droneSprayingConsent?.value
//       : !!f.droneSprayingConsent;

//   const getAgronomistConsent = (f: Farmer): boolean =>
//     typeof f.agronomistCareConsent === "object"
//       ? !!f.agronomistCareConsent?.value
//       : !!f.agronomistCareConsent;

//   const getLocationDisplay = (f: Farmer) => {
//     const parts = [f.village, f.taluk, f.district, f.state].filter(Boolean);
//     return parts.length ? parts.join(", ") : "—";
//   };

//   const getOnboardedByName = (f: Farmer) =>
//     typeof f.onboardedBy === "object" && f.onboardedBy?.name
//       ? f.onboardedBy.name
//       : "—";

//   /* ────────────────────────────────────────────────
//      LOAD USERS + LOCATIONS
//   ───────────────────────────────────────────────── */

//   useEffect(() => {
//     // Users for dropdown
//     fetch(`${API}/api/users`)
//       .then((r) => r.json())
//       .then((data) => setUsers(data.data || data || []))
//       .catch(() => {});

//     // States
//     fetch(`${API}/newlocations/states`)
//       .then((r) => r.json())
//       .then((j) => setStates(j.data || []))
//       .catch(() => {});
//   }, []);

//   useEffect(() => {
//     if (!stateFilter) {
//       setDistricts([]);
//       setDistrictFilter("");
//       setTaluks([]);
//       setTalukFilter("");
//       setVillages([]);
//       setVillageFilter("");
//       return;
//     }
//     fetch(
//       `${API}/newlocations/districts?state=${encodeURIComponent(stateFilter)}`,
//     )
//       .then((r) => r.json())
//       .then((j) => setDistricts(j.data || []));
//   }, [stateFilter]);

//   useEffect(() => {
//     if (!stateFilter || !districtFilter) return;
//     fetch(
//       `${API}/newlocations/taluks?state=${encodeURIComponent(stateFilter)}&district=${encodeURIComponent(districtFilter)}`,
//     )
//       .then((r) => r.json())
//       .then((j) => setTaluks(j.data || []));
//   }, [stateFilter, districtFilter]);

//   useEffect(() => {
//     if (!stateFilter || !districtFilter || !talukFilter) return;
//     fetch(
//       `${API}/newlocations/villages?state=${encodeURIComponent(stateFilter)}&district=${encodeURIComponent(districtFilter)}&taluk=${encodeURIComponent(talukFilter)}`,
//     )
//       .then((r) => r.json())
//       .then((j) => setVillages(j.data || []));
//   }, [stateFilter, districtFilter, talukFilter]);

//   /* ────────────────────────────────────────────────
//      FETCH FARMERS
//   ───────────────────────────────────────────────── */

//   const fetchFarmers = useCallback(async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       let url = "";

//       if (selectedUserId) {
//         url = `${API}/api/farmer/onboarded/${selectedUserId}?page=${page}&limit=${LIMIT}`;
//       } else {
//         const params = new URLSearchParams({
//           page: page.toString(),
//           limit: LIMIT.toString(),
//           ...(cropName && { cropName }),
//           ...(stateFilter && { state: stateFilter }),
//           ...(districtFilter && { district: districtFilter }),
//           ...(talukFilter && { taluk: talukFilter }),
//           ...(villageFilter && { village: villageFilter }),
//         });
//         url = `${API}/api/farmer?${params.toString()}`;
//       }

//       const res = await fetch(url, { cache: "no-store" });
//       if (!res.ok) {
//         const text = await res.text();
//         throw new Error(`HTTP ${res.status} – ${text.slice(0, 100)}`);
//       }

//       const json = await res.json();
//       const list = json.data || [];
//       const pag = json.pagination || {};

//       setFarmers(list);
//       setTotal(pag.total || list.length || 0);
//       setTotalPages(pag.totalPages || 1);

//       if (pag.totalPages && page > pag.totalPages) {
//         setPage(pag.totalPages);
//       }
//     } catch (err: any) {
//       setError(err.message || "Could not load farmers");
//     } finally {
//       setLoading(false);
//     }
//   }, [
//     page,
//     selectedUserId,
//     cropName,
//     stateFilter,
//     districtFilter,
//     talukFilter,
//     villageFilter,
//   ]);

//   useEffect(() => {
//     fetchFarmers();
//   }, [fetchFarmers]);

//   /* ────────────────────────────────────────────────
//      EDIT MODAL LOGIC
//   ───────────────────────────────────────────────── */

//   const openEdit = (farmer: Farmer) => {
//     const initialCrops = farmer.crops?.length
//       ? [...farmer.crops]
//       : farmer.cropType
//         ? [
//             {
//               name: farmer.cropType,
//               price: farmer.cropCost || "",
//               additionalInfo: "",
//             },
//           ]
//         : [{ name: "", price: "", additionalInfo: "" }];

//     setEditFarmer(farmer);
//     setEditForm({
//       ...farmer,
//       crops: initialCrops,
//       payment: {
//         type: farmer.payment?.type || farmer.paymentType || "",
//         additionalInfo: farmer.payment?.additionalInfo || "",
//       },
//       droneSprayingConsent:
//         typeof farmer.droneSprayingConsent === "object"
//           ? { ...farmer.droneSprayingConsent }
//           : { value: !!farmer.droneSprayingConsent, additionalInfo: "" },
//       agronomistCareConsent:
//         typeof farmer.agronomistCareConsent === "object"
//           ? { ...farmer.agronomistCareConsent }
//           : { value: !!farmer.agronomistCareConsent, additionalInfo: "" },
//     });
//     setEditOpen(true);
//   };

//   const addCrop = () => {
//     setEditForm((p) => ({
//       ...p,
//       crops: [...(p.crops || []), { name: "", price: "", additionalInfo: "" }],
//     }));
//   };

//   const removeCrop = (idx: number) => {
//     if ((editForm.crops?.length || 0) <= 1) return;
//     setEditForm((p) => ({
//       ...p,
//       crops: p.crops?.filter((_, i) => i !== idx) || [],
//     }));
//   };

//   const updateCrop = (idx: number, field: keyof Crop, value: string) => {
//     setEditForm((p) => {
//       const crops = [...(p.crops || [])];
//       crops[idx] = { ...crops[idx], [field]: value };
//       return { ...p, crops };
//     });
//   };

//   const handleEditChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
//     >,
//   ) => {
//     const { name, value } = e.target;
//     setEditForm((p) => ({ ...p, [name]: value }));
//   };

//   const handleConsentChange = (
//     field: "droneSprayingConsent" | "agronomistCareConsent",
//     key: "value" | "additionalInfo",
//     val: any,
//   ) => {
//     setEditForm((p) => ({
//       ...p,
//       [field]: {
//         ...((p[field] as any) || { value: false, additionalInfo: "" }),
//         [key]: val,
//       },
//     }));
//   };

//   const handlePaymentChange = (key: keyof Payment, val: string) => {
//     setEditForm((p) => ({
//       ...p,
//       payment: {
//         ...(p.payment || {}),
//         [key]: val,
//       },
//     }));
//   };

//   const saveEdit = async () => {
//     if (!editFarmer) return;
//     setSaving(true);

//     try {
//       const payload: any = {
//         name: editForm.name?.trim(),
//         phone: editForm.phone?.trim().replace(/\D/g, ""),
//         crops:
//           editForm.crops
//             ?.filter((c) => c.name?.trim())
//             .map((c) => ({
//               name: c.name.trim(),
//               price: c.price?.trim() || undefined,
//               additionalInfo: c.additionalInfo?.trim() || undefined,
//             })) || [],
//         additionalCrops: editForm.additionalCrops?.trim() || undefined,
//         state: editForm.state?.trim() || undefined,
//         district: editForm.district?.trim() || undefined,
//         taluk: editForm.taluk?.trim() || undefined,
//         village: editForm.village?.trim() || undefined,
//         landSize: editForm.landSize ? Number(editForm.landSize) : undefined,
//         inputSupplier: editForm.inputSupplier?.trim() || undefined,
//         additionalInfo: editForm.additionalInfo?.trim() || undefined,
//         payment: editForm.payment?.type
//           ? {
//               type: editForm.payment.type,
//               additionalInfo:
//                 editForm.payment.additionalInfo?.trim() || undefined,
//             }
//           : undefined,
//         droneSprayingConsent: {
//           value: !!editForm.droneSprayingConsent?.value,
//           additionalInfo:
//             editForm.droneSprayingConsent?.additionalInfo?.trim() || undefined,
//         },
//         agronomistCareConsent: {
//           value: !!editForm.agronomistCareConsent?.value,
//           additionalInfo:
//             editForm.agronomistCareConsent?.additionalInfo?.trim() || undefined,
//         },
//       };

//       const res = await fetch(`${API}/api/farmer/${editFarmer._id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) throw new Error(await res.text());

//       setEditOpen(false);
//       fetchFarmers();
//       alert("Farmer updated successfully");
//     } catch (err: any) {
//       alert("Save failed – check console");
//       console.error(err);
//     } finally {
//       setSaving(false);
//     }
//   };

//   /* ────────────────────────────────────────────────
//      RENDER
//   ───────────────────────────────────────────────── */

//   return (
//     <div className="min-h-screen bg-gray-50 pb-16">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//           <div className="flex items-center gap-3">
//             <Users className="h-8 w-8 text-emerald-600" />
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//               Farmers Dashboard
//             </h1>
//           </div>
//           <div className="flex items-center gap-3 flex-wrap">
//             <button
//               onClick={fetchFarmers}
//               className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 shadow-sm"
//             >
//               <RefreshCw size={16} />
//               Refresh
//             </button>
//             <button
//               onClick={() => {
//                 setSelectedUserId("");
//                 setCropName("");
//                 setStateFilter("");
//                 setDistrictFilter("");
//                 setTalukFilter("");
//                 setVillageFilter("");
//                 setPage(1);
//               }}
//               className="text-sm text-gray-600 hover:text-gray-900 underline"
//             >
//               Clear all filters
//             </button>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="bg-white border rounded-xl p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
//           <div>
//             <label className="block text-xs text-gray-600 mb-1 font-medium">
//               Onboarded by
//             </label>
//             <select
//               value={selectedUserId}
//               onChange={(e) => {
//                 setSelectedUserId(e.target.value);
//                 setPage(1);
//               }}
//               className="w-full border rounded-lg px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200"
//             >
//               <option value="">All users</option>
//               {users.map((u) => (
//                 <option key={u._id} value={u._id}>
//                   {u.name} {u.phone && ` • ${u.phone}`}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-xs text-gray-600 mb-1 font-medium">
//               Crop
//             </label>
//             <select
//               value={cropName}
//               onChange={(e) => {
//                 setCropName(e.target.value);
//                 setPage(1);
//               }}
//               disabled={!!selectedUserId}
//               className="w-full border rounded-lg px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200"
//             >
//               <option value="">All Crops</option>
//               {[
//                 "Banana",
//                 "Dry Coconut",
//                 "Tender Coconut",
//                 "Turmeric",
//                 "Green Chilli",
//                 "Arecanut",
//                 "Tomato",
//                 "Cabbage",
//                 "Cauliflower",
//                 "Ginger",
//               ].map((c) => (
//                 <option key={c} value={c}>
//                   {c}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-xs text-gray-600 mb-1 font-medium">
//               State
//             </label>
//             <select
//               value={stateFilter}
//               onChange={(e) => {
//                 setStateFilter(e.target.value);
//                 setPage(1);
//               }}
//               disabled={!!selectedUserId}
//               className="w-full border rounded-lg px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200"
//             >
//               <option value="">All States</option>
//               {states.map((s) => (
//                 <option key={s} value={s}>
//                   {s}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-xs text-gray-600 mb-1 font-medium">
//               District
//             </label>
//             <select
//               value={districtFilter}
//               onChange={(e) => {
//                 setDistrictFilter(e.target.value);
//                 setPage(1);
//               }}
//               disabled={!stateFilter || !!selectedUserId}
//               className="w-full border rounded-lg px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200"
//             >
//               <option value="">All Districts</option>
//               {districts.map((d) => (
//                 <option key={d} value={d}>
//                   {d}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-xs text-gray-600 mb-1 font-medium">
//               Taluk
//             </label>
//             <select
//               value={talukFilter}
//               onChange={(e) => {
//                 setTalukFilter(e.target.value);
//                 setPage(1);
//               }}
//               disabled={!districtFilter || !!selectedUserId}
//               className="w-full border rounded-lg px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200"
//             >
//               <option value="">All Taluks</option>
//               {taluks.map((t) => (
//                 <option key={t} value={t}>
//                   {t}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-xs text-gray-600 mb-1 font-medium">
//               Village
//             </label>
//             <select
//               value={villageFilter}
//               onChange={(e) => {
//                 setVillageFilter(e.target.value);
//                 setPage(1);
//               }}
//               disabled={!talukFilter || !!selectedUserId}
//               className="w-full border rounded-lg px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200"
//             >
//               <option value="">All Villages</option>
//               {villages.map((v) => (
//                 <option key={v} value={v}>
//                   {v}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Table / States */}
//         {loading ? (
//           <div className="bg-white border rounded-xl p-16 text-center">
//             <Loader2 className="h-12 w-12 animate-spin mx-auto text-emerald-600" />
//             <p className="mt-5 text-gray-600">Loading farmers...</p>
//           </div>
//         ) : error ? (
//           <div className="bg-red-50 border border-red-200 rounded-xl p-10 text-center">
//             <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
//             <p className="mt-4 text-red-700">{error}</p>
//           </div>
//         ) : farmers.length === 0 ? (
//           <div className="bg-white border rounded-xl p-16 text-center text-gray-600">
//             No farmers found{" "}
//             {selectedUserId ? "for selected user" : "with current filters"}.
//           </div>
//         ) : (
//           <>
//             <div className="bg-white border rounded-xl overflow-x-auto shadow-sm">
//               <table className="w-full min-w-[1400px] text-sm">
//                 <thead className="bg-gray-50">
//                   <tr className="text-gray-700">
//                     <th className="px-6 py-4 text-left font-medium">Name</th>
//                     <th className="px-6 py-4 text-left font-medium">Phone</th>

//                     <th className="px-6 py-4 text-left font-medium">Crops</th>
//                     <th className="px-6 py-4 text-left font-medium">
//                       Location
//                     </th>
//                     <th className="px-6 py-4 text-left font-medium">
//                       Land (acres)
//                     </th>
//                     <th className="px-6 py-4 text-left font-medium">Payment</th>
//                     <th className="px-6 py-4 text-left font-medium">Drone</th>
//                     <th className="px-6 py-4 text-left font-medium">
//                       Agronomist
//                     </th>
//                     <th className="px-6 py-4 text-left font-medium">
//                       AdditinalCrops
//                     </th>
//                     <th className="px-6 py-4 text-left font-medium">Photo</th>
//                     <th className="px-6 py-4 text-left font-medium">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y">
//                   {farmers.map((f) => (
//                     <tr key={f._id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 font-medium">{f.name || "—"}</td>
//                       <td className="px-6 py-4 font-mono">{f.phone || "—"}</td>

//                       <td className="px-6 py-4">{getCropsDisplay(f)}</td>
//                       <td className="px-6 py-4">{getLocationDisplay(f)}</td>
//                       <td className="px-6 py-4">{f.landSize ?? "—"}</td>
//                       <td className="px-6 py-4 capitalize">
//                         {getPaymentDisplay(f)}
//                       </td>
//                       <td className="px-6 py-4 text-center">
//                         {getDroneConsent(f) ? "Yes" : "No"}
//                       </td>
//                       <td className="px-6 py-4 text-center">
//                         {getAgronomistConsent(f) ? "Yes" : "No"}
//                       </td>
//                       <td className="px-6 py-4">{f.additionalCrops ?? "—"}</td>
//                       <td className="px-6 py-4">
//                         {f.photo ? (
//                           <button onClick={() => setPreviewPhoto(f.photo)}>
//                             <img
//                               src={f.photo}
//                               alt="Farmer"
//                               className="w-10 h-10 object-cover rounded border hover:border-emerald-500"
//                               loading="lazy"
//                             />
//                           </button>
//                         ) : (
//                           <ImageIcon className="text-gray-400" size={32} />
//                         )}
//                       </td>
//                       <td className="px-6 py-4">
//                         <button
//                           onClick={() => openEdit(f)}
//                           className="text-emerald-600 hover:text-emerald-800 text-sm font-medium flex items-center gap-1"
//                         >
//                           <Pencil size={14} /> Edit
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="flex flex-wrap justify-center items-center gap-2 mt-8">
//                 <button
//                   disabled={page === 1}
//                   onClick={() => setPage((p) => Math.max(1, p - 1))}
//                   className="p-3 border rounded disabled:opacity-40 hover:bg-gray-100"
//                 >
//                   <ChevronLeft size={18} />
//                 </button>

//                 {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//                   (p) => (
//                     <button
//                       key={p}
//                       onClick={() => setPage(p)}
//                       className={`px-4 py-2 border rounded min-w-[48px] font-medium ${
//                         p === page
//                           ? "bg-emerald-600 text-white border-emerald-600"
//                           : "bg-white hover:bg-gray-50"
//                       }`}
//                     >
//                       {p}
//                     </button>
//                   ),
//                 )}

//                 <button
//                   disabled={page === totalPages}
//                   onClick={() => setPage((p) => p + 1)}
//                   className="p-3 border rounded disabled:opacity-40 hover:bg-gray-100"
//                 >
//                   <ChevronRight size={18} />
//                 </button>

//                 <div className="ml-6 text-sm text-gray-700 font-medium">
//                   Showing {farmers.length} of {total} farmers
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* Photo Preview */}
//       {previewPhoto && (
//         <div
//           className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
//           onClick={() => setPreviewPhoto(null)}
//         >
//           <div
//             className="relative max-w-5xl max-h-[90vh]"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               className="absolute -top-14 right-0 text-white bg-black/50 p-3 rounded-full hover:bg-black/70"
//               onClick={() => setPreviewPhoto(null)}
//             >
//               <X size={28} />
//             </button>
//             <img
//               src={previewPhoto}
//               alt="Farmer photo"
//               className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl border-4 border-white"
//             />
//           </div>
//         </div>
//       )}

//       {/* ────────────────────────────────────────────────
//          FULL EDIT MODAL
//       ───────────────────────────────────────────────── */}

//       {editOpen && editFarmer && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl">
//             <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
//               <h2 className="text-xl font-bold">Edit Farmer</h2>
//               <button onClick={() => setEditOpen(false)}>
//                 <X size={24} className="text-gray-600 hover:text-gray-800" />
//               </button>
//             </div>

//             <div className="p-6 space-y-6">
//               {/* Basic Info */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Name *
//                   </label>
//                   <input
//                     name="name"
//                     value={editForm.name || ""}
//                     onChange={handleEditChange}
//                     className="w-full border rounded-lg px-4 py-2 focus:border-emerald-500 focus:ring-1"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Phone *
//                   </label>
//                   <input
//                     name="phone"
//                     value={editForm.phone || ""}
//                     onChange={handleEditChange}
//                     className="w-full border rounded-lg px-4 py-2 focus:border-emerald-500 focus:ring-1"
//                   />
//                 </div>
//               </div>

//               {/* Crops */}
//               <div>
//                 <div className="flex justify-between items-center mb-3">
//                   <label className="block text-sm font-medium">
//                     Crops Grown
//                   </label>
//                   <button
//                     type="button"
//                     onClick={addCrop}
//                     className="text-sm text-emerald-600 hover:underline flex items-center gap-1"
//                   >
//                     + Add Crop
//                   </button>
//                 </div>

//                 {editForm.crops?.map((crop, idx) => (
//                   <div
//                     key={idx}
//                     className="border rounded-lg p-4 mb-4 bg-gray-50"
//                   >
//                     <div className="flex justify-between mb-3">
//                       <span className="font-medium">Crop {idx + 1}</span>
//                       {editForm.crops!.length > 1 && (
//                         <button
//                           type="button"
//                           onClick={() => removeCrop(idx)}
//                           className="text-red-600 hover:text-red-800 text-sm"
//                         >
//                           Remove
//                         </button>
//                       )}
//                     </div>

//                     <select
//                       value={crop.name}
//                       onChange={(e) => updateCrop(idx, "name", e.target.value)}
//                       className="w-full border rounded-lg px-3 py-2 mb-2"
//                     >
//                       <option value="">Select crop</option>
//                       {[
//                         "Banana",
//                         "Turmeric",
//                         "Tomato",
//                         "Ginger",
//                         "Chilli",
//                         "Arecanut",
//                         "Coconut",
//                         "Other",
//                       ].map((c) => (
//                         <option key={c} value={c}>
//                           {c}
//                         </option>
//                       ))}
//                     </select>

//                     <input
//                       placeholder="Expected Price (₹)"
//                       value={crop.price || ""}
//                       onChange={(e) => updateCrop(idx, "price", e.target.value)}
//                       className="w-full border rounded-lg px-3 py-2 mb-2"
//                     />

//                     <input
//                       placeholder="Variety / notes / season"
//                       value={crop.additionalInfo || ""}
//                       onChange={(e) =>
//                         updateCrop(idx, "additionalInfo", e.target.value)
//                       }
//                       className="w-full border rounded-lg px-3 py-2"
//                     />
//                   </div>
//                 ))}
//               </div>

//               {/* Location & other */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     State
//                   </label>
//                   <input
//                     name="state"
//                     value={editForm.state || ""}
//                     onChange={handleEditChange}
//                     className="w-full border rounded-lg px-4 py-2"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     District
//                   </label>
//                   <input
//                     name="district"
//                     value={editForm.district || ""}
//                     onChange={handleEditChange}
//                     className="w-full border rounded-lg px-4 py-2"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Taluk
//                   </label>
//                   <input
//                     name="taluk"
//                     value={editForm.taluk || ""}
//                     onChange={handleEditChange}
//                     className="w-full border rounded-lg px-4 py-2"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Village
//                   </label>
//                   <input
//                     name="village"
//                     value={editForm.village || ""}
//                     onChange={handleEditChange}
//                     className="w-full border rounded-lg px-4 py-2"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Land Size (acres)
//                   </label>
//                   <input
//                     name="landSize"
//                     type="number"
//                     value={editForm.landSize ?? ""}
//                     onChange={handleEditChange}
//                     className="w-full border rounded-lg px-4 py-2"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Input Supplier
//                   </label>
//                   <input
//                     name="inputSupplier"
//                     value={editForm.inputSupplier || ""}
//                     onChange={handleEditChange}
//                     className="w-full border rounded-lg px-4 py-2"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Additional Crops / Notes
//                 </label>
//                 <textarea
//                   name="additionalCrops"
//                   value={editForm.additionalCrops || ""}
//                   onChange={handleEditChange}
//                   className="w-full border rounded-lg px-4 py-2 min-h-[90px]"
//                 />
//               </div>

//               {/* Payment & Consents */}
//               <div className="bg-gray-50 p-5 rounded-xl space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                   <div>
//                     <label className="block text-sm font-medium mb-1">
//                       Payment Type
//                     </label>
//                     <select
//                       value={editForm.payment?.type || ""}
//                       onChange={(e) =>
//                         handlePaymentChange("type", e.target.value)
//                       }
//                       className="w-full border rounded-lg px-3 py-2"
//                     >
//                       <option value="">None</option>
//                       <option value="cash">Cash</option>
//                       <option value="credit">Credit</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-1">
//                       Payment Notes
//                     </label>
//                     <input
//                       value={editForm.payment?.additionalInfo || ""}
//                       onChange={(e) =>
//                         handlePaymentChange("additionalInfo", e.target.value)
//                       }
//                       className="w-full border rounded-lg px-3 py-2"
//                     />
//                   </div>
//                 </div>

//                 {/* Drone */}
//                 <div>
//                   <label className="block text-sm font-medium mb-2">
//                     Drone Spraying Consent
//                   </label>
//                   <div className="flex items-center gap-3 mb-2">
//                     <input
//                       type="checkbox"
//                       checked={!!editForm.droneSprayingConsent?.value}
//                       onChange={(e) =>
//                         handleConsentChange(
//                           "droneSprayingConsent",
//                           "value",
//                           e.target.checked,
//                         )
//                       }
//                     />
//                     <span>Consent given</span>
//                   </div>
//                   <input
//                     placeholder="Notes / acres / date"
//                     value={editForm.droneSprayingConsent?.additionalInfo || ""}
//                     onChange={(e) =>
//                       handleConsentChange(
//                         "droneSprayingConsent",
//                         "additionalInfo",
//                         e.target.value,
//                       )
//                     }
//                     className="w-full border rounded-lg px-3 py-2"
//                   />
//                 </div>

//                 {/* Agronomist */}
//                 <div>
//                   <label className="block text-sm font-medium mb-2">
//                     Agronomist Care Consent
//                   </label>
//                   <div className="flex items-center gap-3 mb-2">
//                     <input
//                       type="checkbox"
//                       checked={!!editForm.agronomistCareConsent?.value}
//                       onChange={(e) =>
//                         handleConsentChange(
//                           "agronomistCareConsent",
//                           "value",
//                           e.target.checked,
//                         )
//                       }
//                     />
//                     <span>Consent given</span>
//                   </div>
//                   <input
//                     placeholder="Notes / agreement details"
//                     value={editForm.agronomistCareConsent?.additionalInfo || ""}
//                     onChange={(e) =>
//                       handleConsentChange(
//                         "agronomistCareConsent",
//                         "additionalInfo",
//                         e.target.value,
//                       )
//                     }
//                     className="w-full border rounded-lg px-3 py-2"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="border-t px-6 py-5 flex justify-end gap-4 sticky bottom-0 bg-white z-10">
//               <button
//                 onClick={() => setEditOpen(false)}
//                 disabled={saving}
//                 className="px-6 py-2.5 border rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={saveEdit}
//                 disabled={saving}
//                 className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2"
//               >
//                 {saving ? (
//                   <>
//                     <Loader2 className="h-5 w-5 animate-spin" />
//                     Saving...
//                   </>
//                 ) : (
//                   <>
//                     <Save size={18} />
//                     Save Changes
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Users,
  RefreshCw,
  AlertCircle,
  Loader2,
  Pencil,
  X,
  ChevronLeft,
  ChevronRight,
  Save,
  Image as ImageIcon,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL!;
const LIMIT = 10;

/* ────────────────────────────────────────────────
   TYPES – union of old + new schema
───────────────────────────────────────────────── */

interface Crop {
  name: string;
  price?: string;
  additionalInfo?: string;
}

interface Payment {
  type?: "cash" | "credit";
  additionalInfo?: string;
}

interface Consent {
  value: boolean;
  additionalInfo?: string;
}

interface UserLite {
  _id: string;
  name: string;
  phone?: string;
}

interface Farmer {
  _id: string;
  name: string;
  phone: string;

  // New style fields
  crops?: Crop[];
  additionalCrops?: string;
  state?: string;
  district?: string;
  taluk?: string;
  village?: string;
  landSize?: number;
  inputSupplier?: string;
  additionalInfo?: string;
  payment?: Payment;
  droneSprayingConsent?: Consent | boolean;
  agronomistCareConsent?: Consent | boolean;
  photo?: string;
  onboardedBy?: UserLite | string;

  // Old style fallback fields
  cropType?: string;
  cropCost?: string | null;
  paymentType?: "cash" | "credit";
  createdAt: string;
  updatedAt: string;
  __v?: number;
  location?: { latitude: number; longitude: number };
}

/* ────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────── */

export default function FarmerDashboardPage() {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [users, setUsers] = useState<UserLite[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Filters (active only when viewing all farmers)
  const [selectedUserId, setSelectedUserId] = useState("");
  const [cropName, setCropName] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [talukFilter, setTalukFilter] = useState("");
  const [villageFilter, setVillageFilter] = useState("");

  // Location dropdown data
  const [states, setStates] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [taluks, setTaluks] = useState<string[]>([]);
  const [villages, setVillages] = useState<string[]>([]);

  // Edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editFarmer, setEditFarmer] = useState<Farmer | null>(null);
  const [editForm, setEditForm] = useState<Partial<Farmer>>({});
  const [saving, setSaving] = useState(false);

  // Photo preview
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  /* ────────────────────────────────────────────────
     DISPLAY HELPERS – everything visible, no hover needed
  ───────────────────────────────────────────────── */

  const getCropsDisplay = (f: Farmer) => {
    if (f.crops?.length) {
      return f.crops
        .map((c) => {
          let parts = [c.name];
          if (c.price) parts.push(`₹${c.price}`);
          if (c.additionalInfo) parts.push(c.additionalInfo);
          return parts.join(" – ");
        })
        .join(" | ");
    }
    if (f.cropType) {
      let parts = [f.cropType];
      if (f.cropCost) parts.push(`₹${f.cropCost}`);
      return parts.join(" – ");
    }
    return "—";
  };

  const getPaymentDisplay = (f: Farmer) => {
    if (f.payment?.type) return f.payment.type;
    if (f.paymentType) return f.paymentType;
    return "—";
  };

  const getDroneConsentDisplay = (f: Farmer) => {
    const value =
      typeof f.droneSprayingConsent === "object"
        ? f.droneSprayingConsent?.value
        : !!f.droneSprayingConsent;

    if (!value) return "No";

    const info =
      typeof f.droneSprayingConsent === "object" &&
      f.droneSprayingConsent?.additionalInfo
        ? f.droneSprayingConsent.additionalInfo
        : "";

    return info ? `Yes – ${info}` : "Yes";
  };

  const getAgronomistConsentDisplay = (f: Farmer) => {
    const value =
      typeof f.agronomistCareConsent === "object"
        ? f.agronomistCareConsent?.value
        : !!f.agronomistCareConsent;

    if (!value) return "No";

    const info =
      typeof f.agronomistCareConsent === "object" &&
      f.agronomistCareConsent?.additionalInfo
        ? f.agronomistCareConsent.additionalInfo
        : "";

    return info ? `Yes – ${info}` : "Yes";
  };

  const getLocationDisplay = (f: Farmer) => {
    const parts = [f.village, f.taluk, f.district, f.state].filter(Boolean);
    return parts.length ? parts.join(", ") : "—";
  };

  const getOnboardedByName = (f: Farmer) =>
    typeof f.onboardedBy === "object" && f.onboardedBy?.name
      ? f.onboardedBy.name
      : "—";

  /* ────────────────────────────────────────────────
     LOAD USERS + LOCATIONS (unchanged)
  ───────────────────────────────────────────────── */

  useEffect(() => {
    fetch(`${API}/api/users`)
      .then((r) => r.json())
      .then((data) => setUsers(data.data || data || []))
      .catch(() => {});

    fetch(`${API}/newlocations/states`)
      .then((r) => r.json())
      .then((j) => setStates(j.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!stateFilter) {
      setDistricts([]);
      setDistrictFilter("");
      setTaluks([]);
      setTalukFilter("");
      setVillages([]);
      setVillageFilter("");
      return;
    }
    fetch(
      `${API}/newlocations/districts?state=${encodeURIComponent(stateFilter)}`,
    )
      .then((r) => r.json())
      .then((j) => setDistricts(j.data || []));
  }, [stateFilter]);

  useEffect(() => {
    if (!stateFilter || !districtFilter) return;
    fetch(
      `${API}/newlocations/taluks?state=${encodeURIComponent(stateFilter)}&district=${encodeURIComponent(districtFilter)}`,
    )
      .then((r) => r.json())
      .then((j) => setTaluks(j.data || []));
  }, [stateFilter, districtFilter]);

  useEffect(() => {
    if (!stateFilter || !districtFilter || !talukFilter) return;
    fetch(
      `${API}/newlocations/villages?state=${encodeURIComponent(stateFilter)}&district=${encodeURIComponent(districtFilter)}&taluk=${encodeURIComponent(talukFilter)}`,
    )
      .then((r) => r.json())
      .then((j) => setVillages(j.data || []));
  }, [stateFilter, districtFilter, talukFilter]);

  /* ────────────────────────────────────────────────
     FETCH FARMERS (unchanged)
  ───────────────────────────────────────────────── */

  const fetchFarmers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let url = "";

      if (selectedUserId) {
        url = `${API}/api/farmer/onboarded/${selectedUserId}?page=${page}&limit=${LIMIT}`;
      } else {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: LIMIT.toString(),
          ...(cropName && { cropName }),
          ...(stateFilter && { state: stateFilter }),
          ...(districtFilter && { district: districtFilter }),
          ...(talukFilter && { taluk: talukFilter }),
          ...(villageFilter && { village: villageFilter }),
        });
        url = `${API}/api/farmer?${params.toString()}`;
      }

      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status} – ${text.slice(0, 100)}`);
      }

      const json = await res.json();
      const list = json.data || [];
      const pag = json.pagination || {};

      setFarmers(list);
      setTotal(pag.total || list.length || 0);
      setTotalPages(pag.totalPages || 1);

      if (pag.totalPages && page > pag.totalPages) {
        setPage(pag.totalPages);
      }
    } catch (err: any) {
      setError(err.message || "Could not load farmers");
    } finally {
      setLoading(false);
    }
  }, [
    page,
    selectedUserId,
    cropName,
    stateFilter,
    districtFilter,
    talukFilter,
    villageFilter,
  ]);

  useEffect(() => {
    fetchFarmers();
  }, [fetchFarmers]);

  /* ────────────────────────────────────────────────
     EDIT MODAL LOGIC (unchanged)
  ───────────────────────────────────────────────── */

  // const openEdit = (farmer: Farmer) => {
  //   const initialCrops = farmer.crops?.length
  //     ? [...farmer.crops]
  //     : farmer.cropType
  //       ? [
  //           {
  //             name: farmer.cropType,
  //             price: farmer.cropCost || "",
  //             additionalInfo: "",
  //           },
  //         ]
  //       : [{ name: "", price: "", additionalInfo: "" }];

  //   setEditFarmer(farmer);
  //   setEditForm({
  //     ...farmer,
  //     crops: initialCrops,

  //     payment: {
  //       type: farmer.payment?.type || farmer.paymentType || undefined, // ← change "" → undefined
  //       additionalInfo: farmer.payment?.additionalInfo || "",
  //     },
  //     droneSprayingConsent:
  //       typeof farmer.droneSprayingConsent === "object"
  //         ? { ...farmer.droneSprayingConsent }
  //         : { value: !!farmer.droneSprayingConsent, additionalInfo: "" },
  //     agronomistCareConsent:
  //       typeof farmer.agronomistCareConsent === "object"
  //         ? { ...farmer.agronomistCareConsent }
  //         : { value: !!farmer.agronomistCareConsent, additionalInfo: "" },
  //   });
  //   setEditOpen(true);
  // };
  const openEdit = (farmer: Farmer) => {
    const initialCrops = farmer.crops?.length
      ? [...farmer.crops]
      : farmer.cropType
        ? [
            {
              name: farmer.cropType,
              price: farmer.cropCost || "",
              additionalInfo: "",
            },
          ]
        : [{ name: "", price: "", additionalInfo: "" }];

    setEditFarmer(farmer);
    setEditForm({
      ...farmer,
      crops: initialCrops,
      payment: {
        type: farmer.payment?.type || farmer.paymentType || undefined, // ← fixed here
        additionalInfo: farmer.payment?.additionalInfo || "",
      },
      droneSprayingConsent:
        typeof farmer.droneSprayingConsent === "object"
          ? { ...farmer.droneSprayingConsent }
          : { value: !!farmer.droneSprayingConsent, additionalInfo: "" },
      agronomistCareConsent:
        typeof farmer.agronomistCareConsent === "object"
          ? { ...farmer.agronomistCareConsent }
          : { value: !!farmer.agronomistCareConsent, additionalInfo: "" },
    });
    setEditOpen(true);
  };
  const addCrop = () => {
    setEditForm((p) => ({
      ...p,
      crops: [...(p.crops || []), { name: "", price: "", additionalInfo: "" }],
    }));
  };

  const removeCrop = (idx: number) => {
    if ((editForm.crops?.length || 0) <= 1) return;
    setEditForm((p) => ({
      ...p,
      crops: p.crops?.filter((_, i) => i !== idx) || [],
    }));
  };

  const updateCrop = (idx: number, field: keyof Crop, value: string) => {
    setEditForm((p) => {
      const crops = [...(p.crops || [])];
      crops[idx] = { ...crops[idx], [field]: value };
      return { ...p, crops };
    });
  };

  const handleEditChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setEditForm((p) => ({ ...p, [name]: value }));
  };

  const handleConsentChange = (
    field: "droneSprayingConsent" | "agronomistCareConsent",
    key: "value" | "additionalInfo",
    val: any,
  ) => {
    setEditForm((p) => ({
      ...p,
      [field]: {
        ...((p[field] as any) || { value: false, additionalInfo: "" }),
        [key]: val,
      },
    }));
  };

  const handlePaymentChange = (key: keyof Payment, val: string) => {
    setEditForm((p) => ({
      ...p,
      payment: {
        ...(p.payment || {}),
        [key]: val,
      },
    }));
  };

  const saveEdit = async () => {
    if (!editFarmer) return;
    setSaving(true);

    try {
      const payload: any = {
        name: editForm.name?.trim(),
        phone: editForm.phone?.trim().replace(/\D/g, ""),
        crops:
          editForm.crops
            ?.filter((c) => c.name?.trim())
            .map((c) => ({
              name: c.name.trim(),
              price: c.price?.trim() || undefined,
              additionalInfo: c.additionalInfo?.trim() || undefined,
            })) || [],
        additionalCrops: editForm.additionalCrops?.trim() || undefined,
        state: editForm.state?.trim() || undefined,
        district: editForm.district?.trim() || undefined,
        taluk: editForm.taluk?.trim() || undefined,
        village: editForm.village?.trim() || undefined,
        landSize: editForm.landSize ? Number(editForm.landSize) : undefined,
        inputSupplier: editForm.inputSupplier?.trim() || undefined,
        additionalInfo: editForm.additionalInfo?.trim() || undefined,
        payment: editForm.payment?.type
          ? {
              type: editForm.payment.type,
              additionalInfo:
                editForm.payment.additionalInfo?.trim() || undefined,
            }
          : undefined,
        droneSprayingConsent: {
          value: !!editForm.droneSprayingConsent?.value,
          additionalInfo:
            editForm.droneSprayingConsent?.additionalInfo?.trim() || undefined,
        },
        agronomistCareConsent: {
          value: !!editForm.agronomistCareConsent?.value,
          additionalInfo:
            editForm.agronomistCareConsent?.additionalInfo?.trim() || undefined,
        },
      };

      const res = await fetch(`${API}/api/farmer/${editFarmer._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text());

      setEditOpen(false);
      fetchFarmers();
      alert("Farmer updated successfully");
    } catch (err: any) {
      alert("Save failed – check console");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  /* ────────────────────────────────────────────────
     RENDER – everything visible directly
  ───────────────────────────────────────────────── */

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-emerald-600" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Farmers Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={fetchFarmers}
              className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 shadow-sm"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
            <button
              onClick={() => {
                setSelectedUserId("");
                setCropName("");
                setStateFilter("");
                setDistrictFilter("");
                setTalukFilter("");
                setVillageFilter("");
                setPage(1);
              }}
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Clear all filters
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border rounded-xl p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1 font-medium">
              Onboarded by
            </label>
            <select
              value={selectedUserId}
              onChange={(e) => {
                setSelectedUserId(e.target.value);
                setPage(1);
              }}
              className="w-full border rounded-lg px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200"
            >
              <option value="">All users</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} {u.phone && ` • ${u.phone}`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1 font-medium">
              Crop
            </label>
            <select
              value={cropName}
              onChange={(e) => {
                setCropName(e.target.value);
                setPage(1);
              }}
              disabled={!!selectedUserId}
              className="w-full border rounded-lg px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200"
            >
              <option value="">All Crops</option>
              {[
                "Banana",
                "Dry Coconut",
                "Tender Coconut",
                "Turmeric",
                "Green Chilli",
                "Arecanut",
                "Tomato",
                "Cabbage",
                "Cauliflower",
                "Ginger",
              ].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1 font-medium">
              State
            </label>
            <select
              value={stateFilter}
              onChange={(e) => {
                setStateFilter(e.target.value);
                setPage(1);
              }}
              disabled={!!selectedUserId}
              className="w-full border rounded-lg px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200"
            >
              <option value="">All States</option>
              {states.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1 font-medium">
              District
            </label>
            <select
              value={districtFilter}
              onChange={(e) => {
                setDistrictFilter(e.target.value);
                setPage(1);
              }}
              disabled={!stateFilter || !!selectedUserId}
              className="w-full border rounded-lg px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200"
            >
              <option value="">All Districts</option>
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1 font-medium">
              Taluk
            </label>
            <select
              value={talukFilter}
              onChange={(e) => {
                setTalukFilter(e.target.value);
                setPage(1);
              }}
              disabled={!districtFilter || !!selectedUserId}
              className="w-full border rounded-lg px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200"
            >
              <option value="">All Taluks</option>
              {taluks.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1 font-medium">
              Village
            </label>
            <select
              value={villageFilter}
              onChange={(e) => {
                setVillageFilter(e.target.value);
                setPage(1);
              }}
              disabled={!talukFilter || !!selectedUserId}
              className="w-full border rounded-lg px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200"
            >
              <option value="">All Villages</option>
              {villages.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table – all information visible directly */}
        {loading ? (
          <div className="bg-white border rounded-xl p-16 text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-emerald-600" />
            <p className="mt-5 text-gray-600">Loading farmers...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-10 text-center">
            <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
            <p className="mt-4 text-red-700">{error}</p>
          </div>
        ) : farmers.length === 0 ? (
          <div className="bg-white border rounded-xl p-16 text-center text-gray-600">
            No farmers found{" "}
            {selectedUserId ? "for selected user" : "with current filters"}.
          </div>
        ) : (
          <>
            <div className="bg-white border rounded-xl overflow-x-auto shadow-sm">
              <table className="w-full min-w-[1800px] text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-gray-700">
                    <th className="px-6 py-4 text-left font-medium">Name</th>
                    <th className="px-6 py-4 text-left font-medium">Phone</th>
                    <th className="px-6 py-4 text-left font-medium">
                      Onboarded By
                    </th>
                    <th className="px-6 py-4 text-left font-medium">Crops</th>
                    <th className="px-6 py-4 text-left font-medium">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left font-medium">
                      Land (acres)
                    </th>
                    <th className="px-6 py-4 text-left font-medium">
                      Input Supplier
                    </th>
                    <th className="px-6 py-4 text-left font-medium">
                      Additional Info
                    </th>
                    <th className="px-6 py-4 text-left font-medium">Payment</th>
                    <th className="px-6 py-4 text-left font-medium">
                      Drone Consent
                    </th>
                    <th className="px-6 py-4 text-left font-medium">
                      Agronomist Consent
                    </th>
                    <th className="px-6 py-4 text-left font-medium">Photo</th>
                    <th className="px-6 py-4 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {farmers.map((f) => (
                    <tr key={f._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{f.name || "—"}</td>
                      <td className="px-6 py-4 font-mono">{f.phone || "—"}</td>
                      <td className="px-6 py-4">{getOnboardedByName(f)}</td>

                      {/* Crops – name, price, additionalInfo all visible */}
                      <td className="px-6 py-4 whitespace-normal leading-relaxed">
                        {getCropsDisplay(f)}
                      </td>

                      <td className="px-6 py-4">{getLocationDisplay(f)}</td>
                      <td className="px-6 py-4">{f.landSize ?? "—"}</td>
                      <td className="px-6 py-4">{f.inputSupplier || "—"}</td>
                      <td className="px-6 py-4 whitespace-normal leading-relaxed">
                        {f.additionalInfo || "—"}
                      </td>
                      <td className="px-6 py-4 capitalize">
                        {getPaymentDisplay(f)}
                      </td>

                      {/* Drone Consent – value + additionalInfo visible */}
                      <td className="px-6 py-4 whitespace-normal leading-relaxed">
                        {getDroneConsentDisplay(f)}
                      </td>

                      {/* Agronomist Consent – value + additionalInfo visible */}
                      <td className="px-6 py-4 whitespace-normal leading-relaxed">
                        {getAgronomistConsentDisplay(f)}
                      </td>

                      <td className="px-6 py-4">
                        {f.photo ? (
                          <button onClick={() => setPreviewPhoto(f.photo)}>
                            <img
                              src={f.photo}
                              alt="Farmer"
                              className="w-10 h-10 object-cover rounded border hover:border-emerald-500"
                              loading="lazy"
                            />
                          </button>
                        ) : (
                          <ImageIcon className="text-gray-400" size={32} />
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <button
                          onClick={() => openEdit(f)}
                          className="text-emerald-600 hover:text-emerald-800 text-sm font-medium flex items-center gap-1"
                        >
                          <Pencil size={14} /> Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-wrap justify-center items-center gap-2 mt-8">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="p-3 border rounded disabled:opacity-40 hover:bg-gray-100"
                >
                  <ChevronLeft size={18} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`px-4 py-2 border rounded min-w-[48px] font-medium ${
                        p === page
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-white hover:bg-gray-50"
                      }`}
                    >
                      {p}
                    </button>
                  ),
                )}

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="p-3 border rounded disabled:opacity-40 hover:bg-gray-100"
                >
                  <ChevronRight size={18} />
                </button>

                <div className="ml-6 text-sm text-gray-700 font-medium">
                  Showing {farmers.length} of {total} farmers
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Photo Preview */}
      {previewPhoto && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewPhoto(null)}
        >
          <div
            className="relative max-w-5xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute -top-14 right-0 text-white bg-black/50 p-3 rounded-full hover:bg-black/70"
              onClick={() => setPreviewPhoto(null)}
            >
              <X size={28} />
            </button>
            <img
              src={previewPhoto}
              alt="Farmer photo"
              className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl border-4 border-white"
            />
          </div>
        </div>
      )}

      {/* Edit Modal – unchanged, already supports all fields */}
      {editOpen && editFarmer && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold">Edit Farmer</h2>
              <button onClick={() => setEditOpen(false)}>
                <X size={24} className="text-gray-600 hover:text-gray-800" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Name *
                  </label>
                  <input
                    name="name"
                    value={editForm.name || ""}
                    onChange={handleEditChange}
                    className="w-full border rounded-lg px-4 py-2 focus:border-emerald-500 focus:ring-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Phone *
                  </label>
                  <input
                    name="phone"
                    value={editForm.phone || ""}
                    onChange={handleEditChange}
                    className="w-full border rounded-lg px-4 py-2 focus:border-emerald-500 focus:ring-1"
                  />
                </div>
              </div>

              {/* Crops */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium">
                    Crops Grown
                  </label>
                  <button
                    type="button"
                    onClick={addCrop}
                    className="text-sm text-emerald-600 hover:underline flex items-center gap-1"
                  >
                    + Add Crop
                  </button>
                </div>

                {editForm.crops?.map((crop, idx) => (
                  <div
                    key={idx}
                    className="border rounded-lg p-4 mb-4 bg-gray-50"
                  >
                    <div className="flex justify-between mb-3">
                      <span className="font-medium">Crop {idx + 1}</span>
                      {editForm.crops!.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeCrop(idx)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <select
                      value={crop.name}
                      onChange={(e) => updateCrop(idx, "name", e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 mb-2"
                    >
                      <option value="">Select crop</option>
                      {[
                        "Banana",
                        "Turmeric",
                        "Tomato",
                        "Ginger",
                        "Chilli",
                        "Arecanut",
                        "Coconut",
                        "Other",
                      ].map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>

                    <input
                      placeholder="Expected Price (₹)"
                      value={crop.price || ""}
                      onChange={(e) => updateCrop(idx, "price", e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 mb-2"
                    />

                    <input
                      placeholder="Variety / notes / season / additional info"
                      value={crop.additionalInfo || ""}
                      onChange={(e) =>
                        updateCrop(idx, "additionalInfo", e.target.value)
                      }
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                ))}
              </div>

              {/* Location & other */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    State
                  </label>
                  <input
                    name="state"
                    value={editForm.state || ""}
                    onChange={handleEditChange}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    District
                  </label>
                  <input
                    name="district"
                    value={editForm.district || ""}
                    onChange={handleEditChange}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Taluk
                  </label>
                  <input
                    name="taluk"
                    value={editForm.taluk || ""}
                    onChange={handleEditChange}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Village
                  </label>
                  <input
                    name="village"
                    value={editForm.village || ""}
                    onChange={handleEditChange}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Land Size (acres)
                  </label>
                  <input
                    name="landSize"
                    type="number"
                    value={editForm.landSize ?? ""}
                    onChange={handleEditChange}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Input Supplier
                  </label>
                  <input
                    name="inputSupplier"
                    value={editForm.inputSupplier || ""}
                    onChange={handleEditChange}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Additional Crops / Notes
                </label>
                <textarea
                  name="additionalCrops"
                  value={editForm.additionalCrops || ""}
                  onChange={handleEditChange}
                  className="w-full border rounded-lg px-4 py-2 min-h-[90px]"
                />
              </div>

              {/* Payment & Consents */}
              <div className="bg-gray-50 p-5 rounded-xl space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Payment Type
                    </label>
                    {/* <select
                      value={editForm.payment?.type || ""}
                      onChange={(e) =>
                        handlePaymentChange("type", e.target.value)
                      }
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      <option value="">None</option>
                      <option value="cash">Cash</option>
                      <option value="credit">Credit</option>
                    </select> */}
                    <select
                      value={editForm.payment?.type ?? ""} // ← use ?? "" so undefined becomes ""
                      onChange={(e) =>
                        handlePaymentChange("type", e.target.value)
                      }
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      <option value="">None / Not set</option>
                      <option value="cash">Cash</option>
                      <option value="credit">Credit</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Payment Notes
                    </label>
                    <input
                      value={editForm.payment?.additionalInfo || ""}
                      onChange={(e) =>
                        handlePaymentChange("additionalInfo", e.target.value)
                      }
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                </div>

                {/* Drone */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Drone Spraying Consent
                  </label>
                  <div className="flex items-center gap-3 mb-2">
                    <input
                      type="checkbox"
                      checked={!!editForm.droneSprayingConsent?.value}
                      onChange={(e) =>
                        handleConsentChange(
                          "droneSprayingConsent",
                          "value",
                          e.target.checked,
                        )
                      }
                    />
                    <span>Consent given</span>
                  </div>
                  <input
                    placeholder="Notes / acres / date / additional info"
                    value={editForm.droneSprayingConsent?.additionalInfo || ""}
                    onChange={(e) =>
                      handleConsentChange(
                        "droneSprayingConsent",
                        "additionalInfo",
                        e.target.value,
                      )
                    }
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                {/* Agronomist */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Agronomist Care Consent
                  </label>
                  <div className="flex items-center gap-3 mb-2">
                    <input
                      type="checkbox"
                      checked={!!editForm.agronomistCareConsent?.value}
                      onChange={(e) =>
                        handleConsentChange(
                          "agronomistCareConsent",
                          "value",
                          e.target.checked,
                        )
                      }
                    />
                    <span>Consent given</span>
                  </div>
                  <input
                    placeholder="Notes / agreement details / additional info"
                    value={editForm.agronomistCareConsent?.additionalInfo || ""}
                    onChange={(e) =>
                      handleConsentChange(
                        "agronomistCareConsent",
                        "additionalInfo",
                        e.target.value,
                      )
                    }
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              </div>
            </div>

            <div className="border-t px-6 py-5 flex justify-end gap-4 sticky bottom-0 bg-white z-10">
              <button
                onClick={() => setEditOpen(false)}
                disabled={saving}
                className="px-6 py-2.5 border rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                disabled={saving}
                className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
