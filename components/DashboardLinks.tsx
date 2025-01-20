"use client"
import {HomeIcon, User2, CalendarCheck, Settings} from "lucide-react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {clsx} from "clsx";
interface iAppProps {
    id: number;
    name: string;
    href: string;
    icon: React.ReactNode | string;
}
export const dashboardLinks : iAppProps[] = [
    {
        id: 0,
        name: "Event Types",
        href: "/dashboard",
        icon: <HomeIcon className={"size-4"}/>
    },
    {
        id: 1,
        name: "Meetings",
        href: "/dashboard/meetings",
        icon: <User2 className={"size-4"}/>
    },
    {
        id: 2,
        name: "Availability",
        href: "/dashboard/availability",
        icon: <CalendarCheck className={"size-4"}/>
    },
    {
        id:3,
        name: "Settings",
        href: "/dashboard/settings",
        icon: <Settings className={"size-4"}/>
    }

]

export function DashboardLinks(){
    const pathname = usePathname();

    return(
        <>
            {dashboardLinks.map((link)=>(
                <Link
                    key={link.id}
                    href={link.href}
                    className={clsx(
                        "flex items-center gap-2 p-2 rounded-md transition-colors duration-300",
                        pathname === link.href
                            ? "text-red-500 bg-red-100 font-bold"
                            : "text-gray-700 hover:text-gray-900"
                    )}>
                    {link.icon}
                    {link.name}
                </Link>
            ))}
        </>
    )
}