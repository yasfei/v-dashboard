"use client";

import { useRef, useEffect, useState } from "react";
import UserModal from "../components/UserModal";
import UserTable from "../dashboard/UserTable";
import CustomSelect from "../components/CustomSelect";
import { User, Client } from "../../src/types/models";
import Toast from "../components/Toast";
import { GoArrowUpRight } from "react-icons/go";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa6";
import { BsPlusLg } from "react-icons/bs";


export default function DashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [consultants, setConsultants] = useState<User[]>([]);
  const [selectedConsultant, setSelectedConsultant] = useState<string | "all">(
    "all"
  );
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | Client | null>(null);
  const [showConsultants, setShowConsultants] = useState(false);

  const [filteredClients, setFilteredClients] = useState<Client[]>([]); // clientes já filtrados
  const [openPeriod, setOpenPeriod] = useState(false);
  const periodRef = useRef<HTMLDivElement>(null);

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToast({ message, type });
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, clientsRes] = await Promise.all([
        fetch("/api/users").then((r) => r.json()),
        fetch("/api/clients").then((r) => r.json()),
      ]);
      setUsers(usersRes);
      setClients(clientsRes);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchConsultants = async () => {
    try {
      const res = await fetch("/api/users?type=CONSULTANT");
      const data = await res.json();
      setConsultants(data);
    } catch (err) {
      console.error("Erro ao buscar consultores:", err);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const resUsers = await fetch("/api/users");
      const resClients = await fetch("/api/clients");

      const usersData = await resUsers.json();
      const clientsData = await resClients.json();

      setUsers(usersData);
      setClients(clientsData);
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
    } finally {
      setLoading(false);
    }
  };

  const [selectedPeriod, setSelectedPeriod] = useState<{
    mode: "qualquer" | "intervalo";
    start: Date | null;
    end: Date | null;
  }>({
    mode: "qualquer",
    start: null,
    end: null,
  });

  const endOfDay = (date: Date) => {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
  };


  const handleDateChange = (field: "start" | "end", value: string) => {
    const newPeriod = {
      ...selectedPeriod,
      [field]: value ? new Date(value) : null,
      mode: "intervalo" as const,
    };
    setSelectedPeriod(newPeriod);

    if (newPeriod.start && newPeriod.end) {
      setOpenPeriod(false);
    }
  };

  // Date em YYYY-MM-DD fuso local
  const formatDateLocal = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };


  useEffect(() => {
    fetchUsers();
  }, []);

  // fecha ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (periodRef.current && !periodRef.current.contains(event.target as Node)) {
        setSelectedPeriod(prev =>
          prev.mode === "intervalo" ? { ...prev, mode: "qualquer" } : prev
        );
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  useEffect(() => {
    fetchData();
    fetchConsultants();
  }, []);

  useEffect(() => {
    const fetchClientsForConsultant = async () => {
      try {
        const url =
          selectedConsultant === "all"
            ? "/api/clients"
            : `/api/clients?consultantId=${selectedConsultant}`;

        const res = await fetch(url);
        const data: Client[] = await res.json();

        const filteredClients = data.filter((client) => {
          const created = client.createdAt ? new Date(client.createdAt) : null;
          const updated = client.updatedAt ? new Date(client.updatedAt) : null;

          if (!selectedPeriod.start || !selectedPeriod.end) return true;

          return (
            (created &&
              created >= selectedPeriod.start &&
              created <= selectedPeriod.end) ||
            (updated &&
              updated >= selectedPeriod.start &&
              updated <= selectedPeriod.end)
          );
        });

        setClients(filteredClients);
      } catch (err) {
        console.error("Erro ao buscar clientes:", err);
      }
    };

    fetchClientsForConsultant();
  }, [
    selectedConsultant,
    selectedPeriod.mode,
    selectedPeriod.start?.getTime(),
    selectedPeriod.end?.getTime(),
  ]);

  const handleUserCreated = (newUser: User | Client | null) => {
    if (!newUser) return;

    if ("type" in newUser && newUser.type === "CLIENT") {
      setClients((prev) => [...prev, newUser]);
    } else {
      setUsers((prev) => [...prev, newUser]);
      if ("type" in newUser && newUser.type === "CONSULTANT") {
        setConsultants((prev) => [...prev, newUser]);
      }
    }
    setToast({
      message: `${newUser.name} foi criado com sucesso!`,
      type: "success",
    });
  };

  const handleUserDeleted = async (user: User | Client) => {
    try {
      // rota pelo tipo
      const endpoint =
        "type" in user && user.type === "CONSULTANT" ? "users" : "clients";
      await fetch(`/api/${endpoint}?id=${user.id}`, { method: "DELETE" });

      // Atualiza as listas
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      setClients((prev) => prev.filter((c) => c.id !== user.id));
      setConsultants((prev) => prev.filter((c) => c.id !== user.id));

      setShowModal(false);
      setToast({ message: "Usuário excluído com sucesso!", type: "success" });

      // refaz fetch
      fetchData();
    } catch (err) {
      console.error(err);
      setToast({ message: "Erro ao excluir usuário", type: "error" });
    }
  };

  const handleRowClick = (user: User | Client) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const displayedUsers =
    selectedConsultant === "all"
      ? clients
      : clients.filter((c) => c.consultantId === Number(selectedConsultant));

  const refreshData = async () => {
    await fetchData();
    await fetchConsultants();
  };

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(displayedUsers.length / itemsPerPage);

  const paginatedUsers = displayedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen px-4 sm:px-6 md:px-8 py-10 bg-[#131313] text-white">
      {/* <div className="w-full max-w-[95%] sm:max-w-[90%] md:max-w-5xl lg:max-w-6xl xl:max-w-[1400px] 2xl:max-w-[1600px] flex flex-col gap-6">

  </div> */}
      <div className="w-full max-w-[95%] sm:max-w-[90%] md:max-w-[88%] lg:max-w-[85%] xl:max-w-6xl 2xl:max-w-[1400px] mx-auto flex flex-col gap-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        {/* Linha principal */}
        <div className="flex flex-wrap justify-between items-end gap-6">
          {/* Total de usuários */}
          <div className="flex flex-col gap-2 justify-center items-left p-4 bg-[#131516] border border-[#222729] w-[210px] h-[150px]">
            <p className="text-sm text-gray-400">Total de clientes</p>
            <div className="flex items-center gap-2">
              <h2 className="text-4xl font-bold text-gray-100">
                {displayedUsers.length}
              </h2>
              <GoArrowUpRight className="text-[#19C819] text-3xl" />
            </div>
            <p className="text-sm text-gray-400">Nos últimos 7 dias</p>
          </div>

          <div className="flex flex-col gap-2">
            {/* Cabeçalho com botão */}
            <div className="flex justify-end mb-1">
              <button
                className="flex items-center bg-[#1B3F1B] border-[#222729] text-[#00F700] hover:bg-[#245824] px-5 py-4 rounded-md font-medium transition"
                onClick={() => {
                  setSelectedUser(null);
                  setShowModal(true);
                }}
              >
                Criar usuário
                <BsPlusLg className="ml-4 w-4 h-4" />
              </button>
            </div>

            {/* Faixa de filtros */}
            <div className="flex-1 min-w-[500px] max-w-[900px] bg-[#131313] border border-[#222729] rounded-xl px-6 py-3 flex items-center gap-4 overflow-visible">

              {/* Consultor */}
              <div className="flex items-center gap-2 flex-none w-[255px]">
                <label className="text-sm text-gray-400 whitespace-nowrap ">Consultor:</label>

                <CustomSelect
                  value={selectedConsultant}
                  onChange={(value) => setSelectedConsultant(value)}
                  options={[
                    { label: "Todos", value: "all" },
                    ...consultants.map((c) => ({ label: c.name ?? "", value: String(c.id) })),
                  ]}
                  placeholder="Selecione"
                  className="flex-1 h-10 min-w-0 bg-[#222729] text-gray-400 rounded-md"
                />

              </div>

              {/* E-mail do consultor */}
              <div className="flex items-center gap-2 flex-none w-[280px]">
                <label className="text-sm text-gray-400 whitespace-nowrap">E-mail do consultor:</label>
                <div className="flex-1 min-w-0">
                  <input
                    type="email"
                    value={
                      selectedConsultant !== "all"
                        ? consultants.find((c) => String(c.id) === selectedConsultant)?.email || ""
                        : ""
                    }
                    readOnly
                    placeholder="exemplo@empresa.com"
                    className="w-full h-10 bg-[#222729] border border-[#222729] rounded-lg px-3 py-1.5 text-gray-400 text-sm cursor-not-allowed focus:outline-none"
                  />
                </div>
              </div>

              {/* Período */}
              <div className="flex items-center gap-2 flex-none w-[255px] relative" ref={periodRef}>
                <label className="text-sm text-gray-400 whitespace-nowrap">Período:</label>
                <div className="flex-1 min-w-0 relative">
                  <input
                    type="text"
                    readOnly
                    placeholder={
                      selectedPeriod.start && selectedPeriod.end
                        ? `${selectedPeriod.start.toLocaleDateString()} até ${selectedPeriod.end.toLocaleDateString()}`
                        : "Selecione um período"
                    }
                    onClick={() =>
                      setSelectedPeriod(prev => ({ ...prev, mode: "intervalo" }))
                    }
                    className="w-full h-10 bg-[#222729] border border-[#222729] rounded-lg px-3 py-1.5 text-gray-200 text-sm cursor-pointer focus:outline-none"
                  />
                  {/* Dropdown de datas */}
                  {selectedPeriod.mode === "intervalo" && (
                    <div className="absolute top-full right-0 mt-1 flex gap-2 bg-[#1a1c1e] p-2 rounded-lg shadow-lg z-50 w-max min-w-[280px]">
                      <button
                        type="button"
                        className="text-sm px-2 py-1 bg-[#222729] rounded hover:bg-[#333] transition"
                        onClick={() => setSelectedPeriod({ mode: "qualquer", start: null, end: null })}
                      >
                        Todos
                      </button>

                      <input
                        type="date"
                        className="flex-1 bg-[#131313] border border-[#222729] rounded-lg px-3 py-1.5 text-gray-200 text-sm focus:outline-none focus:border-[#347d39]"
                        value={selectedPeriod.start ? formatDateLocal(selectedPeriod.start) : ""}
                        onChange={(e) => {
                          const [y, m, d] = e.target.value.split("-").map(Number);
                          setSelectedPeriod(prev => ({ ...prev, start: new Date(y, m - 1, d) }));
                        }}
                      />

                      <input
                        type="date"
                        className="flex-1 bg-[#131313] border border-[#222729] rounded-lg px-3 py-1.5 text-gray-200 text-sm focus:outline-none focus:border-[#347d39]"
                        value={selectedPeriod.end ? formatDateLocal(selectedPeriod.end) : ""}
                        onChange={(e) => {
                          const [y, m, d] = e.target.value.split("-").map(Number);
                          const date = new Date(y, m - 1, d);
                          date.setHours(23, 59, 59, 999);
                          setSelectedPeriod(prev => ({ ...prev, end: date }));
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

            </div>



          </div>
        </div>

        <div className="w-full bg-[#131516] border border-[#222729] min-h-[300px]">
  <UserTable
    users={paginatedUsers}
    loading={loading}
    onRowClick={(u) => {
      setSelectedUser(u);
      setShowModal(true);
    }}
    emptyMessage="Nenhum cliente encontrado"
  />
</div>

        {/* Controles de Paginação */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center gap-3 mt-4 justify-center">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-transparent hover:bg-[#222729] disabled:opacity-50"
            >
              <FaChevronLeft />
            </button>

            <span className="text-sm text-gray-400">
              Página {currentPage} de {totalPages}
            </span>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-transparent hover:bg-[#222729] disabled:opacity-50"
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>

      <UserModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        user={selectedUser}
        onUserCreated={handleUserCreated}
        onUserDeleted={handleUserDeleted}
        fetchUsers={fetchUsers}
      />

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
