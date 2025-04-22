import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    const { id } = params;

    if (!id) {
        return NextResponse.json({ error: "ID não fornecido." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("finance");

    try {
        const result = await db
            .collection("recurring_expenses")
            .deleteOne({ _id: new ObjectId(id) });

        return NextResponse.json({ deletedCount: result.deletedCount });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao deletar gasto fixo." }, { status: 500 });
    }
}