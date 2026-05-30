"use client";

import { Task, TaskStatus } from "@/types";
import { Pencil, Trash2 } from "lucide-react";

const statusColors: Record<TaskStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
};

const priorityColors: Record<string, string> = {
  LOW: "text-gray-500",
  MEDIUM: "text-orange-500",
  HIGH: "text-red-500",
};

interface Props {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (status: TaskStatus) => void;
}

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}: Props) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 flex items-start justify-between gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-medium text-gray-800">{task.title}</h3>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[task.status]}`}
          >
            {task.status.replace("_", " ")}
          </span>
          <span className={`text-xs font-medium ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
        </div>

        {task.description && (
          <p className="text-sm text-gray-500 mb-2">{task.description}</p>
        )}

        {task.dueDate && (
          <p className="text-xs text-gray-400">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </p>
        )}

        {/* Quick Status Change */}
        <select
          value={task.status}
          onChange={(e) => onStatusChange(e.target.value as TaskStatus)}
          className="mt-2 text-xs border rounded px-2 py-1 text-gray-600"
        >
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="p-1.5 text-gray-400 hover:text-blue-600 rounded"
          aria-label="Edit task"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 text-gray-400 hover:text-red-600 rounded"
          aria-label="Delete task"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
