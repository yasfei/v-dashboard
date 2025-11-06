"use client";

export default function UserFilters() {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col flex-1">
        <label className="text-sm text-gray-300">Nome do consultor</label>
        <select className="bg-[#131516] text-white rounded-md px-3 py-2 mt-1 border border-[#2a2a2a]">
          <option>Todos</option>
          <option>Alice Silva</option>
          <option>Bruno Rocha</option>
        </select>
      </div>

      <div className="flex flex-col flex-1">
        <label className="text-sm text-gray-300">Email do consultor</label>
        <select className="bg-[#131516] text-white rounded-md px-3 py-2 mt-1 border border-[#2a2a2a]">
          <option>Todos</option>
        </select>
      </div>

      <div className="flex flex-col flex-1">
        <label className="text-sm text-gray-300">Período</label>
        <input
          type="text"
          placeholder="2025-10-01 até 2025-10-07"
          className="bg-[#131516] text-white rounded-md px-3 py-2 mt-1 border border-[#2a2a2a]"
        />
      </div>
    </div>
  );
}
