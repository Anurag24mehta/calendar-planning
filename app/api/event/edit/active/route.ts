import {auth} from "@/app/lib/auth";
import {NextResponse} from "next/server";
import prisma from "@/app/lib/db";

export async function PATCH(req: Request) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }
    try{
        const {eventTypeId, isChecked} = await req.json();
        const data = await prisma.eventType.update({
            where: {
                id: eventTypeId,
                userId: session.user.id
            },
            data: {
                active: isChecked
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