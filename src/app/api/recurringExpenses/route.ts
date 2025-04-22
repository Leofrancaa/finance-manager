import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
    const client = await clientPromise;
    const db = client.db("finance");
    const recurring = await db.collection("recurring_expenses").find({}).toArray();
    return NextResponse.json(recurring);
}

export async function POST(req: Request) {
    const client = await clientPromise;
    const db = client.db("finance");
    const body = await req.json();

    try {
        const res = await db.collection("recurring_expenses").insertOne(body);
        return NextResponse.json({
            ...body,
            _id: res.insertedId,
            id: String(res.insertedId), // retorna o id string para o frontend
        });
    } catch {
        return NextResponse.json({ error: "Erro ao salvar gasto fixo." }, { status: 500 });
    }
}