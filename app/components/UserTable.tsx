"use client";
import { User, Client, Address } from "../../src/types/models";

interface UserTableProps {
  users: (User | Client)[];
  loading: boolean;
}


export default function UserTable({ users, loading }: UserTableProps) {
  return (
    <div className="bg-[#222729] rounded-xl mt-8 p-6 w-full shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b border-[#2a2a2a]">
              <th className="p-3">Nome</th>
              <th className="p-3">Email</th>
              <th className="p-3">Telefone</th>
              <th className="p-3">CPF</th>
              <th className="p-3">Idade</th>
              <th className="p-3">Endereço</th>
              <th className="p-3">Criado em</th>
              <th className="p-3">Atualizado em</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="p-3 text-center text-gray-400" colSpan={8}>
                  Carregando usuários...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td className="p-3 text-center text-gray-400" colSpan={8}>
                  Nenhum usuário encontrado
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-[#2a2a2a] hover:bg-[#1a1c1d] transition"
                >
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{(user as Client).phoneNumber ?? "-"}</td>
                  <td className="p-3">{(user as Client).cpf ?? "-"}</td>
                  <td className="p-3">{(user as Client).age ?? "-"}</td>
                  <td className="p-3">
                    {(user as Client).addresses?.map((a: Address) => a.street).join(", ") ?? "-"}
                  </td>
                  <td className="p-3">
                    {(user as Client).createdAt
                      ? new Date((user as Client).createdAt!).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="p-3">
                    {(user as Client).updatedAt
                      ? new Date((user as Client).updatedAt!).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
