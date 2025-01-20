import {auth} from "@/app/lib/auth";
import {NextResponse} from "next/server";
import prisma from "@/app/lib/db";

export async function POST(req: Request) {
    try {
        const { fullName, image } = await req.json();
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ message: "Unauthorized", status: 401 });
        }
        const user = await prisma.user.update({
            where: { id: session.user.id },
            data: { name: fullName, image },
        });
        if (!user) {
            return NextResponse.json({ message: "Something went wrong with updating user", status: 500 });
        }
        return NextResponse.json({ message: "success", status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Something went wrong", status: 500 });
    }
}