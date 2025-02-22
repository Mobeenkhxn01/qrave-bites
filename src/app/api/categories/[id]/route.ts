import { NextRequest,NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {

    const url = new URL(request.url);

    const id = url.searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Categories ID is required' }, { status: 400 });
    }

    const category = await prisma.category.findUnique({
        where: {
            id: String(id),
        },
    });

    if (!category) {
        return NextResponse.json({ error: 'Catergor not found' }, { status: 404 });
    }

    return NextResponse.json({ category }, { status: 200 });

}