import {Ban, PlusCircle} from "lucide-react";
import Link from "next/link";
import {Button} from "@/components/ui/button";


interface EmptyStateProps{
    title: string,
    description: string,
    buttonText: string,
    href: string
}
export function EmptyState({title, description, buttonText, href}: EmptyStateProps){
    return(
        <div className={"flex flex-col flex-1 h-full items-center justify-center rounded-md border-dashed p-8 text-center animate-in fade-in-50"}>
            <div className={"flex items-center justify-center size-20 rohgunded-full bg-red-100"}>
                <Ban className={"size-14 text-red-600"}/>
            </div>
            <h2 className={"mt-6 text-2xl font-semibold"}>
                {title}
            </h2>
            <p className={"mt-2 mb-8 text-sm text-muted-foreground max-w-xs mx-auto"}>{description}</p>
            <Button className={"bg-red-400"} asChild>
                <Link href={href}>
                    <PlusCircle className={"mr-2 size-4"}/>
                    {buttonText}</Link>
            </Button>

        </div>
    )
}