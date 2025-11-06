import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const users = await prisma.user.findMany({
    include: {
      clients: true,
    },
  });

  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      cpf,
      age,
      type, //  "CLIENT", "CONSULTANT", "ADMIN"
      cep,
      state,
      address,
      complement,
      clients,
    } = body;

    let newEntry;

    if (type === "CLIENT") {
      // Cria um cliente
      newEntry = await prisma.client.create({
        data: {
          name,
          email,
          phoneNumber: phone,
          cpf,
          age: age ? Number(age) : null,
          addresses: {
            create: [
              {
                zipCode: cep,
                state,
                street: address,
                additional: complement,
              },
            ],
          },
          consultant: clients?.length
            ? { connect: { id: clients[0] } } // conecta o primeiro consultor, se existir
            : undefined,
        },
      });
    } else {
      // Cria um usuário (Consultor ou Admin)
      newEntry = await prisma.user.create({
        data: {
          name,
          email,
          phoneNumber: phone,
          cpf,
          age: age ? Number(age) : null,
          role: type,
          addresses: {
            create: [
              {
                zipCode: cep,
                state,
                street: address,
                additional: complement,
              },
            ],
          },
          clients: clients?.length
            ? { connect: clients.map((id: number) => ({ id })) }
            : undefined,
        },
      });
    }

    return NextResponse.json(newEntry);
  } catch (error) {
    console.error("Erro ao criar usuário", error);
    return NextResponse.json(
      { error: "Erro ao criar registro" },
      { status: 500 }
    );
  }
}


export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id)
    return new Response(JSON.stringify({ error: "ID não informado" }), {
      status: 400,
    });

  try {
    const deleted = await prisma.user.delete({ where: { id: Number(id) } });
    return new Response(JSON.stringify(deleted), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Erro ao deletar usuário" }), {
      status: 500,
    });
  }
}
