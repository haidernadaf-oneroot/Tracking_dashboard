// "use client";

// import { useEffect, useRef, useState } from "react";
// import { useParams } from "next/navigation";

// const API = process.env.NEXT_PUBLIC_API_URL!;

// export default function VisitViewPage() {
//   const params = useParams();
//   const visitId = params.visitId as string;

//   const mapRef = useRef<HTMLDivElement>(null);
//   const [data, setData] = useState<any>(null);

//   // ✅ HIT: /api/dashboard/visit/:visitId
//   useEffect(() => {
//     if (!visitId) return;

//     console.log("Fetching visit:", visitId);

//     fetch(`${API}/api/dashboard/visit/${visitId}`)
//       .then((r) => r.json())
//       .then((d) => {
//         console.log("Visit data:", d);
//         setData(d);
//       })
//       .catch((e) => console.error("Visit fetch error:", e));
//   }, [visitId]);

//   // ✅ MAP
//   useEffect(() => {
//     if (!mapRef.current || !data?.visit || !window.google) return;

//     const pos = {
//       lat: data.visit.latitude,
//       lng: data.visit.longitude,
//     };

//     const map = new google.maps.Map(mapRef.current, {
//       zoom: 16,
//       center: pos,
//     });

//     new google.maps.Marker({ position: pos, map });
//   }, [data]);

//   if (!data) return <p>Loading...</p>;

//   return (
//     <div className="space-y-4">
//       <h1 className="text-xl font-bold">{data.user.name}</h1>

//       <div ref={mapRef} className="h-[350px] border rounded" />

//       <div className="bg-white p-4 rounded shadow space-y-2">
//         <p>
//           <b>Time:</b> {new Date(data.visit.createdAt).toLocaleString()}
//         </p>

//         {/* ❌ NO LOAD */}
//         {!data.hasLoad && (
//           <>
//             <p className="text-red-600 font-semibold">No Stock</p>
//             {data.visit.remark && <p>{data.visit.remark}</p>}
//             {data.visit.image && (
//               <img
//                 src={data.visit.image}
//                 className="w-64 rounded border mt-2"
//               />
//             )}
//           </>
//         )}

//         {/* ✅ LOAD */}
//         {data.hasLoad && data.load && (
//           <>
//             <p className="text-green-600 font-semibold">Load</p>
//             <p>
//               <b>load Status:</b> {data.load.status}
//             </p>
//             <p>
//               <b>Product:</b> {data.load.productName}
//             </p>
//             <p>
//               <b>Route:</b> {data.load.from} → {data.load.to}
//             </p>
//             <p>
//               <b>Vehicles:</b> {data.load.numberOfVehicles}
//             </p>
//             <p>
//               <b>Aggregator:</b> {data.load.aggregator?.name}
//             </p>

//             {data.load.completionImage && (
//               <img
//                 src={data.load.completionImage}
//                 className="w-64 rounded border mt-2"
//               />
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useRef, useState } from "react";
// import { useParams } from "next/navigation";
// import {
//   ArrowLeft,
//   MapPin,
//   Clock,
//   Package,
//   CheckCircle2,
//   AlertCircle,
//   ImageOff,
//   User,
//   Layers,
//   Globe,
//   Satellite,
//   Map,
// } from "lucide-react";

// const API = process.env.NEXT_PUBLIC_API_URL!;

// type MapType = "roadmap" | "satellite" | "hybrid" | "terrain";

// export default function VisitViewPage() {
//   const params = useParams();
//   const visitId = params.visitId as string;

//   const mapRef = useRef<HTMLDivElement>(null);
//   const mapInstance = useRef<google.maps.Map | null>(null);
//   const [data, setData] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [mapType, setMapType] = useState<MapType>("hybrid"); // default to satellite + labels

//   useEffect(() => {
//     if (!visitId) return;

//     const fetchVisit = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const res = await fetch(`${API}/api/dashboard/visit/${visitId}`, {
//           cache: "no-store",
//         });

//         if (!res.ok) throw new Error("Failed to load visit details");

//         const json = await res.json();
//         setData(json);
//       } catch (err) {
//         console.error("Visit fetch error:", err);
//         setError("Could not load visit details");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchVisit();
//   }, [visitId]);

//   // Initialize / Update Google Map
//   useEffect(() => {
//     if (!mapRef.current || !data?.visit || !window.google?.maps) return;

//     const pos = {
//       lat: data.visit.latitude,
//       lng: data.visit.longitude,
//     };

//     // Create or update map
//     if (!mapInstance.current) {
//       mapInstance.current = new google.maps.Map(mapRef.current, {
//         zoom: 17,
//         center: pos,
//         mapTypeId: mapType,
//         mapTypeControl: false, // hide default controls
//         streetViewControl: false,
//         fullscreenControl: true,
//         zoomControl: true,
//         scaleControl: true,
//         styles: [
//           // Optional: subtle modern map style (you can remove or customize)
//           {
//             featureType: "poi",
//             elementType: "labels",
//             stylers: [{ visibility: "off" }],
//           },
//         ],
//       });
//     } else {
//       // Just update type if already created
//       mapInstance.current.setMapTypeId(mapType);
//     }

//     // Clear previous markers
//     const markers = mapInstance.current.markers || [];
//     markers.forEach((m) => m.setMap(null));

//     // Add new marker
//     const marker = new google.maps.Marker({
//       position: pos,
//       map: mapInstance.current,
//       title: `${data.user.name} - Visit`,
//       animation: google.maps.Animation.DROP,
//       icon: {
//         url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
//         scaledSize: new google.maps.Size(32, 32),
//       },
//     });

//     // Store marker reference
//     mapInstance.current.markers = [marker];

//     // Optional: Info window on marker click
//     const infoWindow = new google.maps.InfoWindow({
//       content: `
//         <div style="min-width:180px;">
//           <strong>${data.user.name}</strong><br>
//           ${new Date(data.visit.createdAt).toLocaleString("en-IN", {
//             dateStyle: "medium",
//             timeStyle: "short",
//           })}
//         </div>
//       `,
//     });

//     marker.addListener("click", () => {
//       infoWindow.open(mapInstance.current, marker);
//     });

//     // Center map on position
//     mapInstance.current.panTo(pos);
//   }, [data, mapType]);

//   const toggleMapType = (type: MapType) => {
//     setMapType(type);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading visit details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error || !data) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-6">
//         <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8 text-center">
//           <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
//           <h2 className="text-xl font-semibold text-gray-800 mb-2">
//             {error || "Visit not found"}
//           </h2>
//         </div>
//       </div>
//     );
//   }

//   const hasLoad = data.hasLoad && data.load;
//   const visitTime = new Date(data.visit.createdAt);

//   return (
//     <div className="min-h-screen bg-gray-50/70 pb-12">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
//         {/* Header */}
//         <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => window.history.back()}
//               className="p-2 rounded-full hover:bg-gray-200 transition"
//             >
//               <ArrowLeft size={20} />
//             </button>
//             <div>
//               <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
//                 <User className="h-7 w-7 text-indigo-600" />
//                 {data.user.name}'s Visit
//               </h1>
//               <p className="text-gray-600 mt-1 font-mono text-sm">
//                 {data.user.phone} •{" "}
//                 {visitTime.toLocaleString("en-IN", {
//                   dateStyle: "medium",
//                   timeStyle: "short",
//                 })}
//               </p>
//             </div>
//           </div>

//           {/* Map Type Controls */}
//           <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
//             <button
//               onClick={() => toggleMapType("roadmap")}
//               className={`p-2 rounded ${mapType === "roadmap" ? "bg-indigo-100 text-indigo-700" : "text-gray-600 hover:bg-gray-100"}`}
//               title="Roadmap"
//             >
//               <Map size={20} />
//             </button>
//             <button
//               onClick={() => toggleMapType("satellite")}
//               className={`p-2 rounded ${mapType === "satellite" ? "bg-indigo-100 text-indigo-700" : "text-gray-600 hover:bg-gray-100"}`}
//               title="Satellite"
//             >
//               <Satellite size={20} />
//             </button>
//             <button
//               onClick={() => toggleMapType("hybrid")}
//               className={`p-2 rounded ${mapType === "hybrid" ? "bg-indigo-100 text-indigo-700" : "text-gray-600 hover:bg-gray-100"}`}
//               title="Hybrid (Satellite + Labels)"
//             >
//               <Globe size={20} />
//             </button>
//             <button
//               onClick={() => toggleMapType("terrain")}
//               className={`p-2 rounded ${mapType === "terrain" ? "bg-indigo-100 text-indigo-700" : "text-gray-600 hover:bg-gray-100"}`}
//               title="Terrain"
//             >
//               <Layers size={20} />
//             </button>
//           </div>
//         </div>

//         <div className="grid gap-6 lg:grid-cols-2">
//           {/* Modern Map Card */}
//           <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-md bg-white">
//             <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-5 py-3.5 border-b flex items-center gap-2">
//               <MapPin className="text-indigo-600" size={18} />
//               <h2 className="font-semibold text-gray-800">Location on Map</h2>
//             </div>
//             <div ref={mapRef} className="h-[400px] sm:h-[500px] lg:h-[600px]" />
//             <div className="px-5 py-3 text-xs text-gray-600 bg-gray-50 border-t font-mono">
//               {data.visit.latitude.toFixed(6)},{" "}
//               {data.visit.longitude.toFixed(6)}
//             </div>
//           </div>

//           {/* Details Panel */}
//           <div className="rounded-2xl border border-gray-200 shadow-md bg-white overflow-hidden">
//             <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-5 py-3.5 border-b flex items-center gap-2">
//               {hasLoad ? (
//                 <Package className="text-green-600" size={18} />
//               ) : (
//                 <AlertCircle className="text-amber-600" size={18} />
//               )}
//               <h2 className="font-semibold text-gray-800">
//                 {hasLoad ? "Load Details" : "Visit Remark / No Load"}
//               </h2>
//             </div>

//             <div className="p-6 space-y-6">
//               {hasLoad ? (
//                 <div className="space-y-5">
//                   <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-100">
//                     <CheckCircle2 className="text-green-600" size={28} />
//                     <div>
//                       <div className="text-sm text-green-700 font-medium">
//                         Status
//                       </div>
//                       <div className="text-lg font-bold text-green-800 capitalize">
//                         {data.load.status}
//                       </div>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
//                     <div>
//                       <div className="text-gray-500">Product</div>
//                       <div className="font-medium text-gray-900">
//                         {data.load.productName}
//                       </div>
//                     </div>
//                     <div>
//                       <div className="text-gray-500">Vehicles</div>
//                       <div className="font-medium text-gray-900">
//                         {data.load.numberOfVehicles}
//                       </div>
//                     </div>
//                     <div className="col-span-2">
//                       <div className="text-gray-500">Route</div>
//                       <div className="font-medium text-gray-900">
//                         {data.load.from} → {data.load.to}
//                       </div>
//                     </div>
//                     <div>
//                       <div className="text-gray-500">Aggregator</div>
//                       <div className="font-medium text-gray-900">
//                         {data.load.aggregator?.name || "—"}
//                       </div>
//                     </div>
//                   </div>

//                   {data.load.completionImage && (
//                     <div className="pt-4 border-t">
//                       <div className="text-sm text-gray-500 mb-2 font-medium">
//                         Completion Photo
//                       </div>
//                       <img
//                         src={data.load.completionImage}
//                         alt="Load completion proof"
//                         className="rounded-xl border border-gray-200 w-full max-h-[320px] object-cover shadow-sm hover:shadow-md transition-shadow"
//                       />
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <div className="space-y-5">
//                   <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
//                     <AlertCircle className="text-amber-600" size={28} />
//                     <div className="text-lg font-semibold text-amber-800">
//                       No Load / No Stock
//                     </div>
//                   </div>

//                   {data.visit.remark && (
//                     <div className="bg-amber-50/70 p-5 rounded-xl border border-amber-200">
//                       <div className="text-sm text-amber-800 font-medium mb-2">
//                         Remark:
//                       </div>
//                       <p className="text-gray-800 leading-relaxed">
//                         {data.visit.remark}
//                       </p>
//                     </div>
//                   )}

//                   {data.visit.image ? (
//                     <div>
//                       <div className="text-sm text-gray-500 mb-2 font-medium">
//                         Visit Photo
//                       </div>
//                       <img
//                         src={data.visit.image}
//                         alt="Visit evidence"
//                         className="rounded-xl border border-gray-200 w-full max-h-[320px] object-cover shadow-sm hover:shadow-md transition-shadow"
//                       />
//                     </div>
//                   ) : (
//                     <div className="flex flex-col items-center justify-center py-10 text-gray-400 bg-gray-50 rounded-xl border border-dashed">
//                       <ImageOff size={48} strokeWidth={1.5} />
//                       <p className="mt-4 text-sm font-medium">
//                         No photo attached to this visit
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Package,
  CheckCircle2,
  AlertCircle,
  ImageOff,
  User,
  Layers,
  Globe,
  Satellite,
  Map,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL!;

type MapType = "roadmap" | "satellite" | "hybrid" | "terrain";

export default function VisitViewPage() {
  const params = useParams();
  const visitId = params.visitId as string;

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapType, setMapType] = useState<MapType>("hybrid");

  /* ================= FETCH VISIT ================= */

  useEffect(() => {
    if (!visitId) return;

    const fetchVisit = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API}/api/dashboard/visit/${visitId}`, {
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Failed to load visit details");

        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Visit fetch error:", err);
        setError("Could not load visit details");
      } finally {
        setLoading(false);
      }
    };

    fetchVisit();
  }, [visitId]);

  /* ================= MAP INIT / UPDATE ================= */

  useEffect(() => {
    if (!mapRef.current || !data?.visit || !window.google?.maps) return;

    const pos = {
      lat: data.visit.latitude,
      lng: data.visit.longitude,
    };

    if (!mapInstance.current) {
      mapInstance.current = new google.maps.Map(mapRef.current, {
        zoom: 17,
        center: pos,
        mapTypeId: mapType,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
        scaleControl: true,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      });
    } else {
      mapInstance.current.setMapTypeId(mapType);
    }

    // ✅ Clear old markers
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    // ✅ Add marker
    const marker = new google.maps.Marker({
      position: pos,
      map: mapInstance.current,
      title: `${data.user.name} - Visit`,
      animation: google.maps.Animation.DROP,
      icon: {
        url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
        scaledSize: new google.maps.Size(32, 32),
      },
    });

    markersRef.current.push(marker);

    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="min-width:180px;">
          <strong>${data.user.name}</strong><br/>
          ${new Date(data.visit.createdAt).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </div>
      `,
    });

    marker.addListener("click", () => {
      infoWindow.open(mapInstance.current!, marker);
    });

    mapInstance.current.panTo(pos);
  }, [data, mapType]);

  const toggleMapType = (type: MapType) => setMapType(type);

  /* ================= UI STATES ================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading visit details...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {error || "Visit not found"}
          </h2>
        </div>
      </div>
    );
  }

  const hasLoad = data.hasLoad && data.load;
  const visitTime = new Date(data.visit.createdAt);

  /* ================= PAGE ================= */

  return (
    <div className="min-h-screen bg-gray-50/70 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.history.back()}
              className="p-2 rounded-full hover:bg-gray-200 transition"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <User className="h-7 w-7 text-indigo-600" />
                {data.user.name}'s Visit
              </h1>
              <p className="text-gray-600 mt-1 font-mono text-sm">
                {data.user.phone} •{" "}
                {visitTime.toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </div>
          </div>

          {/* Map Type Controls */}
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
            {(["roadmap", "satellite", "hybrid", "terrain"] as MapType[]).map(
              (t) => (
                <button
                  key={t}
                  onClick={() => toggleMapType(t)}
                  className={`p-2 rounded ${
                    mapType === t
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  title={t}
                >
                  {t === "roadmap" && <Map size={20} />}
                  {t === "satellite" && <Satellite size={20} />}
                  {t === "hybrid" && <Globe size={20} />}
                  {t === "terrain" && <Layers size={20} />}
                </button>
              ),
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Map */}
          <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-md bg-white">
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-5 py-3.5 border-b flex items-center gap-2">
              <MapPin className="text-indigo-600" size={18} />
              <h2 className="font-semibold text-gray-800">Location on Map</h2>
            </div>
            <div ref={mapRef} className="h-[400px] sm:h-[500px] lg:h-[600px]" />
            <div className="px-5 py-3 text-xs text-gray-600 bg-gray-50 border-t font-mono">
              {data.visit.latitude.toFixed(6)},{" "}
              {data.visit.longitude.toFixed(6)}
            </div>
          </div>

          {/* Details */}
          <div className="rounded-2xl border border-gray-200 shadow-md bg-white overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-5 py-3.5 border-b flex items-center gap-2">
              {hasLoad ? (
                <Package className="text-green-600" size={18} />
              ) : (
                <AlertCircle className="text-amber-600" size={18} />
              )}
              <h2 className="font-semibold text-gray-800">
                {hasLoad ? "Load Details" : "Visit Remark / No Load"}
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {hasLoad ? (
                <>
                  <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-100">
                    <CheckCircle2 className="text-green-600" size={28} />
                    <div>
                      <div className="text-sm text-green-700 font-medium">
                        Status
                      </div>
                      <div className="text-lg font-bold text-green-800 capitalize">
                        {data.load.status}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
                    <div>
                      <div className="text-gray-500">Product</div>
                      <div className="font-medium text-gray-900">
                        {data.load.productName}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">Vehicles</div>
                      <div className="font-medium text-gray-900">
                        {data.load.numberOfVehicles}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-gray-500">Route</div>
                      <div className="font-medium text-gray-900">
                        {data.load.from} → {data.load.to}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">Aggregator</div>
                      <div className="font-medium text-gray-900">
                        {data.load.aggregator?.name || "—"}
                      </div>
                    </div>
                  </div>

                  {data.load.completionImage && (
                    <div className="pt-4 border-t">
                      <div className="text-sm text-gray-500 mb-2 font-medium">
                        Completion Photo
                      </div>
                      <img
                        src={data.load.completionImage}
                        alt="Load completion proof"
                        className="rounded-xl border border-gray-200 w-full max-h-[320px] object-cover shadow-sm"
                      />
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
                    <AlertCircle className="text-amber-600" size={28} />
                    <div className="text-lg font-semibold text-amber-800">
                      No Load / No Stock
                    </div>
                  </div>

                  {data.visit.remark && (
                    <div className="bg-amber-50/70 p-5 rounded-xl border border-amber-200">
                      <div className="text-sm text-amber-800 font-medium mb-2">
                        Remark:
                      </div>
                      <p className="text-gray-800 leading-relaxed">
                        {data.visit.remark}
                      </p>
                    </div>
                  )}

                  {data.visit.image ? (
                    <div>
                      <div className="text-sm text-gray-500 mb-2 font-medium">
                        Visit Photo
                      </div>
                      <img
                        src={data.visit.image}
                        alt="Visit evidence"
                        className="rounded-xl border border-gray-200 w-full max-h-[320px] object-cover shadow-sm"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-400 bg-gray-50 rounded-xl border border-dashed">
                      <ImageOff size={48} strokeWidth={1.5} />
                      <p className="mt-4 text-sm font-medium">
                        No photo attached to this visit
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
