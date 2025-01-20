import {NextRequest, NextResponse} from "next/server";
import {NextApiRequest} from "next";
import {auth} from "@/app/lib/auth";
import {nylas, nylasConfig} from "@/app/lib/nylas";
import prisma from "@/app/lib/db";
import {redirect} from "next/navigation";

export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({message: "Unauthorized", status: 401});
    }

    const url = new URL(req.url);
    const code = url.searchParams.get("code");

    if (!code) {
        return NextResponse.json({message: "Code not found", status: 400});
    }
    try{
        const response = await nylas.auth.exchangeCodeForToken({
            clientSecret: nylasConfig.apiKey!,
            clientId: nylasConfig.clientId!,
            redirectUri: nylasConfig.redirectUri,
            code: code

        });
        if (!response) {
            return NextResponse.json({message: "Something went wrong", status: 500});
        }else{
            const { grantId, email} = response;
            await prisma.user.update({
                where: {id: session.user?.id},
                data:{
                    grantId,
                    grantEmail: email
                }
            })
        }
    }catch(error){
        console.error("Something went wrong",error);
        return NextResponse.json({message: "Something went wrong", status: 500});
    }

    redirect("/dashboard");
}