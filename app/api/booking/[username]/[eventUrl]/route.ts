import {NextRequest, NextResponse} from "next/server";
import prisma from "@/app/lib/db";

export async function GET(req: NextRequest, {params}: {params: {eventUrl: string; username: string}}) {
    const {username, eventUrl} = params;
    try{
        const data = await prisma.user.findUnique({
            where: {
                username: username
            },
            select: {
                image: true,
                name: true,
                availability: {
                    select: {
                        day: true,
                        isActive: true
                    }
                },
                eventType: {
                    where: {
                        url: eventUrl,
                        active: true
                    },
                    select: {
                        id: true,
                        title: true,
                        duration: true,
                        description: true,
                        videoCallSoftware: true,
                    }
                }
            }
        })
        if (!data) {
            return NextResponse.json({error: "User not found"}, {status: 401});
        }
        return NextResponse.json({data}, {status: 200});
    }catch(error){
        console.log(error);
        return NextResponse.json({error: "Something went wrong"}, {status: 500});
    }
}