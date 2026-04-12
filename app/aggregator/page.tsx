"use client";

import { useEffect, useState } from "react";
import { Pencil, Image as ImageIcon, Loader2, X } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL!;

/* ================= TYPES ================= */

type Aggregator = {
  _id: string;
  name: string;
  mobileNumber: string;
  gstNo: string;
  panNo: string;
  aadharNo: string;
  village: string;
  taluk: string;
  district: string;
  state: string;
  productDealing: string[] | string;
  capacityOfDealing: string;
  currentlySupplyTo: string;
  supplyLocation: string;
  selfieImage: string;
  storeImage: string;
};

type ApiResponse = {
  data: Aggregator[];
  total: number;
  page: number;
  totalPages: number;
};

/* ================= PAGE ================= */

export default function AggregatorsDashboard() {
  const [list, setList] = useState<Aggregator[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [previewImg, setPreviewImg] = useState<string | null>(null);

  const [editAgg, setEditAgg] = useState<Aggregator | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAggregators();
  }, [page, search]);

  const fetchAggregators = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${API}/api/aggregators?page=${page}&limit=10&search=${encodeURIComponent(
          search,
        )}`,
        { cache: "no-store" },
      );

      if (!res.ok) throw new Error("Fetch failed");

      const data: ApiResponse = await res.json();

      setList(data.data);
      setTotalPages(data.totalPages);
    } catch (e) {
      console.error("Fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  /* ================= EDIT ================= */

  const handleEdit = (agg: Aggregator) => {
    setEditAgg({ ...agg });
  };

  const saveEdit = async () => {
    if (!editAgg) return;

    try {
      setSaving(true);

      const payload = {
        ...editAgg,
        productDealing: Array.isArray(editAgg.productDealing)
          ? editAgg.productDealing
          : editAgg.productDealing.split(",").map((s) => s.trim()),
      };

      const res = await fetch(`${API}/api/aggregators/${editAgg._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Update failed");

      setEditAgg(null);
      fetchAggregators();
    } catch (e) {
      console.error("Update error:", e);
      alert("Failed to update aggregator");
    } finally {
      setSaving(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-50/40 p-5 md:p-8">
      <div className="mx-auto max-w-screen-2xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Aggregator Dashboard
          </h1>

          <input
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:max-w-xs"
            placeholder="Search name, mobile, village..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
        </div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1400px] text-sm text-gray-700">
              <thead className="bg-gray-100 text-xs uppercase tracking-wider text-gray-600">
                <tr>
                  <th className="sticky left-0 bg-gray-100 px-4 py-3 text-left">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left">Mobile</th>
                  <th className="px-3 py-3">GST</th>
                  <th className="px-3 py-3">PAN</th>
                  <th className="px-3 py-3">Aadhaar</th>
                  <th className="px-4 py-3">Village</th>
                  <th className="px-4 py-3">Taluk</th>
                  <th className="px-4 py-3">District</th>
                  <th className="px-4 py-3">State</th>
                  <th className="px-4 py-3">Products</th>
                  <th className="px-4 py-3">Capacity</th>
                  <th className="px-4 py-3">Supply To</th>
                  <th className="px-4 py-3">Supply Loc</th>
                  <th className="px-3 py-3 text-center">Selfie</th>
                  <th className="px-3 py-3 text-center">Store</th>
                  <th className="sticky right-0 bg-gray-100 px-4 py-3 text-center">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y text-black">
                {loading ? (
                  <tr>
                    <td colSpan={16} className="py-16 text-center">
                      <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                    </td>
                  </tr>
                ) : list.length === 0 ? (
                  <tr>
                    <td
                      colSpan={16}
                      className="py-16 text-center text-gray-500"
                    >
                      No aggregators found
                    </td>
                  </tr>
                ) : (
                  list.map((a, idx) => (
                    <tr key={a._id} className={idx % 2 ? "bg-gray-50/40" : ""}>
                      <td className="sticky left-0 bg-inherit px-4 py-3 font-medium">
                        {a.name}
                      </td>
                      <td className="px-4 py-3">{a.mobileNumber}</td>
                      <td className="px-3 py-3 text-xs">{a.gstNo || "—"}</td>
                      <td className="px-3 py-3 text-xs">{a.panNo || "—"}</td>
                      <td className="px-3 py-3 text-xs">{a.aadharNo || "—"}</td>
                      <td className="px-4 py-3">{a.village || "—"}</td>
                      <td className="px-4 py-3">{a.taluk || "—"}</td>
                      <td className="px-4 py-3">{a.district || "—"}</td>
                      <td className="px-4 py-3">{a.state || "—"}</td>
                      <td className="px-4 py-3 max-w-xs truncate">
                        {Array.isArray(a.productDealing)
                          ? a.productDealing.join(", ")
                          : a.productDealing || "—"}
                      </td>
                      <td className="px-4 py-3">
                        {a.capacityOfDealing || "—"}
                      </td>
                      <td className="px-4 py-3">
                        {a.currentlySupplyTo || "—"}
                      </td>
                      <td className="px-4 py-3">{a.supplyLocation || "—"}</td>

                      <td className="px-3 py-3 text-center">
                        {a.selfieImage ? (
                          <img
                            src={a.selfieImage}
                            alt="Selfie"
                            className="mx-auto h-4 w-4 rounded-full object-cover border cursor-pointer hover:scale-110 transition"
                            onClick={() => setPreviewImg(a.selfieImage)}
                          />
                        ) : (
                          <ImageIcon className="mx-auto h-6 w-6 text-gray-300" />
                        )}
                      </td>

                      <td className="px-3 py-3 text-center">
                        {a.storeImage ? (
                          <img
                            src={a.storeImage}
                            alt="Store"
                            className="mx-auto h-4 w-4 rounded object-cover border cursor-pointer hover:scale-110 transition"
                            onClick={() => setPreviewImg(a.storeImage)}
                          />
                        ) : (
                          <ImageIcon className="mx-auto h-6 w-6 text-gray-300" />
                        )}
                      </td>

                      <td className="sticky right-0 bg-inherit px-4 py-3 text-center">
                        <button
                          onClick={() => handleEdit(a)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-3 py-1.5 text-xs text-white hover:bg-blue-700"
                        >
                          <Pencil size={14} /> Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINATION */}
        {!loading && totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>

            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded border px-4 py-2 text-sm disabled:opacity-50"
              >
                Prev
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded border px-4 py-2 text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* IMAGE PREVIEW MODAL */}
      {previewImg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setPreviewImg(null)}
        >
          <div className="bg-white p-3 rounded-lg">
            <img
              src={previewImg}
              className="max-h-[85vh] max-w-[85vw] rounded"
            />
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editAgg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Edit Aggregator</h2>
              <button onClick={() => setEditAgg(null)}>
                <X />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <input
                className="border p-2 rounded"
                value={editAgg.name}
                onChange={(e) =>
                  setEditAgg({ ...editAgg, name: e.target.value })
                }
                placeholder="Name"
              />

              <input
                className="border p-2 rounded"
                value={editAgg.mobileNumber}
                onChange={(e) =>
                  setEditAgg({ ...editAgg, mobileNumber: e.target.value })
                }
                placeholder="Mobile"
              />

              <input
                className="border p-2 rounded"
                value={editAgg.village}
                onChange={(e) =>
                  setEditAgg({ ...editAgg, village: e.target.value })
                }
                placeholder="Village"
              />

              <input
                className="border p-2 rounded"
                value={editAgg.taluk}
                onChange={(e) =>
                  setEditAgg({ ...editAgg, taluk: e.target.value })
                }
                placeholder="Taluk"
              />

              <input
                className="border p-2 rounded"
                value={editAgg.district}
                onChange={(e) =>
                  setEditAgg({ ...editAgg, district: e.target.value })
                }
                placeholder="District"
              />

              <input
                className="border p-2 rounded"
                value={editAgg.state}
                onChange={(e) =>
                  setEditAgg({ ...editAgg, state: e.target.value })
                }
                placeholder="State"
              />

              <input
                className="border p-2 rounded col-span-2"
                value={
                  Array.isArray(editAgg.productDealing)
                    ? editAgg.productDealing.join(",")
                    : editAgg.productDealing || ""
                }
                onChange={(e) =>
                  setEditAgg({
                    ...editAgg,
                    productDealing: e.target.value,
                  })
                }
                placeholder="Products (comma separated)"
              />

              <input
                className="border p-2 rounded col-span-2"
                value={editAgg.capacityOfDealing}
                onChange={(e) =>
                  setEditAgg({
                    ...editAgg,
                    capacityOfDealing: e.target.value,
                  })
                }
                placeholder="Capacity"
              />

              <input
                className="border p-2 rounded col-span-2"
                value={editAgg.currentlySupplyTo}
                onChange={(e) =>
                  setEditAgg({
                    ...editAgg,
                    currentlySupplyTo: e.target.value,
                  })
                }
                placeholder="Supply To"
              />

              <input
                className="border p-2 rounded col-span-2"
                value={editAgg.supplyLocation}
                onChange={(e) =>
                  setEditAgg({
                    ...editAgg,
                    supplyLocation: e.target.value,
                  })
                }
                placeholder="Supply Location"
              />
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setEditAgg(null)}
                className="rounded border px-4 py-2"
              >
                Cancel
              </button>

              <button
                disabled={saving}
                onClick={saveEdit}
                className="rounded bg-blue-600 px-5 py-2 text-white disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// "use client";

// import { useEffect, useState } from "react";
// import {
//   Pencil,
//   Image as ImageIcon,
//   Loader2,
//   X,
//   Search,
//   RefreshCw,
//   User,
//   MapPin,
//   Building,
//   FileText,
// } from "lucide-react";

// const API = process.env.NEXT_PUBLIC_API_URL!;

// type Aggregator = {
//   _id: string;
//   name: string;
//   mobileNumber: string;
//   gstNo: string;
//   panNo: string;
//   aadharNo: string;
//   village: string;
//   taluk: string;
//   district: string;
//   state: string;
//   productDealing: string[] | string;
//   capacityOfDealing: string;
//   currentlySupplyTo: string;
//   supplyLocation: string;
//   selfieImage: string;
//   storeImage: string;
// };

// type ApiResponse = {
//   data: Aggregator[];
//   total: number;
//   page: number;
//   totalPages: number;
// };

// export default function AggregatorsDashboard() {
//   const [aggregators, setAggregators] = useState<Aggregator[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const [previewImg, setPreviewImg] = useState<string | null>(null);
//   const [editAgg, setEditAgg] = useState<Aggregator | null>(null);
//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     fetchAggregators();
//   }, [page, search]);

//   const fetchAggregators = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch(
//         `${API}/api/aggregators?page=${page}&limit=10&search=${encodeURIComponent(search)}`,
//         { cache: "no-store" },
//       );

//       if (!res.ok) throw new Error("Failed to load aggregators");

//       const data: ApiResponse = await res.json();
//       setAggregators(data.data);
//       setTotalPages(data.totalPages);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (agg: Aggregator) => {
//     setEditAgg({ ...agg });
//   };

//   const saveEdit = async () => {
//     if (!editAgg) return;

//     try {
//       setSaving(true);

//       const payload = {
//         ...editAgg,
//         productDealing: Array.isArray(editAgg.productDealing)
//           ? editAgg.productDealing
//           : editAgg.productDealing.split(",").map((s) => s.trim()),
//       };

//       const res = await fetch(`${API}/api/aggregators/${editAgg._id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) throw new Error("Update failed");

//       setEditAgg(null);
//       fetchAggregators();
//     } catch (err) {
//       console.error(err);
//       alert("Failed to save changes");
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50/70 pb-12">
//       <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
//         {/* Header + Controls */}
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
//           <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
//             <User className="h-8 w-8 text-indigo-600" />
//             Aggregator Dashboard
//           </h1>

//           <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
//             <div className="relative flex-1">
//               <input
//                 type="text"
//                 placeholder="Search name, mobile, village, taluk..."
//                 value={search}
//                 onChange={(e) => {
//                   setPage(1);
//                   setSearch(e.target.value);
//                 }}
//                 className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm"
//               />
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//             </div>

//             <button
//               onClick={fetchAggregators}
//               disabled={loading}
//               className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-60 transition shadow-sm whitespace-nowrap"
//             >
//               <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
//               Refresh
//             </button>
//           </div>
//         </div>

//         {/* Loading Skeleton */}
//         {loading && (
//           <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//             {[...Array(8)].map((_, i) => (
//               <div
//                 key={i}
//                 className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 animate-pulse"
//               >
//                 <div className="flex items-center gap-4 mb-4">
//                   <div className="h-14 w-14 bg-gray-200 rounded-full" />
//                   <div className="flex-1 space-y-2">
//                     <div className="h-5 w-40 bg-gray-200 rounded" />
//                     <div className="h-4 w-32 bg-gray-200 rounded" />
//                   </div>
//                 </div>
//                 <div className="space-y-3">
//                   <div className="h-4 bg-gray-200 rounded w-3/4" />
//                   <div className="h-4 bg-gray-200 rounded w-1/2" />
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Table / Content */}
//         {!loading && (
//           <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
//             <div className="overflow-x-auto">
//               <table className="w-full min-w-[1400px] text-sm text-gray-700">
//                 <thead className="bg-gradient-to-r from-gray-50 to-gray-100 text-xs uppercase tracking-wider text-gray-600 border-b">
//                   <tr>
//                     <th className="sticky left-0 z-10 bg-gradient-to-r from-gray-50 to-gray-100 px-5 py-4 text-left font-semibold">
//                       Name
//                     </th>
//                     <th className="px-5 py-4 text-left font-semibold">
//                       Mobile
//                     </th>
//                     <th className="px-4 py-4 text-left font-semibold">GST</th>
//                     <th className="px-4 py-4 text-left font-semibold">PAN</th>
//                     <th className="px-4 py-4 text-left font-semibold">
//                       Aadhaar
//                     </th>
//                     <th className="px-5 py-4 text-left font-semibold">
//                       Village
//                     </th>
//                     <th className="px-5 py-4 text-left font-semibold">Taluk</th>
//                     <th className="px-5 py-4 text-left font-semibold">
//                       District
//                     </th>
//                     <th className="px-5 py-4 text-left font-semibold">State</th>
//                     <th className="px-5 py-4 text-left font-semibold">
//                       Products
//                     </th>
//                     <th className="px-5 py-4 text-left font-semibold">
//                       Capacity
//                     </th>
//                     <th className="px-5 py-4 text-left font-semibold">
//                       Supply To
//                     </th>
//                     <th className="px-5 py-4 text-left font-semibold">
//                       Supply Loc
//                     </th>
//                     <th className="px-4 py-4 text-center font-semibold">
//                       Selfie
//                     </th>
//                     <th className="px-4 py-4 text-center font-semibold">
//                       Store
//                     </th>
//                     <th className="sticky right-0 z-10 bg-gradient-to-r from-gray-100 to-gray-50 px-5 py-4 text-center font-semibold">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y divide-gray-100">
//                   {aggregators.length === 0 ? (
//                     <tr>
//                       <td
//                         colSpan={16}
//                         className="py-16 text-center text-gray-500"
//                       >
//                         No aggregators found
//                       </td>
//                     </tr>
//                   ) : (
//                     aggregators.map((agg, idx) => (
//                       <tr
//                         key={agg._id}
//                         className={`hover:bg-indigo-50/30 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}
//                       >
//                         <td className="sticky left-0 z-0 bg-inherit px-5 py-4 font-medium text-gray-900">
//                           {agg.name}
//                         </td>
//                         <td className="px-5 py-4 font-mono">
//                           {agg.mobileNumber || "—"}
//                         </td>
//                         <td className="px-4 py-4 text-xs font-mono">
//                           {agg.gstNo || "—"}
//                         </td>
//                         <td className="px-4 py-4 text-xs font-mono">
//                           {agg.panNo || "—"}
//                         </td>
//                         <td className="px-4 py-4 text-xs font-mono">
//                           {agg.aadharNo || "—"}
//                         </td>
//                         <td className="px-5 py-4">{agg.village || "—"}</td>
//                         <td className="px-5 py-4">{agg.taluk || "—"}</td>
//                         <td className="px-5 py-4">{agg.district || "—"}</td>
//                         <td className="px-5 py-4">{agg.state || "—"}</td>
//                         <td className="px-5 py-4 max-w-xs truncate">
//                           {Array.isArray(agg.productDealing)
//                             ? agg.productDealing.join(", ")
//                             : agg.productDealing || "—"}
//                         </td>
//                         <td className="px-5 py-4">
//                           {agg.capacityOfDealing || "—"}
//                         </td>
//                         <td className="px-5 py-4">
//                           {agg.currentlySupplyTo || "—"}
//                         </td>
//                         <td className="px-5 py-4">
//                           {agg.supplyLocation || "—"}
//                         </td>

//                         <td className="px-4 py-4 text-center">
//                           {agg.selfieImage ? (
//                             <img
//                               src={agg.selfieImage}
//                               alt="Selfie"
//                               className="mx-auto h-10 w-10 rounded-full object-cover border border-gray-200 cursor-pointer hover:scale-110 hover:shadow-md transition-all duration-200"
//                               onClick={() => setPreviewImg(agg.selfieImage)}
//                             />
//                           ) : (
//                             <div className="mx-auto h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
//                               <User className="h-5 w-5 text-gray-400" />
//                             </div>
//                           )}
//                         </td>

//                         <td className="px-4 py-4 text-center">
//                           {agg.storeImage ? (
//                             <img
//                               src={agg.storeImage}
//                               alt="Store"
//                               className="mx-auto h-10 w-10 rounded object-cover border border-gray-200 cursor-pointer hover:scale-110 hover:shadow-md transition-all duration-200"
//                               onClick={() => setPreviewImg(agg.storeImage)}
//                             />
//                           ) : (
//                             <div className="mx-auto h-10 w-10 rounded bg-gray-100 flex items-center justify-center">
//                               <Building className="h-5 w-5 text-gray-400" />
//                             </div>
//                           )}
//                         </td>

//                         <td className="sticky right-0 z-0 bg-inherit px-5 py-4 text-center">
//                           <button
//                             onClick={() => handleEdit(agg)}
//                             className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition shadow-sm"
//                           >
//                             <Pencil size={14} />
//                             Edit
//                           </button>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

//         {/* Pagination */}
//         {!loading && totalPages > 1 && (
//           <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
//             <span className="text-sm text-gray-600">
//               Showing page <strong>{page}</strong> of{" "}
//               <strong>{totalPages}</strong>
//             </span>

//             <div className="flex items-center gap-3">
//               <button
//                 disabled={page === 1}
//                 onClick={() => setPage((p) => Math.max(1, p - 1))}
//                 className="px-5 py-2.5 bg-white border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition"
//               >
//                 Previous
//               </button>
//               <button
//                 disabled={page === totalPages}
//                 onClick={() => setPage((p) => p + 1)}
//                 className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg disabled:opacity-50 hover:bg-indigo-700 transition shadow-sm"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Image Preview Modal */}
//       {previewImg && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
//           onClick={() => setPreviewImg(null)}
//         >
//           <div className="relative max-w-4xl max-h-[90vh] rounded-xl overflow-hidden shadow-2xl">
//             <button
//               onClick={() => setPreviewImg(null)}
//               className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition"
//             >
//               <X size={20} />
//             </button>
//             <img
//               src={previewImg}
//               alt="Preview"
//               className="max-h-[90vh] max-w-full object-contain"
//             />
//           </div>
//         </div>
//       )}

//       {/* Edit Modal */}
//       {editAgg && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
//           <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
//             <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-5 text-white flex items-center justify-between">
//               <h2 className="text-xl font-semibold flex items-center gap-3">
//                 <Pencil size={20} />
//                 Edit Aggregator
//               </h2>
//               <button
//                 onClick={() => setEditAgg(null)}
//                 className="p-2 hover:bg-white/20 rounded-full transition"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
//               {/* Name & Mobile */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                   Name
//                 </label>
//                 <input
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//                   value={editAgg.name}
//                   onChange={(e) =>
//                     setEditAgg({ ...editAgg, name: e.target.value })
//                   }
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                   Mobile Number
//                 </label>
//                 <input
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//                   value={editAgg.mobileNumber}
//                   onChange={(e) =>
//                     setEditAgg({ ...editAgg, mobileNumber: e.target.value })
//                   }
//                 />
//               </div>

//               {/* Location Fields */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                   Village
//                 </label>
//                 <input
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//                   value={editAgg.village}
//                   onChange={(e) =>
//                     setEditAgg({ ...editAgg, village: e.target.value })
//                   }
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                   Taluk
//                 </label>
//                 <input
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//                   value={editAgg.taluk}
//                   onChange={(e) =>
//                     setEditAgg({ ...editAgg, taluk: e.target.value })
//                   }
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                   District
//                 </label>
//                 <input
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//                   value={editAgg.district}
//                   onChange={(e) =>
//                     setEditAgg({ ...editAgg, district: e.target.value })
//                   }
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                   State
//                 </label>
//                 <input
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//                   value={editAgg.state}
//                   onChange={(e) =>
//                     setEditAgg({ ...editAgg, state: e.target.value })
//                   }
//                 />
//               </div>

//               {/* Products & Capacity */}
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                   Products Dealing (comma separated)
//                 </label>
//                 <input
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//                   value={
//                     Array.isArray(editAgg.productDealing)
//                       ? editAgg.productDealing.join(", ")
//                       : editAgg.productDealing || ""
//                   }
//                   onChange={(e) =>
//                     setEditAgg({ ...editAgg, productDealing: e.target.value })
//                   }
//                 />
//               </div>

//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                   Capacity of Dealing
//                 </label>
//                 <input
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//                   value={editAgg.capacityOfDealing}
//                   onChange={(e) =>
//                     setEditAgg({
//                       ...editAgg,
//                       capacityOfDealing: e.target.value,
//                     })
//                   }
//                 />
//               </div>

//               {/* Supply Info */}
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                   Currently Supply To
//                 </label>
//                 <input
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//                   value={editAgg.currentlySupplyTo}
//                   onChange={(e) =>
//                     setEditAgg({
//                       ...editAgg,
//                       currentlySupplyTo: e.target.value,
//                     })
//                   }
//                 />
//               </div>

//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                   Supply Location
//                 </label>
//                 <input
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//                   value={editAgg.supplyLocation}
//                   onChange={(e) =>
//                     setEditAgg({ ...editAgg, supplyLocation: e.target.value })
//                   }
//                 />
//               </div>
//             </div>

//             <div className="px-6 py-5 bg-gray-50 border-t flex justify-end gap-4">
//               <button
//                 onClick={() => setEditAgg(null)}
//                 className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 disabled={saving}
//                 onClick={saveEdit}
//                 className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60 transition shadow-sm"
//               >
//                 {saving && <Loader2 className="h-4 w-4 animate-spin" />}
//                 {saving ? "Saving..." : "Save Changes"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
