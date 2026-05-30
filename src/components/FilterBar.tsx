"use client";

import { TaskFilters } from "@/types";

interface Props {
  filters: TaskFilters;
  onChange: (filters: TaskFilters) => void;
}

export default function FilterBar({ filters, onChange }: Props) {
  return (
    <div className="flex gap-3">
      <select
        value={filters.status || ""}
        onChange={(e) =>
          onChange({ ...filters, status: e.target.value as TaskFilters["status"] })
        }
        className="border rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Status</option>
        <option value="PENDING">Pending</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="COMPLETED">Completed</option>
      </select>

      <select
        value={filters.priority || ""}
        onChange={(e) =>
          onChange({ ...filters, priority: e.target.value as TaskFilters["priority"] })
        }
        className="border rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Priority</option>
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
      </select>
    </div>
  );
}
