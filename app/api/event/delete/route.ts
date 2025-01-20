import {NextRequest, NextResponse} from "next/server";
import {auth} from "@/app/lib/auth";
import prisma from "@/app/lib/db";

export async function DELETE(req: NextRequest) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }
    try{
        const {eventTypeId} = await req.json();
        const data = await prisma.eventType.delete({
            where: {
                userId: session.user.id,
                id: eventTypeId
            }
        })
        if(!data) {
            return NextResponse.json({error: "Something went wrong with database"}, {status: 500});
        }
        return NextResponse.json({data: "success"}, {status: 200});
    }catch(error){
        console.error(error);
        return NextResponse.json({error: "Something went wrong"}, {status: 500});
    }
}