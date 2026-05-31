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
      setShowForm(false);
      refetch();
    },
  });

  const [updateTask] = useMutation(UPDATE_TASK, {
    onCompleted: () => {
      setEditingTask(null);
      refetch();
    },
  });

  const [deleteTask] = useMutation(DELETE_TASK, {
    onCompleted: () => refetch(),
  });

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
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Task Manager</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-red-600"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Pending", count: pending },
            { label: "In Progress", count: inProgress },
            { label: "Completed", count: completed },
          ].map(({ label, count }) => (
            <div
              key={label}
              className="bg-white rounded-lg shadow-sm p-4 text-center"
            >
              <p className="text-3xl font-bold text-gray-800">{count}</p>
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
          <div className="text-center text-gray-500 py-12">
            Loading tasks...
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            No tasks found. Create one!
          </div>
        ) : (
          <div className="grid gap-4">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={() => setEditingTask(task)}
                onDelete={() => deleteTask({ variables: { id: task.id } })}
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
