import {PrismaClient} from "@prisma/client";
import {NextApiRequest} from "next";
import {NextResponse} from "next/server";
import {z} from "zod";
import {auth} from "@/app/lib/auth";
import {usernameValidation} from "@/schemas/onboardingSchema";

const prisma = new PrismaClient();

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(req: Request) {
    try{
        const username = new URL(req.url).searchParams.get("username");
        const result = UsernameQuerySchema.safeParse({username});
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({isUnique: false, message: "Unauthorized"});
        }
        if (!result.success) {
            return NextResponse.json({isUnique: false, message: result.error.errors});
        }
        const user = await prisma.user.findUnique({where: {username: username as string}});
        if (user) {
            return NextResponse.json({isUnique: false, message: "Username already exists"});
        }
        return NextResponse.json({isUnique: true, message: "Username is unique"});

    }catch(error){
        console.error(error);
        return NextResponse.json({isUnique: false, message: "Something went wrong", error});
    }
}