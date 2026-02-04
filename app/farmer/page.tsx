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
"use client";

import { useEffect, useState } from "react";
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

/* ================= BASE URLS ================= */
const API_BASE = "https://markhet-internal-ngfs.onrender.com";
const API = process.env.NEXT_PUBLIC_API_URL!;

/* ================= TYPES ================= */
type Farmer = {
  _id: string;
  name: string;
  phone: string;
  cropType: string;
  state: string;
  district: string;
  taluk: string;
  village: string;
  landSize?: number;
  cropCost?: number | null;
  inputSupplier?: string;
  paymentType?: "credit" | "cash" | string;
  droneSprayingConsent?: boolean;
  agronomistCareConsent?: boolean;
  photo?: string; // Cloudinary or other public URL
  createdAt?: string;
  updatedAt?: string;
};

export default function FarmerDashboardPage() {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const LIMIT = 10;
  const PAGE_WINDOW = 5;

  // Filters
  const [cropType, setCropType] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [taluk, setTaluk] = useState("");
  const [village, setVillage] = useState("");

  // Location dropdown options
  const [states, setStates] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [taluks, setTaluks] = useState<string[]>([]);
  const [villages, setVillages] = useState<string[]>([]);

  // Edit modal
  const [openEdit, setOpenEdit] = useState(false);
  const [editFarmer, setEditFarmer] = useState<Farmer | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Farmer>>({});

  // Photo preview modal
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  /* ================= LOCATION FILTER DROPDOWNS ================= */
  useEffect(() => {
    fetch(`${API_BASE}/newlocations/states`)
      .then((r) => r.json())
      .then((j) => setStates(j.data || []));
  }, []);

  useEffect(() => {
    if (!state) return;
    setDistrict("");
    setTaluk("");
    setVillage("");
    setDistricts([]);
    setTaluks([]);
    setVillages([]);

    fetch(`${API_BASE}/newlocations/districts?state=${state}`)
      .then((r) => r.json())
      .then((j) => setDistricts(j.data || []));
  }, [state]);

  useEffect(() => {
    if (!district) return;
    setTaluk("");
    setVillage("");
    setTaluks([]);
    setVillages([]);

    fetch(`${API_BASE}/newlocations/taluks?state=${state}&district=${district}`)
      .then((r) => r.json())
      .then((j) => setTaluks(j.data || []));
  }, [district]);

  useEffect(() => {
    if (!taluk) return;
    setVillage("");
    setVillages([]);

    fetch(
      `${API_BASE}/newlocations/villages?state=${state}&district=${district}&taluk=${taluk}`,
    )
      .then((r) => r.json())
      .then((j) => setVillages(j.data || []));
  }, [taluk]);

  /* ================= FETCH FARMERS ================= */
  const fetchFarmers = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: String(page),
        limit: String(LIMIT),
        cropType,
        state,
        district,
        taluk,
        village,
      });

      const res = await fetch(`${API}/api/farmer?${params}`, {
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Failed to fetch farmers");

      const data = await res.json();
      setFarmers(data.data || []);
      setTotalPages(data.totalPages || 1);
    } catch {
      setError("Could not load farmers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmers();
  }, [page, cropType, state, district, taluk, village]);

  const resetPage = () => setPage(1);

  /* ================= PAGINATION RANGE ================= */
  const startPage = Math.floor((page - 1) / PAGE_WINDOW) * PAGE_WINDOW + 1;
  const endPage = Math.min(startPage + PAGE_WINDOW - 1, totalPages);

  /* ================= EDIT MODAL HANDLERS ================= */
  const openEditModal = (farmer: Farmer) => {
    setEditFarmer(farmer);
    setEditForm({ ...farmer });
    setOpenEdit(true);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBooleanChange = (name: keyof Farmer, checked: boolean) => {
    setEditForm((prev) => ({ ...prev, [name]: checked }));
  };

  const saveEdit = async () => {
    if (!editFarmer) return;

    try {
      setSavingEdit(true);
      const res = await fetch(`${API}/api/farmer/${editFarmer._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (!res.ok) throw new Error("Failed to update farmer");

      await fetchFarmers();
      setOpenEdit(false);
    } catch (err) {
      alert("Failed to save changes");
      console.error(err);
    } finally {
      setSavingEdit(false);
    }
  };

  /* ================= PHOTO PREVIEW ================= */
  const openPhotoPreview = (url: string) => {
    setPreviewPhoto(url);
  };

  const closePhotoPreview = () => {
    setPreviewPhoto(null);
  };

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen bg-gray-50/70 pb-12">
      <div className="max-w-8xl mx-auto px-4 pt-8 space-y-6">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-emerald-600" />
            <h1 className="text-2xl font-bold">Farmers</h1>
          </div>

          <button
            onClick={fetchFarmers}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {/* FILTERS */}
        <div className="bg-white border rounded-xl p-4 grid grid-cols-2 md:grid-cols-6 gap-4">
          <select
            className="border p-2 rounded"
            value={cropType}
            onChange={(e) => {
              resetPage();
              setCropType(e.target.value);
            }}
          >
            <option value="">All Crops</option>
            <option>Banana</option>
            <option>Dry Coconut</option>
            <option>Tender Coconut</option>
            <option>Turmeric</option>
          </select>

          <select
            className="border p-2 rounded"
            value={state}
            onChange={(e) => {
              resetPage();
              setState(e.target.value);
            }}
          >
            <option value="">All States</option>
            {states.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <select
            className="border p-2 rounded"
            value={district}
            disabled={!state}
            onChange={(e) => {
              resetPage();
              setDistrict(e.target.value);
            }}
          >
            <option value="">All Districts</option>
            {districts.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>

          <select
            className="border p-2 rounded"
            value={taluk}
            disabled={!district}
            onChange={(e) => {
              resetPage();
              setTaluk(e.target.value);
            }}
          >
            <option value="">All Taluks</option>
            {taluks.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>

          <select
            className="border p-2 rounded"
            value={village}
            disabled={!taluk}
            onChange={(e) => {
              resetPage();
              setVillage(e.target.value);
            }}
          >
            <option value="">All Villages</option>
            {villages.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </div>

        {/* TABLE */}
        {loading ? (
          <div className="bg-white border rounded-xl p-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-emerald-600" />
            <p className="mt-3 text-gray-500">Loading farmers...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto" />
            <p className="mt-3 text-red-700">{error}</p>
          </div>
        ) : farmers.length === 0 ? (
          <div className="bg-white border rounded-xl p-12 text-center text-gray-500">
            No farmers found matching the current filters.
          </div>
        ) : (
          <div className="bg-white border rounded-xl overflow-x-auto shadow-sm">
            <table className="w-full min-w-[1400px] text-sm">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="px-5 py-3 text-left font-medium">Name</th>
                  <th className="px-5 py-3 text-left font-medium">Phone</th>
                  <th className="px-5 py-3 text-left font-medium">Crop</th>
                  <th className="px-5 py-3 text-left font-medium">Location</th>
                  <th className="px-5 py-3 text-left font-medium">
                    Land (acres)
                  </th>
                  <th className="px-5 py-3 text-left font-medium">
                    Input Supplier
                  </th>
                  <th className="px-5 py-3 text-left font-medium">Payment</th>
                  <th className="px-5 py-3 text-left font-medium">
                    Drone Consent
                  </th>
                  <th className="px-5 py-3 text-left font-medium">
                    Agronomist Consent
                  </th>
                  <th className="px-5 py-3 text-left font-medium">Photo</th>
                  <th className="px-5 py-3 text-left font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {farmers.map((f) => (
                  <tr key={f._id} className="hover:bg-gray-50/60">
                    <td className="px-5 py-3">{f.name || "—"}</td>
                    <td className="px-5 py-3 font-mono">{f.phone || "—"}</td>
                    <td className="px-5 py-3">{f.cropType || "—"}</td>
                    <td className="px-5 py-3">
                      {f.village ? `${f.village}, ` : ""}
                      {f.taluk ? `${f.taluk}, ` : ""}
                      {f.district || "—"}
                    </td>
                    <td className="px-5 py-3">{f.landSize ?? "—"}</td>
                    <td className="px-5 py-3">{f.inputSupplier || "—"}</td>
                    <td className="px-5 py-3 capitalize">
                      {f.paymentType || "—"}
                    </td>
                    <td className="px-5 py-3">
                      {f.droneSprayingConsent ? (
                        <span className="text-green-600 font-medium">Yes</span>
                      ) : (
                        <span className="text-gray-400">No</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      {f.agronomistCareConsent ? (
                        <span className="text-green-600 font-medium">Yes</span>
                      ) : (
                        <span className="text-gray-400">No</span>
                      )}
                    </td>

                    {/* Photo column */}
                    <td className="px-5 py-3">
                      {f.photo ? (
                        <button
                          onClick={() => openPhotoPreview(f.photo!)}
                          className="block w-12 h-12 rounded-md overflow-hidden border border-gray-200 hover:border-emerald-500 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        >
                          <img
                            src={f.photo}
                            alt={`${f.name} photo`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </button>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>

                    <td className="px-5 py-3">
                      <button
                        onClick={() => openEditModal(f)}
                        className="flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 text-sm"
                      >
                        <Pencil size={14} /> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINATION */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              disabled={startPage === 1}
              onClick={() => setPage(startPage - 1)}
              className="p-2 border rounded disabled:opacity-40 hover:bg-gray-100"
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: endPage - startPage + 1 }).map((_, i) => {
              const p = startPage + i;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1.5 border rounded text-sm font-medium ${
                    p === page
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  {p}
                </button>
              );
            })}

            <button
              disabled={endPage === totalPages}
              onClick={() => setPage(endPage + 1)}
              className="p-2 border rounded disabled:opacity-40 hover:bg-gray-100"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* ================= EDIT MODAL ================= */}
      {openEdit && editFarmer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-gray-800">Edit Farmer</h2>
              <button
                onClick={() => setOpenEdit(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {editForm.photo && (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-32 h-32 rounded-lg overflow-hidden border bg-gray-50">
                    <img
                      src={editForm.photo}
                      alt="Farmer photo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Current photo</p>
                </div>
              )}

              {/* rest of edit form ... */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* name, phone, cropType, landSize, inputSupplier, paymentType, cropCost */}
                {/* ... same as before ... */}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                {/* consents */}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Photo URL (optional)
                </label>
                <input
                  type="text"
                  name="photo"
                  value={editForm.photo || ""}
                  onChange={handleFormChange}
                  placeholder="https://..."
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="border-t px-6 py-4 flex justify-end gap-3 sticky bottom-0 bg-white">
              <button
                onClick={() => setOpenEdit(false)}
                disabled={savingEdit}
                className="px-5 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                disabled={savingEdit}
                className="px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2"
              >
                {savingEdit ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= PHOTO PREVIEW MODAL ================= */}
      {previewPhoto && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={closePhotoPreview}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closePhotoPreview}
              className="absolute top-3 right-3 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition z-10"
            >
              <X size={24} />
            </button>

            <img
              src={previewPhoto}
              alt="Farmer photo - full view"
              className="max-w-full max-h-[90vh] object-contain"
            />

            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-center py-2 text-sm">
              Farmer photo
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
