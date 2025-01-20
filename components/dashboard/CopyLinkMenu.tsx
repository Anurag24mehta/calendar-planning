"use client"
import {DropdownMenuItem} from "@/components/ui/dropdown-menu";
import {Link2} from "lucide-react";
import {toast} from "@/hooks/use-toast";

export function CopyLinkMenu({meetingUrl}: {meetingUrl: string}) {
    const handleCopy = async () =>{
        try{
            await navigator.clipboard.writeText(meetingUrl);
            toast({
                variant: "default",
                title: "Copied to clipboard",
            })
        }catch(error){
            console.error(error);
            toast({
                variant: "destructive",
                title: "Failed to copy to clipboard",
            })
        }
    }
    return (
        <DropdownMenuItem onSelect={handleCopy}>
            <Link2 className={"mr-2 size-4"}/>Copy
        </DropdownMenuItem>
    )
}