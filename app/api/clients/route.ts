import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const consultantId = url.searchParams.get("consultantId");

    const clients = await prisma.client.findMany({
      where: consultantId ? { consultantId: Number(consultantId) } : {},
      select: {
        id: true,
        name: true,
        email: true,
        cpf: true,
        age: true,
        phoneNumber: true,
        addresses: true,
        createdAt: true,
        updatedAt: true,
        consultantId: true,
        consultant: { select: { name: true } }, 
      },
    });

    return new Response(JSON.stringify(clients), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Erro ao buscar clientes:", err);
    return new Response(JSON.stringify({ error: "Erro ao buscar clientes" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
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
    const deleted = await prisma.client.delete({ where: { id: Number(id) } });
    return new Response(JSON.stringify(deleted), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Erro ao deletar cliente" }), {
      status: 500,
    });
  }
}

export async function PUT(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id"); // id da query
  if (!id) {
    return new Response(JSON.stringify({ error: "ID não informado" }), {
      status: 400,
    });
  }

  let body: any;
  try {
    body = await req.json();
    console.log("ID recebido no backend:", id);
    console.log("Body recebido no backend:", body);
  } catch (err) {
    console.error("Erro ao ler body JSON:", err);
    return new Response(JSON.stringify({ error: "Body inválido" }), {
      status: 400,
    });
  }
  console.log("ID recebido:", id);
  console.log("Body recebido:", body);

  try {
    const existingClient = await prisma.client.findUnique({
      where: { id: Number(id) },
    });
    console.log("Cliente existente:", existingClient);

    if (!existingClient) {
      return new Response(JSON.stringify({ error: "Cliente não encontrado" }), {
        status: 404,
      });
    }

    // addresses para Prisma
    const addressesData = body.addresses?.length
      ? {
          set: body.addresses.map((a: any) => ({
            zipCode: a.zipCode || "",
            street: a.street || "",
            state: a.state || "",
            additional: a.additional || "",
          })),
        }
      : undefined;

    const consultantIdToSend =
      body.consultantId && Number(body.consultantId) !== Number(id)
        ? Number(body.consultantId)
        : undefined;

    await prisma.address.deleteMany({ where: { clientId: Number(id) } });

    const updatedClient = await prisma.client.update({
      where: { id: Number(id) },
      data: {
        name: body.name,
        email: body.email,
        phoneNumber: body.phone,
        cpf: body.cpf,
        age: body.age,
        consultantId: consultantIdToSend,
        addresses: {
          create: body.addresses.map((a: any) => ({
            zipCode: a.zipCode,
            street: a.street,
            state: a.state,
            additional: a.additional,
          })),
        },
      },
    });

    console.log("Cliente atualizado com sucesso:", updatedClient);

    return new Response(JSON.stringify(updatedClient), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Erro ao atualizar cliente no backend:", err);

    if (err.code) {

      console.error("Código do erro Prisma:", err.code);
    }

    return new Response(
      JSON.stringify({
        error: "Erro ao atualizar cliente",
        details: err.message,
      }),
      { status: 500 }
    );
  }
}
