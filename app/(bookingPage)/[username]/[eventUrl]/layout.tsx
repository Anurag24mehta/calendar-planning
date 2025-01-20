import {DataProvider} from "@/app/lib/bookingContext";

export default function BookingLayout({ children }: { children: React.ReactNode }) {
    return(
        <>
            <main>
                <DataProvider>
                    {children}
                </DataProvider>
            </main>
        </>
    )
}