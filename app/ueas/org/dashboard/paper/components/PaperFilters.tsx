"use client";

import { Search, X } from "lucide-react";

interface Props {
  value: {
    search: string;
    is_active?: 0 | 1;
  };
  onChange: (v: Props["value"]) => void;
}

export default function PaperFilters({ value, onChange }: Props) {
  return (
    <div className="bg-white border rounded-2xl p-5 mb-6 shadow-sm">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-800">
          Filter Papers
        </h3>

        <button
          type="button"
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700"
          onClick={() =>
            onChange({
              search: "",
              is_active: undefined,
            })
          }
        >
          <X className="h-3.5 w-3.5" />
          Clear
        </button>
      </div>

      {/* FILTERS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* SEARCH */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Search Paper
          </label>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by paper name"
              value={value.search}
              onChange={(e) =>
                onChange({ ...value, search: e.target.value })
              }
              className="w-full rounded-lg border pl-9 pr-3 py-2 text-sm
                         focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* STATUS */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Status
          </label>

          <select
            value={value.is_active ?? ""}
            onChange={(e) =>
              onChange({
                ...value,
                is_active:
                  e.target.value === ""
                    ? undefined
                    : (Number(e.target.value) as 0 | 1),
              })
            }
            className="w-full rounded-lg border px-3 py-2 text-sm bg-white
                       focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">All</option>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
        </div>

      </div>
    </div>
  );
}
