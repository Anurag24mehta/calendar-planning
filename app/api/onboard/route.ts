import {onboardingSchema} from "@/schemas/onboardingSchema";
import { PrismaClient } from "@prisma/client";
import {NextResponse} from "next/server";
import {auth} from "@/app/lib/auth";


const prisma = new PrismaClient();
export async function POST(req: Request) {
    try{
        const  {fullName, username} = await req.json();
        const result = onboardingSchema.safeParse({fullName, username});
        if (!result.success) {
            return NextResponse.json({message: result.error.errors, status: 400});
        }else{
            const session = await auth();
            if (!session?.user) {
                return NextResponse.json({message: "Unauthorized", status: 401});
            }
            const user = await prisma.user.update({
                where: {id: session.user.id},
                data: {name: fullName, username,
                    availability: {
                    createMany: {
                        data: [
                            {day: "Monday", fromTime: "08:00", tillTime: "17:00"},
                            {day: "Tuesday", fromTime: "08:00", tillTime: "17:00"},
                            {day: "Wednesday", fromTime: "08:00", tillTime: "17:00"},
                            {day: "Thursday", fromTime: "08:00", tillTime: "17:00"},
                            {day: "Friday", fromTime: "08:00", tillTime: "17:00"},
                            {day: "Saturday", fromTime: "08:00", tillTime: "17:00"},
                            {day: "Sunday", fromTime: "08:00", tillTime: "17:00"},
                        ]
                    }
                    }
                }
            });
            if (!user) {
                return NextResponse.json({message: "Something went wrong with updating user", status: 500});
            }

            return NextResponse.json({message: "success", status: 200});
        }
    }catch(error){
        console.error(error);
        return NextResponse.json({message: "Something went wrong", status: 500});
    }
}