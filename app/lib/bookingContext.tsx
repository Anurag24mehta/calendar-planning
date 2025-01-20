"use client"
import React, { createContext, useContext, useState } from 'react';
import {getLocalTimeZone, today} from "@internationalized/date";

interface DataContextType {
    date: string;
    setDate: React.Dispatch<React.SetStateAction<string>>;
    time: string;
    setTime: React.Dispatch<React.SetStateAction<string>>;
}


const DataContext = createContext<DataContextType>(null!);

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children } : { children: React.ReactNode }) => {
    const [date, setDate] = useState(today(getLocalTimeZone()).toString());
    const [time, setTime] = useState(" ");

    return (
        <DataContext.Provider value={{ date, setDate , time, setTime}}>
            {children}
        </DataContext.Provider>
    );
};
