import prisma from "@/app/lib/db";
import {NextResponse} from "next/server";

export async function POST(req: Request) {
    try{
        const {username, eventUrl} = await req.json();
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
            return NextResponse.json({status: 404, message: "User not found"});
        }
        return NextResponse.json({status: 200, message: data});
    }catch(error){
        console.error(error);
        return NextResponse.json({message: "Something went wrong", status: 500});
    }
}