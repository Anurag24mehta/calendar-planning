"use client"
import React, { createContext, useContext, useState } from 'react';
import {getLocalTimeZone, today} from "@internationalized/date";

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    const [date, setDate] = useState(today(getLocalTimeZone()).toString());
    const [time, setTime] = useState(null);

    return (
        <DataContext.Provider value={{ date, setDate , time, setTime}}>
                {children}
        </DataContext.Provider>
    );
};
