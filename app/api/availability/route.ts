import {NextRequest, NextResponse} from "next/server";
import {auth} from "@/app/lib/auth";
import {PrismaClient} from "@prisma/client";

export async function GET(req: Request) {
    const prisma = new PrismaClient();
    const session = await auth();
    if(!session?.user) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }
    try{
        const data = await prisma.availability.findMany({
            where: {
                userId: session.user.id,
            },
            select: {
                day: true,
                isActive: true,
                fromTime: true,
                tillTime: true
            }
        });
        if(!data) {
            return NextResponse.json({error: "Something went wrong with database"}, {status: 500});
        }
        return NextResponse.json(data, {status: 200});
    }catch(error){
        console.error(error);
        return NextResponse.json({error: "Something went wrong"}, {status: 500});
    }
}