import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function DELETE(
    req: Request,
    context: { params: Promise<{ id: string }> } // 👈 repare no `Promise`
) {
    const { id } = await context.params; // 👈 await aqui resolve tudo certinho

    if (!id) {
        return NextResponse.json({ error: "ID não fornecido." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("finance");

    try {
        const result = await db
            .collection("expenses")
            .deleteOne({ _id: new ObjectId(id) });

        return NextResponse.json({ deletedCount: result.deletedCount });
    } catch (error) {
        console.error("Erro ao deletar:", error);
        return NextResponse.json(
            { error: "Erro ao deletar despesa." },
            { status: 500 }
        );
    }
}
