"use client";

import { useState, useRef, useEffect } from "react";
import { LuChevronDown } from "react-icons/lu";

interface Option {
  label: string;
  value: string;
}

interface CustomSelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export default function CustomSelect({
  label,
  value,
  onChange,
  options,
  disabled = false,
  placeholder = "Selecione uma opção",
  className = "", 
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);





  const handleSelect = (option: Option) => {
    onChange(option.value);
    setIsOpen(false);
  };


  return (
    <div className="w-full relative" ref={containerRef}>
      {label && <label className="label-modal">{label}</label>}

      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`border border-[#2a2a2a] rounded-md px-3 py-2 w-full flex justify-between items-center cursor-pointer ${className || "bg-[#222729]"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <span className={`text-sm ${selectedOption ? "text-[#878D96]" : "text-gray-500"}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        <LuChevronDown
          className={`text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"
            }`}
          style={{ width: "20px", height: "20px" }}
        />
      </div>




      {isOpen && !disabled && (
        <div
          className="absolute top-full left-0 w-full mt-1 border border-[#2a2a2a] rounded-md shadow-lg z-10 bg-[#222729]"
        >

          {options.map(option => (
            <div
              key={option.value}
              onClick={() => handleSelect(option)}
              className={`px-3 py-2 cursor-pointer hover:bg-[#333333] ${value === option.value ? "bg-[#333333]" : ""
                }`}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

