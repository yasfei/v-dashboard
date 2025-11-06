import "./globals.css";
import { ReactNode } from "react";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "Dashboard - Varos",
  description: "Teste técnico - Dashboard",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Navbar />
        <main className="container-max">{children}</main>
      </body>
    </html>
  );
}
