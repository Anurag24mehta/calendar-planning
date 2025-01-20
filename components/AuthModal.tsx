"use client"
import {Dialog, DialogContent, DialogHeader, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import Image from "next/image";
import Logo from "@/public/logo.png"
import {signIn} from "next-auth/react";
import {useState} from "react";
import {useToast} from "@/hooks/use-toast";

export function AuthModal(){
    const {toast} = useToast();
    const [loading, setLoading] = useState(false);
    const handleSignIn = async()=>{
        setLoading(true);
        try{
            await signIn("google");
        }catch(error){
            console.error("Error signing in:",error);
            toast({
                variant: "destructive",
                title: "Error signing in",
                description: "Please try again later"
            })
            throw new Error("Failed to sign in");
        }finally{
            setLoading(false)
        }
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Try for free</Button>
            </DialogTrigger>
            <DialogContent className={"sm:max-w-[360px]"}>
                <DialogHeader className={"flex-row items-center gap-2"}>
                    <Image src={Logo} alt={"Logo"} className={"size-10"}/>
                    <h4 className={"text-3xl font-semibold"}>Cal<span>Marshal</span></h4>
                </DialogHeader>
                <div className={"flex flex-col mt-5"}>
                        <Button onClick={handleSignIn} disabled={loading}>
                            {loading ? "Signing in..." : "Sign in with Google"}
                        </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}