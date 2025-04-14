import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("finance");
  const expenses = await db.collection("expenses").find({}).toArray();
  return NextResponse.json(expenses);
}

export async function POST(req: Request) {
  const client = await clientPromise;
  const db = client.db("finance");
  const body = await req.json();

  console.log("Recebendo dados:", body);

  try {
    // Inserindo a nova despesa no MongoDB
    const res = await db.collection("expenses").insertOne(body);
    return NextResponse.json(res);
  } catch (error) {
    console.error("Erro ao inserir no MongoDB:", error);
    return NextResponse.json({ error: "Erro ao salvar despesa." }, { status: 500 });
  }
}
