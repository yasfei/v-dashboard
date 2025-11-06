"use client";

import React from "react";
import { User, Client, Address } from "../../src/types/models";

interface UserTableProps {
  users: (User | Client)[];
  loading?: boolean;
  onRowClick?: (user: User | Client) => void;
}


export default function UserTable({ users, loading = false, onRowClick }: UserTableProps) {

  const formatDate = (dateString?: string | Date | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} às ${hours}:${minutes}h`;
  };

  const formatAddress = (addresses: Address[] | undefined) => {
    if (!addresses || addresses.length === 0) return "-";
    return addresses
      .map(a => [a.street, a.state, a.additional, a.zipCode].filter(Boolean).join(", "))
      .join(" | ");
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center py-10 text-gray-400">
        Carregando...
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="w-full flex justify-center py-10 text-gray-400">
        Nenhum registro encontrado.
      </div>
    );
  }

  const isClientList = (users[0] as Client).consultantId !== undefined;

  return (
    <div className="w-full bg-[#131516] border border-[#222729]">
      <table className="w-full text-left text-sm border-separate border-spacing-0 table-fixed overflow-auto">
        <thead className="bg-[#131313] text-[#B0B7BE] border-b-2">
          <tr>
            <th className="py-8 pl-4 pr-8 font-medium w-[15%]">Nome</th>
            <th className="py-8 pl-4 pr-8 font-medium w-[20%]">E-mail</th>
            <th className="py-8 pl-4 pr-8 font-medium w-[15%]">CPF</th>
            <th className="py-8 pl-4 pr-8 font-medium w-[15%]">Telefone</th>
            <th className="py-8 pl-4 pr-8 font-medium w-[12%]">Endereços</th>
            {isClientList && (
              <th className="py-8 pl-4 pr-8 font-medium w-[12%]">Consultor</th>
            )}
            <th className="py-8 pl-4 pr-8 font-medium w-[17%]">Criado em</th>
            <th className="py-8 pl-4 pr-8 font-medium w-[17%]">Atualizado em</th>
          </tr>
        </thead>

        <tbody className="text-gray-200">
          {users.map((u) => (
            <tr
              key={u.id}
              className="border-b border-gray-500 hover:bg-[#272b2e] cursor-pointer transition-colors"
              onClick={() => onRowClick && onRowClick(u)}
            >
              <td className="py-8 pl-4 pr-8 border-y border-[#222729]">
                <div className="truncate w-full max-w-[220px] overflow-hidden whitespace-nowrap">
                  {u.name || "-"}
                </div>
              </td>

              <td className="py-8 pl-4 pr-8 border-y border-[#222729]">
                <div className="truncate w-full max-w-[260px] overflow-hidden whitespace-nowrap">
                  {"email" in u ? u.email || "-" : "-"}
                </div>
              </td>

              <td className="py-8 pl-4 pr-8 border-y border-[#222729]">
                <div className="truncate w-full max-w-[140px] overflow-hidden whitespace-nowrap">
                  {"cpf" in u ? u.cpf || "-" : "-"}
                </div>
              </td>

              <td className="py-8 pl-4 pr-8 border-y border-[#222729]">
                <div className="truncate w-full max-w-[140px] overflow-hidden whitespace-nowrap">
                  {"phoneNumber" in u ? u.phoneNumber || "-" : "-"}
                </div>
              </td>

              <td className="py-8 pl-4 pr-8 border-y border-[#222729]">
                <div className="truncate w-full max-w-[300px] overflow-hidden whitespace-nowrap">
                  {"addresses" in u ? formatAddress(u.addresses) : "-"}
                </div>
              </td>

              {isClientList && (
                <td className="py-8 pl-4 pr-8 border-y border-[#222729]">
                  <div className="truncate w-full max-w-[160px] overflow-hidden whitespace-nowrap">
                    {"consultant" in u && (u as any).consultant?.name
                      ? (u as any).consultant.name
                      : (u as Client).consultantId
                        ? `#${(u as Client).consultantId}`
                        : "-"}
                  </div>
                </td>
              )}

              <td className="py-8 pl-4 pr-8 border-y border-[#222729]">
                <div className="truncate w-full max-w-[180px] overflow-hidden whitespace-nowrap">
                  {formatDate(u.createdAt)}
                </div>
              </td>

              <td className="py-8 pl-4 pr-8 border-y border-[#222729]">
                <div className="truncate w-full max-w-[180px] overflow-hidden whitespace-nowrap">
                  {formatDate(u.updatedAt)}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>



    </div>
















  );

}