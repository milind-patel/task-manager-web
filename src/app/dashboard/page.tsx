"use client";

import { useState } from "react";
import { useQuery, useMutation, useApolloClient } from "@apollo/client/react";
import {
  GET_TASKS,
  CREATE_TASK,
  UPDATE_TASK,
  DELETE_TASK,
} from "@/lib/graphql/operations";
import { Task, TaskFilters, TaskStatus } from "@/types";
import TaskCard from "@/components/TaskCard";
import TaskForm from "@/components/TaskForm";
import FilterBar from "@/components/FilterBar";
import { Plus } from "lucide-react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

/**
 * Main Dashboard Page
 * 
 * Handles displaying tasks, filtering, creating/editing/deleting tasks.
 * Uses Apollo Client for state management and GraphQL queries/mutations.
 */
export default function DashboardPage() {
  const router = useRouter();
  const client = useApolloClient();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  let userEmail = "";
  const currentToken = Cookies.get("token");
  if (currentToken) {
    try {
      const payload = JSON.parse(atob(currentToken.split(".")[1]));
      userEmail = payload.email || "";
    } catch (e) {}
  }

  // State for filtering, showing modal, and tracking task edits
  const [filters, setFilters] = useState<TaskFilters>({});
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Fetch tasks with Apollo - passing active filters as variables
  const { data, loading, refetch } = useQuery<{ tasks: Task[] }>(GET_TASKS, {
    variables: {
      status: filters.status || null,
      priority: filters.priority || null,
    },
    // fetchPolicy: "cache-and-network" could be added here for highly concurrent apps
  });

  // Apollo Mutations for CRUD operations
  // We use refetch() on completion to ensure the UI stays synchronized with the backend
  // Optimization note: For larger apps, we could use update() to write directly to the Apollo cache instead of refetching
  const [createTask] = useMutation(CREATE_TASK, {
    onCompleted: () => {
      toast.success("Task created!");
      setShowForm(false);
      refetch();
    },
    onError: (err) => {
      toast.error(err.message);
    }
  });

  const [updateTask] = useMutation(UPDATE_TASK, {
    onCompleted: () => {
      toast.success("Task updated!");
      setEditingTask(null);
      refetch();
    },
    onError: (err) => {
      toast.error(err.message);
    }
  });

  const [deleteTask] = useMutation(DELETE_TASK, {
    onCompleted: () => {
      toast.success("Task deleted!");
      refetch();
    },
    onError: (err) => {
      toast.error(err.message);
    }
  });

  const handleDelete = (task: Task) => {
    if (window.confirm(`Delete "${task.title}"? This cannot be undone.`)) {
      deleteTask({ variables: { id: task.id } });
    }
  };

  // Secure logout process
  const handleLogout = () => {
    Cookies.remove("token", { path: "/" }); // Remove token from cookie storage
    client.clearStore(); // Clear Apollo cache to prevent sensitive data leaks
    router.replace("/login"); // Redirect to login
  };

  const tasks: Task[] = data?.tasks || [];

  const pending = tasks.filter((t) => t.status === "PENDING").length;
  const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS").length;
  const completed = tasks.filter((t) => t.status === "COMPLETED").length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✅</span>
            <h1 className="text-xl font-bold text-gray-800">Task Manager</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{userEmail}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            {
              label: "Pending",
              count: pending,
              icon: "⏳",
              bg: "bg-yellow-50",
              border: "border-yellow-200",
              text: "text-yellow-700"
            },
            {
              label: "In Progress",
              count: inProgress,
              icon: "🔄",
              bg: "bg-blue-50",
              border: "border-blue-200",
              text: "text-blue-700"
            },
            {
              label: "Completed",
              count: completed,
              icon: "✅",
              bg: "bg-green-50",
              border: "border-green-200",
              text: "text-green-700"
            }
          ].map(({ label, count, icon, bg, border, text }) => (
            <div
              key={label}
              className={`${bg} border ${border} rounded-lg p-4 text-center`}
            >
              <div className="text-3xl mb-1">{icon}</div>
              <p className={`text-3xl font-bold ${text}`}>{count}</p>
              <p className="text-sm text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Filter Bar + Add Button */}
        <div className="flex justify-between items-center mb-6">
          <FilterBar filters={filters} onChange={setFilters} />
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus size={16} />
            Add Task
          </button>
        </div>

        {/* Task Form Modal */}
        {(showForm || editingTask) && (
          <TaskForm
            task={editingTask}
            onSubmit={async (values) => {
              if (editingTask) {
                await updateTask({
                  variables: { id: editingTask.id, ...values },
                });
              } else {
                await createTask({ variables: values });
              }
            }}
            onClose={() => {
              setShowForm(false);
              setEditingTask(null);
            }}
          />
        )}

        {/* Task List */}
        {loading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-sm p-4 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              No tasks yet
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Create your first task to get started
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Create Task
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={() => setEditingTask(task)}
                onDelete={() => handleDelete(task)}
                onStatusChange={(status: TaskStatus) =>
                  updateTask({ variables: { id: task.id, status } })
                }
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
