"use client";

import { useState, useRef, useEffect } from "react";
import { LuChevronDown } from "react-icons/lu";
import { IoCheckmarkSharp } from "react-icons/io5";

interface Client {
    id: number;
    name: string;
}

interface MultiSelectInputProps {
    options: Client[];
    selected: Client[];
    onChange: (newSelected: Client[]) => void;
    disabled?: boolean;
}

export default function MultiSelectInput({
    options,
    selected,
    onChange,
    disabled = false,
}: MultiSelectInputProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Fecha dropdown ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleOption = (option: Client) => {
        if (selected.some((item) => item.id === option.id)) {
            onChange(selected.filter((item) => item.id !== option.id));
        } else {
            onChange([...selected, option]);
        }
    };

    return (
        <div
            ref={containerRef}
            className={`relative w-full ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
            {/* Input que mostra os selecionados */}
            <div
                className="bg-[#131516] text-[#878D96] border border-[#2a2a2a] rounded-md px-3 py-2 w-full flex items-center justify-between cursor-pointer min-h-36px"
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                <span className="flex-1 text-sm text-[#878D96]">
                    {selected.length > 0
                        ? selected.map((item) => item.name).join(", ")
                        : "Selecionar clientes..."}
                </span>
                {/* Seta do dropdown */}
                <LuChevronDown
                    className={`ml-2 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"
                        }`}
                    size={25}
                />
            </div>

            {/* Dropdown */}
            {isOpen && !disabled && (
                <div className="absolute top-full left-0 w-full max-h-60 overflow-auto bg-[#131516] border border-[#2a2a2a] rounded-md mt-1 z-10 shadow-lg">
                    {options.map((option) => {
                        const isSelected = selected.some((item) => item.id === option.id);
                        return (
                            <div
                                key={option.id}
                                className={`px-3 py-2 cursor-pointer hover:bg-[#222729] flex justify-between items-center ${isSelected ? "bg-[#222729]" : ""
                                    }`}
                                onClick={() => toggleOption(option)}
                            >
                                <span>{option.name}</span>
                                {isSelected && <IoCheckmarkSharp className=" text-gray-400" size={18} />}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
