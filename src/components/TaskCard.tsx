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
  task, onEdit, onDelete, onStatusChange
}: Props) {
  const isOverdue = task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "COMPLETED"

  return (
    <div className={`bg-white rounded-lg
      shadow-sm p-4 border-l-4
      ${task.priority === "HIGH"
        ? "border-red-500"
        : task.priority === "MEDIUM"
        ? "border-yellow-500"
        : "border-green-500"}
      hover:shadow-md transition-shadow`}>

      <div className="flex items-start
        justify-between gap-4">
        <div className="flex-1">

          {/* Title + Status */}
          <div className="flex items-center
            gap-2 mb-1 flex-wrap">
            <h3 className="font-medium
              text-gray-800">
              {task.title}
            </h3>
            <span className={`text-xs px-2
              py-0.5 rounded-full font-medium
              ${statusColors[task.status]}`}>
              {task.status.replace("_", " ")}
            </span>
            {isOverdue && (
              <span className="text-xs
                px-2 py-0.5 rounded-full
                bg-red-100 text-red-700
                font-medium">
                Overdue
              </span>
            )}
          </div>

          {/* Description */}
          {task.description && (
            <p className="text-sm text-gray-500
              mb-2 line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Footer info */}
          <div className="flex items-center
            gap-3 text-xs text-gray-400">
            <span>📅 {task.dueDate
              ? new Date(task.dueDate)
                .toLocaleDateString()
              : "No due date"}
            </span>
            <span className={`font-medium
              ${priorityColors[task.priority]}`}>
              ● {task.priority}
            </span>
          </div>

          {/* Status dropdown */}
          <select
            value={task.status}
            onChange={e => onStatusChange(
              e.target.value as TaskStatus
            )}
            className="mt-2 text-xs border
              rounded px-2 py-1 text-gray-600
              bg-gray-50 cursor-pointer">
            <option value="PENDING">
              ⏳ Pending
            </option>
            <option value="IN_PROGRESS">
              🔄 In Progress
            </option>
            <option value="COMPLETED">
              ✅ Completed
            </option>
          </select>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-1">
          <button
            onClick={onEdit}
            className="p-1.5 text-gray-400
              hover:text-blue-600
              hover:bg-blue-50 rounded
              transition-colors"
            aria-label="Edit task">
            <Pencil size={15} />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 text-gray-400
              hover:text-red-600
              hover:bg-red-50 rounded
              transition-colors"
            aria-label="Delete task">
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}
