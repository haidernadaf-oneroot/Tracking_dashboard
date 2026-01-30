// "use client";

// import { useEffect, useState } from "react";

// /* ================= TYPES ================= */

// type User = {
//   _id: string;
//   name: string;
//   phone: string;
// };

// type Task = {
//   _id: string;
//   title: string;
//   description?: string;
//   status: "pending" | "completed";
//   completedAt?: string;
//   assignedTo: User;
// };

// /* ================= CONFIG ================= */

// const API = process.env.NEXT_PUBLIC_API_URL!;

// /* ================= PAGE ================= */

// export default function TasksDashboard() {
//   const [users, setUsers] = useState<User[]>([]);
//   const [tasks, setTasks] = useState<Task[]>([]);

//   const [userId, setUserId] = useState("");
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");

//   const [loading, setLoading] = useState(false);

//   /* ================= LOAD USERS ================= */

//   const loadUsers = async () => {
//     const res = await fetch(`${API}/api/users`);
//     const data = await res.json();
//     setUsers(data || []);
//   };

//   /* ================= LOAD TASKS ================= */

//   const loadTasks = async () => {
//     const res = await fetch(`${API}/api/tasks/all`);
//     const data = await res.json();
//     setTasks(data || []);
//   };

//   useEffect(() => {
//     loadUsers();
//     loadTasks();
//   }, []);

//   /* ================= ASSIGN TASK ================= */

//   const assignTask = async () => {
//     if (!userId || !title) {
//       alert("Select user and enter title");
//       return;
//     }

//     try {
//       setLoading(true);

//       const res = await fetch(`${API}/api/tasks/assign`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userId,
//           title,
//           description,
//         }),
//       });

//       if (!res.ok) throw new Error("Assign failed");

//       setTitle("");
//       setDescription("");
//       setUserId("");

//       await loadTasks();
//       alert("✅ Task assigned");
//     } catch (err) {
//       console.error(err);
//       alert("❌ Failed to assign task");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= UI ================= */

//   return (
//     <div className="p-6 space-y-8">
//       <h1 className="text-2xl font-bold">📝 Task Management Dashboard</h1>

//       {/* ================= ASSIGN FORM ================= */}
//       <div className="bg-white p-4 rounded-xl shadow space-y-4 max-w-xl">
//         <h2 className="font-semibold text-lg">Assign New Task</h2>

//         <select
//           value={userId}
//           onChange={(e) => setUserId(e.target.value)}
//           className="w-full border p-2 rounded"
//         >
//           <option value="">Select User</option>
//           {users.map((u) => (
//             <option key={u._id} value={u._id}>
//               {u.name} ({u.phone})
//             </option>
//           ))}
//         </select>

//         <input
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           placeholder="Task title"
//           className="w-full border p-2 rounded"
//         />

//         <textarea
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           placeholder="Task description"
//           className="w-full border p-2 rounded"
//         />

//         <button
//           onClick={assignTask}
//           disabled={loading}
//           className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
//         >
//           {loading ? "Assigning..." : "Assign Task"}
//         </button>
//       </div>

//       {/* ================= TASK TABLE ================= */}
//       <div className="bg-white rounded-xl shadow overflow-x-auto">
//         <table className="w-full text-sm">
//           <thead className="bg-slate-100">
//             <tr>
//               <th className="p-3 text-left">User</th>
//               <th className="p-3 text-left">Task</th>
//               <th className="p-3 text-left">Status</th>
//               <th className="p-3 text-left">Completed At</th>
//             </tr>
//           </thead>

//           <tbody>
//             {tasks.map((t) => (
//               <tr key={t._id} className="border-t">
//                 <td className="p-3">
//                   <div className="font-medium">{t.assignedTo?.name}</div>
//                   <div className="text-xs text-gray-500">
//                     {t.assignedTo?.phone}
//                   </div>
//                 </td>

//                 <td className="p-3">
//                   <div className="font-semibold">{t.title}</div>
//                   <div className="text-xs text-gray-500">{t.description}</div>
//                 </td>

//                 <td className="p-3">
//                   {t.status === "completed" ? (
//                     <span className="text-green-600 font-semibold">
//                       ✅ Completed
//                     </span>
//                   ) : (
//                     <span className="text-orange-500 font-semibold">
//                       ⏳ Pending
//                     </span>
//                   )}
//                 </td>

//                 <td className="p-3 text-xs text-gray-600">
//                   {t.completedAt
//                     ? new Date(t.completedAt).toLocaleString()
//                     : "-"}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react"; // ← add lucide-react if you want nice icons

/* ================= TYPES ================= */
type User = {
  _id: string;
  name: string;
  phone: string;
};

type Task = {
  _id: string;
  title: string;
  description?: string;
  status: "pending" | "completed";
  completedAt?: string;
  assignedTo: User;
};

/* ================= CONFIG ================= */
const API = process.env.NEXT_PUBLIC_API_URL!;

/* ================= PAGE ================= */
export default function TasksDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= LOAD DATA ================= */
  const loadUsers = async () => {
    try {
      const res = await fetch(`${API}/api/users`);
      const data = await res.json();
      setUsers(data || []);
    } catch (err) {
      console.error("Failed to load users", err);
    }
  };

  const loadTasks = async () => {
    try {
      const res = await fetch(`${API}/api/tasks/all`);
      const data = await res.json();
      setTasks(data || []);
    } catch (err) {
      console.error("Failed to load tasks", err);
    }
  };

  useEffect(() => {
    loadUsers();
    loadTasks();
  }, []);

  /* ================= ASSIGN TASK ================= */
  const assignTask = async () => {
    if (!userId || !title.trim()) {
      alert("Please select a user and enter task title");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API}/api/tasks/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          title: title.trim(),
          description: description.trim() || undefined,
        }),
      });

      if (!res.ok) throw new Error("Failed to assign task");

      // Reset form
      setTitle("");
      setDescription("");
      setUserId("");

      // Close modal & refresh tasks
      setIsModalOpen(false);
      await loadTasks();

      alert("Task assigned successfully! ✓");
    } catch (err) {
      console.error(err);
      alert("Failed to assign task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !loading) {
      e.preventDefault();
      assignTask();
    }
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Task Management
          </h1>

          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
          >
            + Assign New Task
          </button>
        </div>

        {/* TASK TABLE */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Assigned To
                  </th>
                  <th className="px-6 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Task
                  </th>
                  <th className="px-6 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Completed
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tasks.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      No tasks yet
                    </td>
                  </tr>
                ) : (
                  tasks.map((task) => (
                    <tr
                      key={task._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {task.assignedTo?.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {task.assignedTo?.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {task.title}
                        </div>
                        {task.description && (
                          <div className="mt-1 text-sm text-gray-600 line-clamp-2">
                            {task.description}
                          </div>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {task.status === "completed" ? (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            Completed
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {task.completedAt
                          ? new Date(task.completedAt).toLocaleString([], {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })
                          : "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Assign New Task
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-6" onKeyDown={handleKeyDown}>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Assign to
                </label>
                <select
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition"
                >
                  <option value="">Select user...</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name} — {u.phone}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Task Title *
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Fix login button styling"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Description (optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Add more context or acceptance criteria..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={assignTask}
                  disabled={loading || !userId || !title.trim()}
                  className="rounded-lg bg-purple-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      Assigning...
                    </>
                  ) : (
                    "Assign Task"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
