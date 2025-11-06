// scripts/seed.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // ----- Usuários -----
  const admin = await prisma.user.create({
    data: {
      name: 'Admin Master',
      email: 'admin@example.com',
      phoneNumber: '11999990000',
      cpf: '11111111111',
      age: 35,
      role: 'ADMIN',
      addresses: {
        create: [
          { street: 'Av. Central, 1000', zipCode: '01000-000', state: 'SP', additional: 'Sala 101' },
        ],
      },
    },
  });

  const alice = await prisma.user.create({
    data: {
      name: 'Alice Braga',
      email: 'alice.consultor@example.com',
      phoneNumber: '11988880000',
      cpf: '22222222222',
      age: 28,
      role: 'CONSULTANT',
      addresses: {
        create: [
          { street: 'Rua das Flores, 200', zipCode: '02000-000', state: 'SP', additional: '' },
        ],
      },
    },
  });

  const bruno = await prisma.user.create({
    data: {
      name: 'Bruno Silvestre',
      email: 'bruno.consultor@example.com',
      phoneNumber: '11977770000',
      cpf: '33333333333',
      age: 30,
      role: 'CONSULTANT',
      addresses: {
        create: [
          { street: 'Av. Paulista, 1500', zipCode: '01310-000', state: 'MG', additional: 'Conj. 1203' },
        ],
      },
    },
  });

  // ----- Clientes -----
  const carla = await prisma.client.create({
    data: {
      name: 'Carla Maria',
      email: 'carla.cliente@example.com',
      phoneNumber: '11966660000',
      cpf: '44444444444',
      age: 25,
      consultantId: alice.id,
      addresses: {
        create: [
          { street: 'Rua A, 10', zipCode: '03000-000', state: 'SP', additional: '' },
        ],
      },
    },
  });

  const daniel = await prisma.client.create({
    data: {
      name: 'Daniel dos Santos',
      email: 'daniel.cliente@example.com',
      phoneNumber: '11955550000',
      cpf: '55555555555',
      age: 32,
      consultantId: bruno.id,
      addresses: {
        create: [
          { street: 'Rua B, 20', zipCode: '04000-000', state: 'RJ', additional: '' },
        ],
      },
    },
  });

  const eduardo = await prisma.client.create({
    data: {
      name: 'Eduardo Oliveira',
      email: 'eduardo.cliente@example.com',
      phoneNumber: '11944440000',
      cpf: '66666666666',
      age: 29,
      consultantId: alice.id,
      addresses: {
        create: [
          { street: 'Rua C, 30', zipCode: '05000-000', state: 'MG', additional: 'Apto 202' },
        ],
      },
    },
  });

  const nazare = await prisma.client.create({
    data: {
      name: 'Nazaré Tedesco',
      email: 'nazare.cliente@example.com',
      phoneNumber: '11945546722',
      cpf: '77777777777',
      age: 47,
      consultantId: alice.id,
      addresses: {
        create: [
          { street: 'Rua D, 40', zipCode: '06000-000', state: 'SP', additional: 'Escadarias Selvagens' },
        ],
      },
    },
  });

  console.log('Seed completo: usuários, consultores, admins, clientes e endereços adicionados!');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
