import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/logo.png"
import {AuthModal} from "@/components/AuthModal";

export function Navbar(){
    return(
        <div className="flex py-5 items-center justify-between">
            <Link href="/public" className={"flex items-center gap-2"}>
                <Image src={Logo} alt={"Logo"} className={"size-10"}/>
                <h4 className={"text-3xl font-semibold"}>Cal<span>Marshal</span></h4>
            </Link>
        <AuthModal/>
        </div>
    )
}