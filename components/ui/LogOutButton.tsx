"use client"

import { useState } from 'react';
import {signOut} from "@/app/lib/auth";
import {DropdownMenuItem} from "@/components/ui/dropdown-menu";


export function LogOutButton() {
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await signOut();
        } catch (error) {
            console.error("Error logging Out",error)
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
            {isLoggingOut ? 'Logging Out...' : 'Logout'}
        </DropdownMenuItem>
    );
};