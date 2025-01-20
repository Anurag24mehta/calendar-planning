import {auth} from "@/app/lib/auth";
import {redirect} from "next/navigation";
import prisma from "@/app/lib/db";
import {z} from "zod";
import {NextResponse} from "next/server";

// const DayEnum = z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
//
// const availabilitySchema = z.object({
//     day: DayEnum,
//     isActive: z.boolean(),
//     fromTime: z.string(),
//     tillTime: z.string(),
// })

interface AvailabilityFormProps {
    initialData: { day: string; isActive: boolean; fromTime: string; tillTime: string }[];
}


export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }
    try{
        const data = await req.json();
        for (let i = 0;i<7;i++){
            const user = await prisma.user.update({
                where: {
                    id: session.user.id
                },
                data: {
                    availability: {
                        updateMany: {
                            where: {
                                day: data[i].day
                            },
                            data: {
                                isActive: data[i].isActive,
                                fromTime: data[i].fromTime,
                                tillTime: data[i].tillTime
                            }
                        }
                    }
                }
            })
            if(!user) {
                throw new Error("Something went wrong with updating availability");
            }
        }
        return NextResponse.json({data: "success"}, {status: 200});
    }catch(error){
        console.error(error);
        return NextResponse.json({error: "Something went wrong"}, {status: 500});
    }
}