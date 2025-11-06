"use client";

import { useEffect, useState } from "react";
import "../styles/UserModal.css";
import MultiSelectInput from "../components/MultiSelectInput";
import CustomSelect from "./CustomSelect";
import { User, Client } from "../../src/types/models";
import { motion, AnimatePresence } from "framer-motion";


interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    clientsList?: { id: number; name: string }[];
    user?: User | Client | null;
    onUserCreated?: (newUser: any) => void;
    onUserDeleted?: (user: User | Client) => void;
    fetchUsers?: () => void;
}

interface UserTypeSelectProps {
    userType: string;
    setUserType: (value: string) => void;
    disabled?: boolean;
}

interface AppClient {
    id: number;
    name: string;
}


export default function UserModal({ isOpen, onClose, onUserCreated, onUserDeleted, fetchUsers, user }: UserModalProps) {
    const [activeTab, setActiveTab] = useState<"info" | "clients">("info");
    const [userType, setUserType] = useState<string>(user ? ('type' in user ? String(user.type) : "CLIENT") : "CLIENT");
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phoneNumber || '');
    const [cpf, setCpf] = useState(user?.cpf || '');
    const [age, setAge] = useState(user?.age || '');
    const [cep, setCep] = useState(user?.addresses?.[0]?.zipCode ?? "");
    const [state, setState] = useState(user?.addresses?.[0]?.state ?? "");
    const [address, setAddress] = useState(user?.addresses?.[0]?.street ?? "");
    const [complement, setComplement] = useState(user?.addresses?.[0]?.additional ?? "");
    const [clientsList, setClientsList] = useState<AppClient[]>([]);
    const [selectedClients, setSelectedClients] = useState<AppClient[]>([]);
    const [loading, setLoading] = useState(false);

    const [isAnimating, setIsAnimating] = useState(true);
    const [showContent, setShowContent] = useState(false);

    const isEdit = Boolean(user?.id);
    //const [isEdit, setIsEdit] = useState<boolean>(!!user); // true se vier um usuário existente
    const [confirmUpdate, setConfirmUpdate] = useState(false); // controla a confirmação

    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const validateForm = () => {
        if (!name.trim() || !email.trim() || !userType.trim()) {
            alert("Preencha os campos obrigatórios: Nome, Email e Tipo de Usuário");
            return false;
        }
        return true;
    };
    //console.log("Usuário recebido no modal:", user);



    useEffect(() => {
        async function fetchClients() {
            const res = await fetch("/api/clients");
            const data = await res.json();
            setClientsList(data);
        }
        fetchClients();
    }, []);

    useEffect(() => {
        if (user) {
            setName(user.name ?? "");
            setEmail(user.email ?? "");
            setUserType('type' in user ? String(user.type) : "CLIENT");
            setCpf('cpf' in user ? user.cpf ?? "" : "");
            setAge('age' in user ? user.age ?? "" : "");
            setPhone('phoneNumber' in user ? user.phoneNumber ?? "" : "");
            setAddress(user.addresses?.[0]?.street ?? "");
            setState(user.addresses?.[0]?.state ?? "");
            setCep(user.addresses?.[0]?.zipCode ?? "");
            setComplement(user.addresses?.[0]?.additional ?? "");
        } else {
            setName("");
            setEmail("");
            setUserType("CLIENT");
            setCpf("");
            setAge("");
            setPhone("");
            setAddress("");
            setState("");
            setCep("");
            setComplement("");
        }
    }, [user]);

    // CRIAR USUÁRIO
    const handleCreateUser = async () => {


        if (!validateForm()) return;

        setLoadingSubmit(true);
        try {
            const res = await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    email,
                    phone,
                    cpf,
                    age,
                    type: userType,
                    cep,
                    state,
                    address,
                    complement,
                    clients: selectedClients.map(c => c.id),
                }),
            });

            if (!res.ok) throw new Error("Erro ao criar usuário");

            const newUser = await res.json();
            onClose();
            fetchUsers && fetchUsers(); 

            // limpa campos
            setName("");
            setEmail("");
            setPhone("");
            setCpf("");
            setAge("");
            setCep("");
            setState("");
            setAddress("");
            setComplement("");
            setSelectedClients([]);
            setUserType("");
            setActiveTab("info");

        } catch (err) {
            console.error(err);
            alert("Não foi possível criar o usuário.");
        } finally {
            setLoadingSubmit(false);
        }
    };


    // DELETAR CLIENTE
    const handleDelete = async () => {
        if (!user) return;
        try {
            await fetch(`/api/clients/${user.id}`, { method: "DELETE" });
            onUserDeleted && onUserDeleted(user); 
            onClose();
        } catch (err) {
            console.error("Erro ao deletar usuário:", err);
        }
    };

    const handleDeleteClick = () => setConfirmDelete(true);
    const handleConfirmDelete = async () => {
        if (!user) return;
        await handleDelete();
        setConfirmDelete(false);
        onClose();
    };

    const validAddresses = [];
    if (cep || address || state || complement) {
        validAddresses.push({ zipCode: cep, street: address, state, additional: complement });
    }

    const consultantIdToSend = userType === "CONSULTANT" && user?.id !== undefined ? user.id : undefined;



    const updateBody = {
        name,
        email,
        phone: phone,
        cpf,
        age,
        type: userType,
        addresses: validAddresses.length > 0 ? validAddresses : undefined,
        clients: selectedClients.map((c) => c.id),
        consultantId: userType === "CONSULTANT" ? user?.id : undefined

    };



    const handleUpdate = async () => {
        if (!user) return;
        setLoadingSubmit(true);

        try {
            const updateBody = {
                name,
                email,
                phone,
                cpf,
                age,
                type: userType,
                addresses: [
                    {
                        zipCode: cep,
                        street: address,
                        state,
                        additional: complement,
                    },
                ],
                clients: selectedClients.map((c) => c.id),
                consultantId: userType === "CONSULTANT" ? user.id : undefined,

            };
            const res = await fetch(`/api/clients/${user.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updateBody),

            });


            if (!res.ok) {
                const errorText = await res.text();
                console.error("Erro ao atualizar usuário:", errorText);
                throw new Error("Erro ao atualizar usuário");
            }

            const updatedUser = await res.json();
            onUserCreated?.(updatedUser); 
            fetchUsers?.(); // atualiza a lista
            setConfirmUpdate(false);
            onClose();
        } catch (err) {
            console.error(err);
            alert("Não foi possível atualizar o usuário.");

        } finally {
            setLoadingSubmit(false);
        }
    };

    const handleUpdateUserClick = () => setConfirmUpdate(true);


    const handleConfirmUpdate = async () => {
        if (!user) return; // user existe
        setLoadingSubmit(true);

        try {
            const updateBody = {
                name,
                email,
                phone,
                cpf,
                age: Number(age), 
                type: userType,
                addresses: address || cep || state || complement ? [
                    {
                        zipCode: cep || "",
                        street: address || "",
                        state: state || "",
                        additional: complement || "",
                    },
                ] : undefined,
                clients: selectedClients.map((c) => c.id),
                consultantId: userType === "CONSULTANT" ? user.id : undefined,
            };

            console.log("Tentando enviar PUT:", `/api/clients?id=${user.id}`);
            console.log("Corpo do update:", updateBody);

            const res = await fetch(`/api/clients?id=${user.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updateBody),
            });

            console.log("Response status:", res.status);
            console.log("Response ok?", res.ok);

            const resultText = await res.text();
            console.log("Response text:", resultText);

            if (!res.ok) {
                throw new Error(`Erro no fetch PUT: ${resultText}`);
            }

            const updatedUser = JSON.parse(resultText);
            onUserCreated?.(updatedUser);
            fetchUsers?.();
            setConfirmUpdate(false);
            onClose();
        } catch (err) {
            console.error("Erro no fetch PUT:", err);
            alert("Não foi possível atualizar o usuário.");
        } finally {
            setLoadingSubmit(false);
        }
    };










    const formatPhone = (value: string) => {
        const digits = value.replace(/\D/g, "");
        if (digits.length <= 2) return `(${digits}`;
        if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
        if (digits.length <= 10)
            return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
    };

    const formatCpf = (value: string) => {
        const digits = value.replace(/\D/g, "");
        if (digits.length <= 3) return digits;
        if (digits.length <= 6)
            return `${digits.slice(0, 3)}.${digits.slice(3)}`;
        if (digits.length <= 9)
            return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
        return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
    };

    const formatCep = (value: string) => {
        const digits = value.replace(/\D/g, "");
        if (digits.length <= 5) return digits;
        return `${digits.slice(0, 5)}-${digits.slice(5, 8)}`;
    };

    const userTypeOptions = [
        { label: "Consultor", value: "CONSULTANT" },
        { label: "Cliente", value: "CLIENT" },
        { label: "Administrador", value: "ADMIN" },
    ];

    const stateOptions = [
        { label: "Acre (AC)", value: "AC" },
        { label: "Alagoas (AL)", value: "AL" },
        { label: "Amapá (AP)", value: "AP" },
        { label: "Amazonas (AM)", value: "AM" },
        { label: "Bahia (BA)", value: "BA" },
        { label: "Ceará (CE)", value: "CE" },
        { label: "Distrito Federal (DF)", value: "DF" },
        { label: "Espírito Santo (ES)", value: "ES" },
        { label: "Goiás (GO)", value: "GO" },
        { label: "Maranhão (MA)", value: "MA" },
        { label: "Mato Grosso (MT)", value: "MT" },
        { label: "Mato Grosso do Sul (MS)", value: "MS" },
        { label: "Minas Gerais (MG)", value: "MG" },
        { label: "Pará (PA)", value: "PA" },
        { label: "Paraíba (PB)", value: "PB" },
        { label: "Paraná (PR)", value: "PR" },
        { label: "Pernambuco (PE)", value: "PE" },
        { label: "Piauí (PI)", value: "PI" },
        { label: "Rio de Janeiro (RJ)", value: "RJ" },
        { label: "Rio Grande do Norte (RN)", value: "RN" },
        { label: "Rio Grande do Sul (RS)", value: "RS" },
        { label: "Rondônia (RO)", value: "RO" },
        { label: "Roraima (RR)", value: "RR" },
        { label: "Santa Catarina (SC)", value: "SC" },
        { label: "São Paulo (SP)", value: "SP" },
        { label: "Sergipe (SE)", value: "SE" },
        { label: "Tocantins (TO)", value: "TO" },
    ];



    if (!isOpen) return null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            const body = {
                name: name ?? "",
                email: email ?? "",
                cpf: cpf ?? "",
                phone: phone ?? "",
                age: age ?? "",
                cep: cep ?? "",
                state: state ?? "",
                address: address ?? "",
                complement: complement ?? "",
                type: userType ?? "CLIENT",
                clients: selectedClients.map((c) => c.id),
            };

            const res = await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!res.ok) throw new Error("Erro ao criar usuário");

            const newUser = await res.json();
            onUserCreated?.(newUser);
            onClose();
            setSelectedClients([]);
            setUserType("");
        } catch (error) {
            console.error(error);
            alert("Erro ao criar usuário.");
        } finally {
            setLoading(false);
        }
    }



    return (


        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        key="overlay"
                        className="overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ position: "fixed", inset: 0, backgroundColor: "black", zIndex: 10 }}
                        onClick={onClose}
                    />

                    {/* Modal deslizando */}
                    <motion.div
                        key="modal"
                        className="modal-slide"
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "tween", duration: 0.5, ease: "easeInOut" }}
                        style={{
                            position: "fixed",
                            top: 0,
                            right: 0,
                            width: "500px",   
                            height: "100vh",  
                            backgroundColor: "#fff",
                            zIndex: 20,
                            overflow: "hidden", // impede ajuste interno enquanto desliza
                        }}
                    >
                        <div style={{ padding: "20px", width: "100%", height: "100%", overflowY: "auto" }}>


                            {





                                <div className="user-modal-overlay" onClick={onClose}>

                                    <div
                                        className="user-modal-container"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {/* Header */}
                                        <div className="user-modal-header">



                                            {confirmUpdate && (
                                                <div className="flex gap-2 mt-2">
                                                    <button
                                                        onClick={handleConfirmUpdate}
                                                        className="user-modal-btn-create"
                                                        disabled={loadingSubmit}
                                                    >
                                                        Confirmar
                                                    </button>
                                                    <button
                                                        onClick={() => setConfirmUpdate(false)}
                                                        className="user-modal-btn-delete"
                                                        disabled={loadingSubmit}
                                                    >
                                                        Cancelar
                                                    </button>
                                                </div>
                                            )}




                                            {!confirmUpdate && (
                                                <button
                                                    className={isEdit ? "user-modal-btn-create" : "user-modal-btn-create"}
                                                    type="button"
                                                    onClick={isEdit ? handleUpdateUserClick : handleCreateUser}
                                                    disabled={loadingSubmit}
                                                >
                                                    {loadingSubmit
                                                        ? isEdit
                                                            ? "Atualizando..."
                                                            : "Criando..."
                                                        : isEdit
                                                            ? "Editar Usuário"
                                                            : "Criar Usuário"}
                                                </button>
                                            )}


                                            {!confirmDelete ? (
                                                <button onClick={handleDeleteClick} className="user-modal-btn-delete">Deletar usuário</button>
                                            ) : (
                                                <div className="flex gap-2">
                                                    <button onClick={handleConfirmDelete} className="user-modal-btn-delete">Confirmar</button>
                                                    <button onClick={() => setConfirmDelete(false)} className="user-modal-btn-create">Cancelar</button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Form */}
                                        <form onSubmit={handleSubmit}>
                                            <div className="user-modal-form">
                                                <h2 className="text-2xl font-semibold">Criar usuário</h2>
                                                <div className="relative w-full mt-2">
                                                    <CustomSelect
                                                        label="Tipo de usuário"
                                                        value={userType}
                                                        onChange={(value: string) => setUserType(value)}
                                                        options={[
                                                            { label: "Cliente", value: "CLIENT" },
                                                            { label: "Consultor", value: "CONSULTANT" },
                                                        ]}
                                                    />
                                                </div>
                                                <div className="flex gap-4">
                                                    <div className="flex-1">
                                                        <label className="label-modal">Nome</label>
                                                        <input
                                                            className="user-modal-input"
                                                            value={name}
                                                            onChange={(e) => setName(e.target.value)}
                                                            placeholder="Digite o nome"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <label className="label-modal">Telefone</label>
                                                        <input
                                                            value={phone}
                                                            onChange={(e) => setPhone(formatPhone(e.target.value))}
                                                            className="user-modal-input"
                                                            maxLength={15}
                                                            placeholder="Digite o telefone"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="label-modal" >Email</label>
                                                    <input
                                                        className="user-modal-input"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        placeholder="Digite o email"
                                                        required
                                                    />
                                                </div>

                                                {/* Abas */}
                                                <div className="user-modal-tabs">
                                                    <button type="button"
                                                        className={`tab-button ${activeTab === "info" ? "active" : ""}`}
                                                        onClick={() => setActiveTab("info")}
                                                    >
                                                        Informações Básicas
                                                        <span className="tab-indicator"></span>
                                                    </button>

                                                    <button type="button"
                                                        className={`tab-button ${activeTab === "clients" ? "active" : ""}`}
                                                        onClick={() => setActiveTab("clients")}
                                                        disabled={userType !== "CONSULTANT"}
                                                    >
                                                        Adicionar Clientes
                                                        <span className="tab-indicator"></span>
                                                    </button>
                                                </div>


                                                {/* Conteúdo das abas */}
                                                <div className="user-modal-tab-content">
                                                    {activeTab === "info" ? (
                                                        <div className="flex flex-col gap-4 mt-4">
                                                            <div className="flex gap-4">
                                                                <div className="flex-1">
                                                                    <label className="label-modal">Idade</label>
                                                                    <input
                                                                        className="user-modal-input"
                                                                        value={age}
                                                                        onChange={(e) => setAge(e.target.value)}
                                                                        placeholder="Digite a idade"
                                                                    />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <label className="label-modal">CPF</label>

                                                                    <input
                                                                        value={cpf}
                                                                        onChange={(e) => setCpf(formatCpf(e.target.value))}
                                                                        className="user-modal-input"
                                                                        maxLength={14}

                                                                        placeholder="Digite o CPF" />

                                                                </div>
                                                            </div>

                                                            <div className="flex gap-4">
                                                                <div className="flex-1">
                                                                    <label className="label-modal">CEP</label>
                                                                    <input
                                                                        value={cep}
                                                                        onChange={(e) => setCep(formatCep(e.target.value))}
                                                                        className="user-modal-input"
                                                                        maxLength={9}
                                                                        placeholder="Digite o CEP"
                                                                    />

                                                                </div>
                                                                <div className="flex-1">
                                                                    <CustomSelect
                                                                        label="Estado"
                                                                        value={state}
                                                                        onChange={setState}
                                                                        options={stateOptions}
                                                                        placeholder="Selecione o estado"
                                                                    />

                                                                </div>
                                                            </div>

                                                            <div>
                                                                <label className="label-modal">Endereço</label>
                                                                <input
                                                                    className="user-modal-input"
                                                                    value={address}
                                                                    onChange={(e) => setAddress(e.target.value)}
                                                                    placeholder="Digite o Endereço"
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="label-modal">Complemento</label>
                                                                <input
                                                                    className="user-modal-input"
                                                                    value={complement}
                                                                    onChange={(e) => setComplement(e.target.value)}
                                                                    placeholder="Digite o Complemento"
                                                                />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col gap-4 opacity-50">

                                                            {activeTab === "clients" && (
                                                                <div className="flex flex-col gap-4 mt-4">

                                                                    <MultiSelectInput
                                                                        options={clientsList}
                                                                        selected={selectedClients}
                                                                        onChange={setSelectedClients}
                                                                        disabled={userType !== "CONSULTANT"}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>


                                                    )}
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div >


                            }



                        </div>
                    </motion.div>

                </>
            )}
        </AnimatePresence>








    );
}
