export interface Address {
  id?: number;
  zipCode?: string;
  state?: string;
  street?: string;
  additional?: string;
}

export type Role = "ADMIN" | "CONSULTANT";

export interface Client {
  id: number;
  name?: string;
  email: string;
  phoneNumber?: string;
  cpf: string;
  age?: number;
  addresses?: Address[];
  consultantId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: number;
  name?: string;
  email: string;
  phoneNumber?: string;
  cpf: string;
  age?: number;
  role?: Role;
  addresses?: Address[];
  clients?: Client[];
  createdAt?: string;
  updatedAt?: string;
}
