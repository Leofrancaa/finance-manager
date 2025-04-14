import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    const client = await clientPromise;
    const db = client.db("finance");

    try {
        const result = await db
            .collection("expenses")
            .deleteOne({ _id: new ObjectId(params.id) });

        return NextResponse.json({ deletedCount: result.deletedCount });
    } catch (error) {
        console.error("Erro ao deletar:", error);
        return NextResponse.json(
            { error: "Erro ao deletar despesa." },
            { status: 500 }
        );
    }
}
