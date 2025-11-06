import React, { useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error";
  duration?: number;
  onClose: () => void;
}

export default function Toast({ message, type = "success", duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`fixed top-5 right-5 px-4 py-2 rounded shadow-lg text-white transition-transform transform ${
      type === "success" ? "bg-green-500" : "bg-red-500"
    }`}>
      {message}
    </div>
  );
}
