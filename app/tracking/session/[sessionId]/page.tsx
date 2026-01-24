"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { ArrowLeft, Clock, MapPin, ImageOff, Navigation } from "lucide-react";
import UserTrackingMap from "@/components/UserTrackingMap";

const API = process.env.NEXT_PUBLIC_API_URL!;

/* ================= TYPES ================= */

type Point = {
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: string;
};

type Session = {
  startTime: string;
  endTime: string | null;
  startImage?: string;
  endImage?: string;
  startLocation?: { lat: number; lng: number };
  endLocation?: { lat: number; lng: number };
  totalPoints: number;
};

type SessionData = {
  user: { name: string; phone: string };
  session: Session;
  points: Point[];
};

/* ================= PAGE ================= */

export default function TrackingDetailPage() {
  const { sessionId } = useParams<{ sessionId: string }>(); // ✅ sessionId
  const router = useRouter();

  const [data, setData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ===== FETCH BY SESSION ID ===== */

  useEffect(() => {
    if (!sessionId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${API}/api/tracking/session/${sessionId}`, // ✅ correct API
          { cache: "no-store" },
        );

        if (!res.ok) throw new Error("Failed to load session");

        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("DETAIL FETCH ERROR:", err);
        setError("Couldn't load tracking data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sessionId]);

  const session = data?.session;
  const points = data?.points ?? [];

  /* ===== CALCULATIONS ===== */

  const duration = useMemo(() => {
    if (!session?.startTime || !session?.endTime) return "—";
    const start = new Date(session.startTime);
    const end = new Date(session.endTime);
    const diff = (end.getTime() - start.getTime()) / 1000 / 60;
    return diff < 1 ? "< 1 min" : `${Math.round(diff)} min`;
  }, [session]);

  const avgAccuracy = useMemo(() => {
    if (points.length === 0) return "0";
    const sum = points.reduce((acc, p) => acc + p.accuracy, 0);
    return (sum / points.length).toFixed(1);
  }, [points]);

  /* ===== UI STATES ===== */

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

  if (error || !data || !session) {
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

  /* ================= RENDER ================= */

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

        {/* Stats */}
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
              <UserTrackingMap points={points} />
            </div>
          </div>
        )}

        {/* Points Table */}
        {points.length > 0 ? (
          <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white">
            <div className="bg-gray-50 px-5 py-3 border-b">
              <h2 className="font-semibold">Location History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase">
                      Time
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase">
                      Lat
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase">
                      Lng
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase">
                      Accuracy
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {points.map((p, i) => (
                    <tr key={i} className="hover:bg-blue-50/40">
                      <td className="px-5 py-3 text-sm text-gray-700">
                        {new Date(p.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </td>
                      <td className="px-5 py-3 text-sm font-mono text-gray-600">
                        {p.lat.toFixed(6)}
                      </td>
                      <td className="px-5 py-3 text-sm font-mono text-gray-600">
                        {p.lng.toFixed(6)}
                      </td>
                      <td className="px-5 py-3 text-sm">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
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
        ) : (
          <div className="text-center py-16 text-gray-500 bg-white rounded-2xl border border-dashed">
            No location points recorded in this session.
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

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
          <p className="text-xs text-gray-500 uppercase">{label}</p>
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
  time: string | null;
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
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
            <ImageOff size={48} />
            <p className="mt-3 text-sm">No photo available</p>
          </div>
        )}
      </div>

      <div className="p-4 text-sm text-gray-600 bg-white/60 backdrop-blur-sm">
        <div className="flex items-center gap-1.5 mb-1">
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
              : "Location not available"}
          </span>
        </div>
      </div>
    </div>
  );
}
